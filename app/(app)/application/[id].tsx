import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header } from '@/components/layout';
import { Card, Badge, Button } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { applicationsApi } from '@/services/api';
import { Application } from '@/types';
import { format } from 'date-fns';

export default function ApplicationDetailScreen() {
  const { theme } = useTheme();
  const { student } = useAuth();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form fields
  const [resumeUrl, setResumeUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  useEffect(() => {
    loadApplication();
  }, [id]);

  const loadApplication = async () => {
    try {
      setLoading(true);
      const data = await applicationsApi.getById(id);
      setApplication(data);
      
      // Pre-fill existing data
      setResumeUrl(data.resumeUrl || '');
      setGithubUrl(data.githubUrl || '');
      setPortfolioUrl(data.portfolioUrl || '');
    } catch (error) {
      console.error('Error loading application:', error);
      Alert.alert('Error', 'Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!resumeUrl && !githubUrl && !portfolioUrl) {
      Alert.alert('Error', 'Please provide at least one resource (Resume, GitHub, or Portfolio)');
      return;
    }

    Alert.alert(
      'Submit Application',
      'Are you sure you want to submit these resources? You can update them later if needed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: async () => {
            try {
              setSubmitting(true);
              
              await applicationsApi.update(id, {
                resumeUrl,
                githubUrl: githubUrl || undefined,
                portfolioUrl: portfolioUrl || undefined,
              });

              Alert.alert('Success', 'Resources submitted successfully!', [
                { text: 'OK', onPress: () => router.back() }
              ]);
            } catch (error) {
              console.error('Error submitting resources:', error);
              Alert.alert('Error', 'Failed to submit resources');
            } finally {
              setSubmitting(false);
            }
          }
        }
      ]
    );
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Screen>
        <Header title="Application Details" showBack onBack={() => router.push('/(app)/applications' as any)} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </Screen>
    );
  }

  if (!application) {
    return (
      <Screen>
        <Header title="Application Details" showBack onBack={() => router.push('/(app)/applications' as any)} />
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            Application not found
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scrollable padding>
      <Header title="Application Details" showBack onBack={() => router.push('/(app)/applications' as any)} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Application Info */}
        <Card style={styles.card}>
          <View style={styles.headerContainer}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              {application.internship?.title || 'Internship Application'}
            </Text>
            <Badge text={application.status} variant={getStatusVariant(application.status)} />
          </View>

          {application.company && (
            <Text style={[styles.company, { color: theme.colors.textSecondary }]}>
              {application.company.name}
            </Text>
          )}

          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
              Applied: {format(new Date(application.createdAt), 'MMM dd, yyyy')}
            </Text>
          </View>

          {application.updatedAt && application.status !== 'pending' && (
            <View style={styles.infoRow}>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                Reviewed: {format(new Date(application.updatedAt), 'MMM dd, yyyy')}
              </Text>
            </View>
          )}
        </Card>

        {/* Cover Letter & Project Description (if exists) */}
        {application.coverLetter && (
          <Card style={styles.card}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Cover Letter
            </Text>
            <Text style={[styles.textContent, { color: theme.colors.textSecondary }]}>
              {application.coverLetter}
            </Text>
          </Card>
        )}

        {application.projectDescription && (
          <Card style={styles.card}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Project Description
            </Text>
            <Text style={[styles.textContent, { color: theme.colors.textSecondary }]}>
              {application.projectDescription}
            </Text>
          </Card>
        )}

        {/* Resources Section */}
        <Card style={styles.card}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Links & Resources
          </Text>
          
          {/* Resume */}
          <View style={styles.resourceSection}>
            <View style={styles.resourceHeader}>
              <Ionicons name="document-text" size={20} color={theme.colors.primary} />
              <Text style={[styles.resourceLabel, { color: theme.colors.text }]}>
                Resume URL (Optional)
              </Text>
            </View>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                }
              ]}
              placeholder="https://yourresume.com/resume.pdf"
              placeholderTextColor={theme.colors.textSecondary}
              value={resumeUrl}
              onChangeText={setResumeUrl}
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>

          {/* GitHub */}
          <View style={styles.resourceSection}>
            <View style={styles.resourceHeader}>
              <Ionicons name="logo-github" size={20} color={theme.colors.primary} />
              <Text style={[styles.resourceLabel, { color: theme.colors.text }]}>
                GitHub Profile (Optional)
              </Text>
            </View>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                }
              ]}
              placeholder="https://github.com/username"
              placeholderTextColor={theme.colors.textSecondary}
              value={githubUrl}
              onChangeText={setGithubUrl}
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>

          {/* Portfolio */}
          <View style={styles.resourceSection}>
            <View style={styles.resourceHeader}>
              <Ionicons name="globe" size={20} color={theme.colors.primary} />
              <Text style={[styles.resourceLabel, { color: theme.colors.text }]}>
                Portfolio Website (Optional)
              </Text>
            </View>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                }
              ]}
              placeholder="https://yourportfolio.com"
              placeholderTextColor={theme.colors.textSecondary}
              value={portfolioUrl}
              onChangeText={setPortfolioUrl}
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>
        </Card>

        {/* Review Notes (if exists) */}
        {application.notes && (
          <Card style={[styles.card, { backgroundColor: theme.colors.background, opacity: 0.9 }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Company Notes
            </Text>
            <Text style={[styles.textContent, { color: theme.colors.textSecondary }]}>
              {application.notes}
            </Text>
          </Card>
        )}

        {/* Submit Button */}
        <Button
          title={submitting ? 'Submitting...' : 'Submit Resources'}
          onPress={handleSubmit}
          disabled={submitting}
          style={styles.submitButton}
        />

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  company: {
    fontSize: 16,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  textContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  resourceSection: {
    marginBottom: 20,
  },
  resourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  resourceLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  resourceValue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resourceText: {
    fontSize: 14,
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
  },
  submitButton: {
    marginTop: 8,
  },
  bottomSpacing: {
    height: 24,
  },
});
