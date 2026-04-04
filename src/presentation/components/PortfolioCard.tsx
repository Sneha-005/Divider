import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { colors } from '../../shared/theme/colors';

interface PortfolioCardProps {
  totalAmount: number;
  profitLoss: number;
  profitLossPercent: number;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({
  totalAmount,
  profitLoss,
  profitLossPercent,
}) => {
  const isPositive = profitLoss >= 0;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Total Portfolio Value</Text>
        <Text style={styles.amount}>₹{totalAmount.toLocaleString('en-IN')}</Text>

        <View style={styles.divider} />

        <View style={styles.profitContainer}>
          <View>
            <Text style={styles.profitLabel}>Profit/Loss</Text>
            <Text style={[styles.profitAmount, { color: isPositive ? colors.success : colors.error }]}>
              ₹{Math.abs(profitLoss).toLocaleString('en-IN')}
            </Text>
          </View>
          <View style={styles.percentageBox}>
            <Text style={[styles.percentageText, { color: isPositive ? colors.success : colors.error }]}>
              {isPositive ? '+' : '-'}{Math.abs(profitLossPercent).toFixed(2)}%
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  amount: {
    color: colors.textDark,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginBottom: 16,
  },
  profitContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profitLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  profitAmount: {
    fontSize: 18,
    fontWeight: '600',
  },
  percentageBox: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: colors.screenBackground,
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
