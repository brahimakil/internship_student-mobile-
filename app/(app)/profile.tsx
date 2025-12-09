import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Linking } from 'react-native';
import { Screen, Header } from '@/components/layout';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, Card, Button, Input } from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { studentsApi } from '@/services/api';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { student, refreshStudent } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [savingGemini, setSavingGemini] = useState(false);
  const [testingGemini, setTestingGemini] = useState(false);
  
  // Form fields
  const [fullName, setFullName] = useState(student?.fullName || '');
  const [major, setMajor] = useState(student?.major || '');
  const [address, setAddress] = useState(student?.address || '');
  const [cvUrl, setCvUrl] = useState(student?.cvUrl || '');
  const [geminiApiKey, setGeminiApiKey] = useState(student?.geminiApiKey || '');

  const handleEdit = () => {
    setFullName(student?.fullName || '');
    setMajor(student?.major || '');
    setAddress(student?.address || '');
    setCvUrl(student?.cvUrl || '');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!student?.id) return;

    if (!fullName.trim() || !major.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await studentsApi.update(student.id, {
        fullName: fullName.trim(),
        major: major.trim(),
        address: address.trim(),
        cvUrl: cvUrl.trim(),
      });

      await refreshStudent();
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleViewCV = async () => {
    if (student?.cvUrl) {
      const canOpen = await Linking.canOpenURL(student.cvUrl);
      if (canOpen) {
        await Linking.openURL(student.cvUrl);
      } else {
        Alert.alert('Error', 'Cannot open CV URL');
      }
    }
  };

  const handleTestGemini = async () => {
    if (!geminiApiKey.trim()) {
      Alert.alert('Error', 'Please enter a Gemini API key');
      return;
    }

    setTestingGemini(true);
    try {
      // Test the API key with a simple request
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Hello' }] }],
          }),
        }
      );

      if (response.ok) {
        Alert.alert('Success', 'API key is valid!');
      } else {
        Alert.alert('Error', 'Invalid API key');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to test API key');
    } finally {
      setTestingGemini(false);
    }
  };

  const handleSaveGemini = async () => {
    if (!student?.id) return;

    if (!geminiApiKey.trim()) {
      Alert.alert('Error', 'Please enter a Gemini API key');
      return;
    }

    setSavingGemini(true);
    try {
      await studentsApi.updateGeminiKey(student.id, geminiApiKey.trim());
      await refreshStudent();
      Alert.alert('Success', 'Gemini API key saved successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save API key');
    } finally {
      setSavingGemini(false);
    }
  };

  const handleUploadPhoto = async () => {
    if (!student?.id) return;

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow access to your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setUploadingPhoto(true);
      try {
        const uri = result.assets[0].uri;
        await studentsApi.uploadProfilePhoto(student.id, uri);
        await refreshStudent();
        Alert.alert('Success', 'Profile photo updated');
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Failed to upload photo');
      } finally {
        setUploadingPhoto(false);
      }
    }
  };

  const handleUploadCV = async () => {
    if (!student?.id) return;

    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets[0]) {
      setUploadingCV(true);
      try {
        const uri = result.assets[0].uri;
        await studentsApi.uploadCV(student.id, uri);
        await refreshStudent();
        setCvUrl(student.cvUrl || '');
        Alert.alert('Success', 'CV uploaded successfully');
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Failed to upload CV');
      } finally {
        setUploadingCV(false);
      }
    }
  };

  return (
    <Screen scrollable={true} padding={true}>
      <Header title="Profile" showMenu />
      
      <Card style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Avatar
              uri={student?.profilePhotoUrl}
              name={student?.fullName}
              size={100}
            />
            <TouchableOpacity
              style={[styles.editPhotoButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleUploadPhoto}
              disabled={uploadingPhoto}
            >
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {isEditing ? (
            <View style={styles.editForm}>
              <Input
                label="Full Name *"
                placeholder="Enter your full name"
                value={fullName}
                onChangeText={setFullName}
                leftIcon="person"
              />

              <Input
                label="Major *"
                placeholder="e.g. Computer Science"
                value={major}
                onChangeText={setMajor}
                leftIcon="school"
              />

              <Input
                label="Address"
                placeholder="Enter your address"
                value={address}
                onChangeText={setAddress}
                leftIcon="location"
                multiline
              />

              <Input
                label="CV URL (Optional)"
                placeholder="https://example.com/cv.pdf"
                value={cvUrl}
                onChangeText={setCvUrl}
                leftIcon="link"
                keyboardType="url"
                autoCapitalize="none"
              />

              <View style={styles.buttonRow}>
                <Button
                  title="Cancel"
                  variant="outline"
                  onPress={handleCancel}
                  style={styles.halfButton}
                />
                <Button
                  title="Save"
                  onPress={handleSave}
                  loading={loading}
                  style={styles.halfButton}
                />
              </View>
            </View>
          ) : (
            <>
              <Text style={[styles.name, { color: theme.colors.text }]}>
                {student?.fullName}
              </Text>
              
              <Text style={[styles.email, { color: theme.colors.textSecondary }]}>
                {student?.email}
              </Text>

              <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                  <Ionicons name="school" size={20} color={theme.colors.textSecondary} />
                  <Text style={[styles.infoText, { color: theme.colors.text }]}>
                    {student?.major || 'No major specified'}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="location" size={20} color={theme.colors.textSecondary} />
                  <Text style={[styles.infoText, { color: theme.colors.text }]}>
                    {student?.address || 'No address specified'}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="document-text" size={20} color={theme.colors.textSecondary} />
                  <Text style={[styles.infoText, { color: theme.colors.text }]}>
                    {student?.cvUrl ? 'CV uploaded' : 'No CV uploaded'}
                  </Text>
                </View>
              </View>

              <Button
                title="Edit Profile"
                variant="outline"
                style={styles.editButton}
                onPress={handleEdit}
              />
            </>
          )}
        </Card>

        {!isEditing && (
          <>
            <Card style={styles.cvCard}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                CV / Resume
              </Text>
              <Text style={[styles.cardSubtitle, { color: theme.colors.textSecondary }]}>
                Upload your CV as a PDF file
              </Text>
              
              {student?.cvUrl && (
                <View style={[styles.cvInfo, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                  <Ionicons name="document" size={24} color={theme.colors.primary} />
                  <Text style={[styles.cvText, { color: theme.colors.text }]}>CV Uploaded</Text>
                </View>
              )}

              <View style={styles.buttonRow}>
                <Button
                  title={uploadingCV ? "Uploading..." : "Upload CV"}
                  variant="outline"
                  onPress={handleUploadCV}
                  loading={uploadingCV}
                  style={styles.halfButton}
                />
                {student?.cvUrl && (
                  <Button
                    title="View CV"
                    variant="outline"
                    onPress={handleViewCV}
                    style={styles.halfButton}
                  />
                )}
              </View>
            </Card>

            <Card style={styles.cvCard}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                Gemini AI API Key
              </Text>
              <Text style={[styles.cardSubtitle, { color: theme.colors.textSecondary }]}>
                Configure your Gemini API key for AI assistance
              </Text>
              
              <Input
                label="API Key"
                placeholder="Enter your Gemini API key"
                value={geminiApiKey}
                onChangeText={setGeminiApiKey}
                leftIcon="key"
                secureTextEntry
              />

              <View style={styles.buttonRow}>
                <Button
                  title="Test"
                  variant="outline"
                  onPress={handleTestGemini}
                  loading={testingGemini}
                  style={styles.halfButton}
                />
                <Button
                  title="Save"
                  onPress={handleSaveGemini}
                  loading={savingGemini}
                  style={styles.halfButton}
                />
              </View>
            </Card>
          </>
        )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    marginBottom: 16,
  },
  infoSection: {
    width: '100%',
    marginBottom: 24,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
  },
  editButton: {
    minWidth: 150,
  },
  editForm: {
    width: '100%',
    gap: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  halfButton: {
    flex: 1,
  },
  cvCard: {
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  cvInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  cvText: {
    fontSize: 14,
    fontWeight: '500',
  },
  uploadButton: {
    marginTop: 8,
  },
});
