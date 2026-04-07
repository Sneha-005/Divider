import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import ProfileScreen from '../src/presentation/screens/ProfileScreen';
import { colors } from '../src/shared/theme/colors';

export default function ProfileRoute() {
  return (
    <SafeAreaView style={styles.container}>
      <ProfileScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
