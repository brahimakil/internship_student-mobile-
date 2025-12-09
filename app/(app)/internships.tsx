import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header } from '@/components/layout';
import { Card, Badge } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { enrollmentsApi } from '@/services/api';
import { Enrollment } from '@/types';
import { format } from 'date-fns';

export default function InternshipsScreen() {
  const { theme } = useTheme();
  const { student } = useAuth();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (student) {
        loadEnrollments();
      }
    }, [student])
  );

  const loadEnrollments = async () => {
    if (!student) return;
    
    try {
      setLoading(true);
      const data = await enrollmentsApi.getByStudent(student.id);
      setEnrollments(data);
    } catch (error) {
      console.error('Error loading enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'info';
      case 'terminated':
        return 'error';
      default:
        return 'default';
    }
  };

  const renderEnrollment = ({ item }: { item: Enrollment }) => (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {item.internshipTitle || 'Internship'}
          </Text>
          <Badge text={item.status} variant={getStatusVariant(item.status)} />
        </View>

        {item.companyName ? (
          <Text style={[styles.company, { color: theme.colors.textSecondary }]}>
            {item.companyName}
          </Text>
        ) : null}
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
            Enrolled: {item.enrolledDate ? format(new Date(item.enrolledDate), 'MMM dd, yyyy') : format(new Date(item.createdAt), 'MMM dd, yyyy')}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="information-circle" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
            Status: {item.status === 'pending' ? 'Awaiting review' : item.status === 'accepted' ? 'Active internship' : 'Application rejected'}
          </Text>
        </View>
      </View>

      {item.status === 'active' && (
        <TouchableOpacity
          style={[styles.assignmentsButton, { backgroundColor: theme.colors.primary + '10' }]}
          onPress={() => router.push('/(app)/assignments' as any)}
        >
          <Ionicons name="clipboard" size={20} color={theme.colors.primary} />
          <Text style={[styles.assignmentsText, { color: theme.colors.primary }]}>
            View Assignments
          </Text>
        </TouchableOpacity>
      )}

      {item.feedback ? (
        <View style={[styles.feedback, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.feedbackLabel, { color: theme.colors.text }]}>
            Feedback:
          </Text>
          <Text style={[styles.feedbackText, { color: theme.colors.textSecondary }]}>
            {item.feedback}
          </Text>
        </View>
      ) : null}
    </Card>
  );

  if (!student) {
    return (
      <Screen>
        <Header title="My Internships" />
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            Please log in to view internships
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scrollable={false} padding={false}>
      <Header title="My Internships" showMenu />
      
      {enrollments.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="briefcase-outline" size={64} color={theme.colors.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            No active internships
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
            Apply to internships to get started
          </Text>
        </View>
      ) : (
        <FlatList
          data={enrollments}
          renderItem={renderEnrollment}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={loadEnrollments}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  header: {
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  company: {
    fontSize: 14,
    marginBottom: 8,
  },
  details: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
  },
  assignmentsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  assignmentsText: {
    fontSize: 16,
    fontWeight: '600',
  },
  feedback: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
  },
  feedbackLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  feedbackText: {
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
