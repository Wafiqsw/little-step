import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { Logo } from './Logo';
import { Colors, Typography, Spacing } from '../constants';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Logo width={120} height={100} />
        </View>

        {/* App Name */}
        <Text style={styles.appName}>LittleStep</Text>
        <Text style={styles.tagline}>Nurturing Growth, One Step at a Time</Text>

        {/* Loading Indicator */}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary[500]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  logoContainer: {
    marginBottom: Spacing.xl,
  },
  appName: {
    fontSize: Typography.heading.h1.fontSize as number,
    fontWeight: Typography.heading.h1.fontWeight as any,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  tagline: {
    fontSize: Typography.body.medium.fontSize as number,
    color: Colors.text.secondary,
    marginBottom: Spacing['2xl'],
    textAlign: 'center',
  },
  loadingContainer: {
    marginTop: Spacing.lg,
  },
});

export { SplashScreen };
