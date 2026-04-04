import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

interface StatisticsBoxProps {
  label: string;
  value: string;
  color?: string;
}

export const StatisticsBox: React.FC<StatisticsBoxProps> = ({
  label,
  value,
  color = '#FFFFFF',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 8,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
  },
});
