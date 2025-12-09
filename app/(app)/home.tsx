import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';

const { width } = Dimensions.get('window');

export default function HomePage() {
  const { theme } = useTheme();
  const { student } = useAuth();
  const router = useRouter();

  const features = [
    {
      icon: 'briefcase',
      title: 'Tailored Internships',
      description: 'Find opportunities that match your major and skills',
      gradient: ['#667eea', '#764ba2'],
    },
    {
      icon: 'bulb',
      title: 'AI-Powered Matching',
      description: 'Smart recommendations based on your profile',
      gradient: ['#f093fb', '#f5576c'],
    },
    {
      icon: 'rocket',
      title: 'Career Growth',
      description: 'Build experience with top companies',
      gradient: ['#4facfe', '#00f2fe'],
    },
    {
      icon: 'analytics',
      title: 'Track Progress',
      description: 'Monitor applications and internship journey',
      gradient: ['#43e97b', '#38f9d7'],
    },
  ];

  return (
    <Screen scrollable={true} padding={true}>
      <Header title="Home" showMenu />

      {/* Welcome Section */}
      <Card style={styles.welcomeCard}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.welcomeContent}>
            <Ionicons name="sparkles" size={48} color="#fff" />
            <Text style={styles.welcomeTitle}>
              Welcome{student?.fullName ? `, ${student.fullName.split(' ')[0]}` : ''}!
            </Text>
            <Text style={styles.welcomeSubtitle}>
              Your journey to the perfect internship starts here
            </Text>
          </View>
        </LinearGradient>
      </Card>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={[styles.heroTitle, { color: theme.colors.text }]}>
          Discover Your Dream Internship
        </Text>
        <Text style={[styles.heroDescription, { color: theme.colors.textSecondary }]}>
          We connect ambitious students with leading companies, offering internships
          perfectly aligned with your academic background and career goals.
        </Text>
      </View>

      {/* Features Grid - Windows Style Tiles */}
      <View style={styles.featuresGrid}>
        {features.map((feature, index) => (
          <Card key={index} style={styles.featureCard}>
            <LinearGradient
              colors={feature.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featureGradient}
            >
              <View style={styles.featureContent}>
                <View style={styles.iconContainer}>
                  <Ionicons name={feature.icon as any} size={32} color="#fff" />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </LinearGradient>
          </Card>
        ))}
      </View>

      {/* Stats Section */}
      <Card style={styles.statsCard}>
        <Text style={[styles.statsTitle, { color: theme.colors.text }]}>
          Platform Highlights
        </Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.statCircle}
            >
              <Ionicons name="business" size={24} color="#fff" />
            </LinearGradient>
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>100+</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Companies
            </Text>
          </View>

          <View style={styles.statItem}>
            <LinearGradient
              colors={['#f093fb', '#f5576c']}
              style={styles.statCircle}
            >
              <Ionicons name="briefcase" size={24} color="#fff" />
            </LinearGradient>
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>500+</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Internships
            </Text>
          </View>

          <View style={styles.statItem}>
            <LinearGradient
              colors={['#4facfe', '#00f2fe']}
              style={styles.statCircle}
            >
              <Ionicons name="people" size={24} color="#fff" />
            </LinearGradient>
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>1000+</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Students
            </Text>
          </View>
        </View>
      </Card>

      {/* How It Works Section */}
      <View style={styles.howItWorksSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          How It Works
        </Text>
        
        <View style={styles.stepsContainer}>
          {[
            { icon: 'person-add', title: 'Create Profile', desc: 'Set up your profile with your major and skills' },
            { icon: 'search', title: 'Browse & Filter', desc: 'Explore internships tailored to your field' },
            { icon: 'send', title: 'Apply Easily', desc: 'Submit applications with one click' },
            { icon: 'checkmark-circle', title: 'Get Hired', desc: 'Start your career journey' },
          ].map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.stepContent}>
                <View style={styles.stepHeader}>
                  <Ionicons name={step.icon as any} size={24} color={theme.colors.primary} />
                  <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
                    {step.title}
                  </Text>
                </View>
                <Text style={[styles.stepDescription, { color: theme.colors.textSecondary }]}>
                  {step.desc}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Call to Action */}
      <Card style={styles.ctaCard}>
        <LinearGradient
          colors={['#43e97b', '#38f9d7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ctaGradient}
        >
          <Ionicons name="rocket" size={40} color="#fff" />
          <Text style={styles.ctaTitle}>Ready to Get Started?</Text>
          <Text style={styles.ctaDescription}>
            Browse thousands of internship opportunities and find the perfect match for your career goals.
          </Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => router.push('/(app)/browse')}
          >
            <Text style={styles.ctaButtonText}>Discover Internships</Text>
            <Ionicons name="arrow-forward" size={20} color="#43e97b" />
          </TouchableOpacity>
        </LinearGradient>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  welcomeCard: {
    marginBottom: 24,
    padding: 0,
    overflow: 'hidden',
  },
  gradient: {
    borderRadius: 12,
  },
  welcomeContent: {
    padding: 32,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
    textAlign: 'center',
  },
  heroSection: {
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  heroDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 24,
  },
  featureCard: {
    width: (width - 32 - 12) / 2,
    margin: 6,
    padding: 0,
    overflow: 'hidden',
    height: 200,
  },
  featureGradient: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  featureContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 18,
  },
  statsCard: {
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  howItWorksSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  stepsContainer: {
    gap: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  stepDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 32,
  },
  ctaCard: {
    marginBottom: 24,
    padding: 0,
    overflow: 'hidden',
  },
  ctaGradient: {
    padding: 32,
    alignItems: 'center',
    borderRadius: 12,
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaDescription: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#43e97b',
  },
});
