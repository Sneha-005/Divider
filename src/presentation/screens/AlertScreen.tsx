import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { colors } from '../../shared/theme/colors';

export const AlertScreen: React.FC = () => {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>🔔 Alerts</Text>
        <Text style={styles.subtitle}>Alert UI Coming Soon</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E27',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#00D084',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#B0B8D4',
  },
});

export default AlertScreen;
