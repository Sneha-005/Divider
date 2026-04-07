import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../shared/theme/colors';
import { formatCurrency } from '../../utils/formatters';

interface PortfolioHeaderProps {
  totalAmount: number;
}

export const PortfolioHeader: React.FC<PortfolioHeaderProps> = ({
  totalAmount,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Total Portfolio Value</Text>
      <Text style={styles.amount}>{formatCurrency(totalAmount)}</Text>
      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.background,
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  amount: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.background,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginTop: 16,
  },
});
