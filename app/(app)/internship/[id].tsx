import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header } from '@/components/layout';
import { Card, Badge, Button, Chip } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { internshipsApi, enrollmentsApi } from '@/services/api';
import { Internship } from '@/types';

export default function InternshipDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const { student } = useAuth();
  const router = useRouter();
  const [internship, setInternship] = useState<Internship | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasEnrolled, setHasEnrolled] = useState(false);

  useEffect(() => {
    setInternship(null);
    setLoading(true);
    setHasEnrolled(false);
    loadInternship();
    checkEnrollment();
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      checkEnrollment();
    }, [student, id])
  );

  const loadInternship = async () => {
    try {
      const data = await internshipsApi.getById(id);
      setInternship(data);
    } catch (error) {
      console.error('Error loading internship:', error);
      Alert.alert('Error', 'Failed to load internship details');
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    if (!student) return;
    
    try {
      const enrollments = await enrollmentsApi.getByStudent(student.id);
      const existingEnrollment = enrollments.find(
        (enrollment) => enrollment.internshipId === id && 
        (enrollment.status === 'pending' || enrollment.status === 'accepted')
      );
      setHasEnrolled(!!existingEnrollment);
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const handleApply = async () => {
    if (!student || !internship) return;

    Alert.alert(
      'Apply for Internship',
      `Do you want to apply for ${internship.title}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Apply',
          onPress: () => {
            void (async () => {
              setApplying(true);
              try {
                await enrollmentsApi.create({
                  studentId: student.id,
                  internshipId: internship.id,
                  companyId: internship.companyId,
                  status: 'pending',
                });
                setHasEnrolled(true);
                Alert.alert('Success', 'Application submitted successfully!', [
                  { text: 'OK', onPress: () => router.push('/(app)/internships') }
                ]);
              } catch (error: any) {
                Alert.alert('Error', error.message || 'Failed to submit application');
              } finally {
                setApplying(false);
              }
            })();
          }
        }
      ]
    );
  };

  if (loading || !internship) {
    return (
      <Screen>
        <Header title="Internship Details" showBack onBack={() => router.push('/(app)/browse')} />
        <View style={styles.centerContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Loading...
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen padding={false}>
      <Header title="Internship Details" showBack onBack={() => router.push('/(app)/browse')} />
      
      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={[styles.title, { color: theme.colors.text }]}>
                {internship.title}
              </Text>
              <Badge
                text={internship.status}
                variant={internship.status === 'open' ? 'success' : 'default'}
              />
            </View>

            <Text style={[styles.company, { color: theme.colors.textSecondary }]}>
              {internship.companyName || internship.companyId}
            </Text>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <Ionicons name="location" size={20} color={theme.colors.primary} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                  Location
                </Text>
                <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                  {internship.location}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="briefcase" size={20} color={theme.colors.primary} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                  Type
                </Text>
                <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                  {internship.locationType}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="time" size={20} color={theme.colors.primary} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                  Duration
                </Text>
                <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                  {internship.duration}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Description
          </Text>
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
            {internship.description}
          </Text>
        </Card>

        <Card style={styles.card}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Required Skills
          </Text>
          <View style={styles.skillsContainer}>
            {internship.requiredSkills.map((skill) => (
              <Chip key={skill} label={skill} style={styles.skillChip} />
            ))}
          </View>
        </Card>

        {internship.applicationsCount !== undefined && (
          <Card style={styles.card}>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                  {internship.applicationsCount}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Applications
                </Text>
              </View>
              {internship.currentStudentsCount !== undefined && (
                <View style={styles.stat}>
                  <Text style={[styles.statValue, { color: theme.colors.success }]}>
                    {internship.currentStudentsCount}
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                    Current Students
                  </Text>
                </View>
              )}
            </View>
          </Card>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {internship.status === 'open' && (
        <View style={[styles.footer, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
          <Button
            title={hasEnrolled ? "Already Applied" : "Apply Now"}
            onPress={hasEnrolled ? undefined : handleApply}
            loading={applying}
            disabled={hasEnrolled}
            fullWidth
          />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  card: {
    margin: 16,
    marginBottom: 0,
  },
  header: {
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 12,
  },
  company: {
    fontSize: 16,
  },
  infoGrid: {
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  bottomPadding: {
    height: 100,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
});
