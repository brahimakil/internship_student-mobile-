import { ref, uploadBytes, getDownloadURL, UploadResult } from 'firebase/storage';
import { storage } from './config';

export const uploadFile = async (
  file: Blob,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const storageRef = ref(storage, path);
  
  const uploadResult: UploadResult = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(uploadResult.ref);
  
  return downloadURL;
};

export const uploadCV = async (
  studentId: string,
  file: Blob,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const path = `students/${studentId}/cv_${Date.now()}.pdf`;
  return uploadFile(file, path, onProgress);
};

export const uploadProfilePhoto = async (
  studentId: string,
  file: Blob,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const path = `students/${studentId}/profile_${Date.now()}.jpg`;
  return uploadFile(file, path, onProgress);
};
