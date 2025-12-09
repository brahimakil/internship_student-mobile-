import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header } from '@/components/layout';
import { Card, Badge, Chip } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { internshipsApi, companiesApi } from '@/services/api';
import { Internship } from '@/types';
import type { Company } from '@/services/api/companies';

const locationTypes = ['All', 'On-site', 'Remote', 'Hybrid'];
const durations = ['All', '1-3 months', '3-6 months', '6+ months'];

export default function BrowseScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [allInternships, setAllInternships] = useState<Internship[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [industries, setIndustries] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedLocationType, setSelectedLocationType] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterInternships();
  }, [selectedIndustry, selectedLocationType, selectedDuration, allInternships, companies]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [internshipsData, companiesData, industriesData] = await Promise.all([
        internshipsApi.getAll(),
        companiesApi.getAll(),
        companiesApi.getUniqueIndustries(),
      ]);
      
      setAllInternships(internshipsData);
      setCompanies(companiesData);
      setIndustries(['All', ...industriesData]);
      setInternships(internshipsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterInternships = () => {
    let filtered = allInternships;

    // Filter by industry
    if (selectedIndustry !== 'All') {
      const companyIds = new Set(
        companies
          .filter(company => company.industry === selectedIndustry)
          .map(company => company.id)
      );
      filtered = filtered.filter(internship => companyIds.has(internship.companyId));
    }

    // Filter by location type
    if (selectedLocationType !== 'All') {
      filtered = filtered.filter(internship => internship.locationType === selectedLocationType);
    }

    // Filter by duration
    if (selectedDuration !== 'All') {
      filtered = filtered.filter(internship => {
        const months = Number.parseInt(internship.duration, 10);
        if (selectedDuration === '1-3 months') return months >= 1 && months <= 3;
        if (selectedDuration === '3-6 months') return months > 3 && months <= 6;
        if (selectedDuration === '6+ months') return months > 6;
        return true;
      });
    }

    setInternships(filtered);
  };

  const getCompanyName = (companyId: string): string => {
    const company = companies.find(c => c.id === companyId);
    return company?.name || companyId;
  };

  const renderInternship = ({ item }: { item: Internship }) => (
    <TouchableOpacity
      onPress={() => router.push(`/(app)/internship/${item.id}` as any)}
    >
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {item.title}
          </Text>
          <Badge
            text={item.status}
            variant={item.status === 'open' ? 'success' : 'default'}
          />
        </View>

        <Text style={[styles.company, { color: theme.colors.textSecondary }]}>
          {getCompanyName(item.companyId)}
        </Text>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Ionicons name="location" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
              {item.location}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="briefcase" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
              {item.locationType}
            </Text>
          </View>
        </View>

        <View style={styles.tags}>
          <Chip label={`${item.duration} months`} style={styles.tag} />
          {item.requiredSkills.slice(0, 2).map((skill) => (
            <Chip key={skill} label={skill} style={styles.tag} />
          ))}
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <Screen scrollable={false} padding={false}>
      <Header title="Browse Internships" showMenu />
      
      <View style={styles.filterToggleContainer}>
        <TouchableOpacity
          style={[styles.filterToggle, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons 
            name="filter" 
            size={20} 
            color={theme.colors.primary} 
          />
          <Text style={[styles.filterToggleText, { color: theme.colors.text }]}>
            Filters
          </Text>
          <Ionicons 
            name={showFilters ? "chevron-up" : "chevron-down"} 
            size={20} 
            color={theme.colors.textSecondary} 
          />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={[styles.filtersSection, { borderBottomColor: theme.colors.border }]}>
          <View style={styles.filterRow}>
            <Text style={[styles.filterLabel, { color: theme.colors.text }]}>Industry</Text>
            <FlatList
              horizontal
              data={industries}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Chip
                  label={item}
                  selected={selectedIndustry === item}
                  onPress={() => setSelectedIndustry(item)}
                  style={styles.filterChip}
                />
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterList}
            />
          </View>

          <View style={styles.filterRow}>
            <Text style={[styles.filterLabel, { color: theme.colors.text }]}>Type</Text>
            <FlatList
              horizontal
              data={locationTypes}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Chip
                  label={item}
                  selected={selectedLocationType === item}
                  onPress={() => setSelectedLocationType(item)}
                  style={styles.filterChip}
                />
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterList}
            />
          </View>

          <View style={styles.filterRow}>
            <Text style={[styles.filterLabel, { color: theme.colors.text }]}>Duration</Text>
            <FlatList
              horizontal
              data={durations}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Chip
                  label={item}
                  selected={selectedDuration === item}
                  onPress={() => setSelectedDuration(item)}
                  style={styles.filterChip}
                />
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterList}
            />
          </View>
        </View>
      )}

      <FlatList
        data={internships}
        renderItem={renderInternship}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={loadData}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  filterToggleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  filterToggleText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  filtersSection: {
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  filterRow: {
    paddingVertical: 8,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  filterList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
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
  tags: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  tag: {
    marginBottom: 4,
  },
});
