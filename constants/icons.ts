// Icon mappings using Ionicons
export const Icons = {
  // Navigation
  home: 'home-outline',
  homeActive: 'home',
  internships: 'briefcase-outline',
  internshipsActive: 'briefcase',
  applications: 'document-text-outline',
  applicationsActive: 'document-text',
  myInternships: 'business-outline',
  myInternshipsActive: 'business',
  assignments: 'clipboard-outline',
  assignmentsActive: 'clipboard',
  profile: 'person-outline',
  profileActive: 'person',
  aiChat: 'sparkles-outline',
  aiChatActive: 'sparkles',
  settings: 'settings-outline',
  settingsActive: 'settings',
  
  // Actions
  add: 'add-circle-outline',
  edit: 'create-outline',
  delete: 'trash-outline',
  save: 'checkmark-circle-outline',
  cancel: 'close-circle-outline',
  search: 'search-outline',
  filter: 'filter-outline',
  refresh: 'refresh-outline',
  share: 'share-social-outline',
  download: 'download-outline',
  upload: 'cloud-upload-outline',
  
  // Status
  pending: 'time-outline',
  accepted: 'checkmark-circle',
  rejected: 'close-circle',
  success: 'checkmark-done-circle',
  error: 'alert-circle',
  warning: 'warning',
  info: 'information-circle',
  
  // UI
  menu: 'menu-outline',
  close: 'close',
  back: 'arrow-back',
  forward: 'arrow-forward',
  chevronLeft: 'chevron-back',
  chevronRight: 'chevron-forward',
  chevronDown: 'chevron-down',
  chevronUp: 'chevron-up',
  eye: 'eye-outline',
  eyeOff: 'eye-off-outline',
  
  // Features
  location: 'location-outline',
  calendar: 'calendar-outline',
  time: 'time-outline',
  link: 'link-outline',
  mail: 'mail-outline',
  call: 'call-outline',
  send: 'send-outline',
  attach: 'attach-outline',
  
  // Theme
  sun: 'sunny-outline',
  moon: 'moon-outline',
  
  // Auth
  login: 'log-in-outline',
  logout: 'log-out-outline',
  lock: 'lock-closed-outline',
  
  // Misc
  star: 'star-outline',
  starFilled: 'star',
  heart: 'heart-outline',
  heartFilled: 'heart',
  bookmark: 'bookmark-outline',
  bookmarkFilled: 'bookmark',
} as const;

export type IconName = keyof typeof Icons;
