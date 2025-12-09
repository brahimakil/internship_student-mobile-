import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header } from '@/components/layout';
import { Card, Badge } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { applicationsApi } from '@/services/api';
import { Application } from '@/types';
import { format } from 'date-fns';

export default function ApplicationsScreen() {
  const { theme } = useTheme();
  const { student } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (student) {
      loadApplications();
    }
  }, [student]);

  useFocusEffect(
    React.useCallback(() => {
      if (student) {
        loadApplications();
      }
    }, [student])
  );

  const loadApplications = async () => {
    if (!student) return;
    
    try {
      setLoading(true);
      const data = await applicationsApi.getByStudent(student.id);
      setApplications(data);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
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

  const renderApplication = ({ item }: { item: Application }) => (
    <TouchableOpacity
      onPress={() => router.push(`/(app)/application/${item.id}` as any)}
    >
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              {item.internship?.title || item.internshipTitle || 'Internship Application'}
            </Text>
            <Badge text={item.status} variant={getStatusVariant(item.status)} />
          </View>

          {(item.company?.name || item.companyName) && (
            <Text style={[styles.company, { color: theme.colors.textSecondary }]}>
              {item.company?.name || item.companyName}
            </Text>
          )}
        </View>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
              Applied: {item.createdAt ? format(new Date(item.createdAt), 'MMM dd, yyyy') : 'N/A'}
            </Text>
          </View>

          {item.updatedAt && item.status !== 'pending' && (
            <View style={styles.detailRow}>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
                Reviewed: {format(new Date(item.updatedAt), 'MMM dd, yyyy')}
              </Text>
            </View>
          )}
        </View>

        {/* Show submission status */}
        <View style={styles.submissionStatus}>
          {item.resumeUrl && (
            <View style={styles.resourceIndicator}>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
              <Text style={[styles.resourceText, { color: theme.colors.success }]}>Resume</Text>
            </View>
          )}
          {item.githubUrl && (
            <View style={styles.resourceIndicator}>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
              <Text style={[styles.resourceText, { color: theme.colors.success }]}>GitHub</Text>
            </View>
          )}
          {item.portfolioUrl && (
            <View style={styles.resourceIndicator}>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
              <Text style={[styles.resourceText, { color: theme.colors.success }]}>Portfolio</Text>
            </View>
          )}
          {!item.resumeUrl && !item.githubUrl && !item.portfolioUrl && (
            <View style={styles.resourceIndicator}>
              <Ionicons name="alert-circle" size={16} color={theme.colors.warning} />
              <Text style={[styles.resourceText, { color: theme.colors.warning }]}>
                Resources pending
              </Text>
            </View>
          )}
        </View>

        {item.coverLetter ? (
          <Text
            style={[styles.coverLetter, { color: theme.colors.textSecondary }]}
            numberOfLines={2}
          >
            {item.coverLetter}
          </Text>
        ) : null}

        {item.reviewNotes ? (
          <View style={[styles.reviewNotes, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.reviewNotesLabel, { color: theme.colors.text }]}>
              Review Notes:
            </Text>
            <Text style={[styles.reviewNotesText, { color: theme.colors.textSecondary }]}>
              {item.reviewNotes}
            </Text>
          </View>
        ) : null}
      </Card>
    </TouchableOpacity>
  );

  if (!student) {
    return (
      <Screen>
        <Header title="My Applications" />
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            Please log in to view applications
          </Text>
        </View>
      </Screen>
    );
  }

  if (loading && applications.length === 0) {
    return (
      <Screen>
        <Header title="My Applications" showMenu />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Loading applications...
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scrollable={false} padding={false}>
      <Header title="My Applications" showMenu />
      
      {applications.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={64} color={theme.colors.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            No applications yet
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
            Browse internships and apply to get started
          </Text>
        </View>
      ) : (
        <FlatList
          data={applications}
          renderItem={renderApplication}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={loadApplications}
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
  submissionStatus: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  resourceIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resourceText: {
    fontSize: 13,
    fontWeight: '500',
  },
  coverLetter: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 8,
  },
  reviewNotes: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
  },
  reviewNotesLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  reviewNotesText: {
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
});
