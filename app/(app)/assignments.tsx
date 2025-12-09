import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { Screen, Header } from '@/components/layout';
import { Card, Badge, Button } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { assignmentsApi } from '@/services/api';
import { Assignment } from '@/types';
import { format } from 'date-fns';

export default function AssignmentsScreen() {
  const { theme } = useTheme();
  const { student } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);

  useEffect(() => {
    if (student) {
      loadAssignments();
    }
  }, [student]);

  const loadAssignments = async () => {
    if (!student) return;
    
    try {
      setLoading(true);
      const data = await assignmentsApi.getByStudent(student.id);
      setAssignments(data);
    } catch (error) {
      console.error('Error loading assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (assignmentId: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];

      Alert.alert(
        'Submit Assignment',
        `Submit "${file.name}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Submit',
            onPress: () => {
              void (async () => {
                setSubmitting(assignmentId);
                try {
                  await assignmentsApi.submit(assignmentId, {
                    submissionUrl: file.uri,
                    submittedAt: new Date().toISOString(),
                  });
                  Alert.alert('Success', 'Assignment submitted successfully!');
                  loadAssignments();
                } catch (error: any) {
                  Alert.alert('Error', error.message || 'Failed to submit assignment');
                } finally {
                  setSubmitting(null);
                }
              })();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'graded':
        return 'success';
      case 'submitted':
        return 'info';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const renderAssignment = ({ item }: { item: Assignment }) => (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {item.title}
        </Text>
        <Badge text={item.status} variant={getStatusVariant(item.status)} />
      </View>

      <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
        {item.description}
      </Text>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
            Due: {format(new Date(item.dueDate), 'MMM dd, yyyy')}
          </Text>
        </View>

        {item.submittedAt ? (
          <View style={styles.detailRow}>
            <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
            <Text style={[styles.detailText, { color: theme.colors.success }]}>
              Submitted: {format(new Date(item.submittedAt), 'MMM dd, yyyy')}
            </Text>
          </View>
        ) : null}

        {item.grade !== undefined && (
          <View style={styles.detailRow}>
            <Ionicons name="star" size={16} color={theme.colors.primary} />
            <Text style={[styles.detailText, { color: theme.colors.primary, fontWeight: '600' }]}>
              Grade: {item.grade}
            </Text>
          </View>
        )}
      </View>

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

      {item.status === 'pending' && (
        <Button
          title="Submit Assignment"
          onPress={() => handleSubmit(item.id)}
          loading={submitting === item.id}
          style={styles.submitButton}
          leftIcon="cloud-upload"
        />
      )}

      {item.submissionUrl && (
        <View style={styles.detailRow}>
          <Ionicons name="document" size={16} color={theme.colors.primary} />
          <Text style={[styles.detailText, { color: theme.colors.primary }]}>
            Submission file attached
          </Text>
        </View>
      )}
    </Card>
  );

  if (!student) {
    return (
      <Screen>
        <Header title="Assignments" />
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            Please log in to view assignments
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scrollable={false} padding={false}>
      <Header title="My Assignments" showMenu />
      
      {assignments.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="clipboard-outline" size={64} color={theme.colors.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            No assignments yet
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
            Assignments will appear here when assigned
          </Text>
        </View>
      ) : (
        <FlatList
          data={assignments}
          renderItem={renderAssignment}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={loadAssignments}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
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
  feedback: {
    marginTop: 8,
    marginBottom: 12,
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
  submitButton: {
    marginTop: 8,
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
