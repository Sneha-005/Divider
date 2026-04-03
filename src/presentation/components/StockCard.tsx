import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../shared/theme/colors';
import { Stock } from '../../domain/entities/Stock';
import { formatCurrency, formatPercent } from '../../utils/formatters';

interface StockCardProps {
  stock: Stock;
}

export const StockCard: React.FC<StockCardProps> = ({ stock }) => {
  return (
    <View style={styles.card}>
      <View
        style={[
          styles.accentBar,
          { backgroundColor: stock.isPositive ? colors.success : colors.error },
        ]}
      />
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <Text style={styles.stockName}>{stock.name}</Text>
          <Text style={styles.price}>{formatCurrency(stock.price)}</Text>
        </View>
        <View style={styles.rightSection}>
          <View
            style={[
              styles.changeBadge,
              {
                backgroundColor: stock.isPositive
                  ? colors.successLight
                  : colors.errorLight,
              },
            ]}
          >
            <Text style={styles.changeIcon}>
              {stock.isPositive ? '📈' : '📉'}
            </Text>
            <Text
              style={[
                styles.changeText,
                { color: stock.isPositive ? colors.success : colors.error },
              ]}
            >
              {formatPercent(stock.changePercent)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  accentBar: {
    width: 4,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  leftSection: {
    flex: 1,
  },
  stockName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textDark,
    marginBottom: 4,
  },
  price: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textDark,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  changeIcon: {
    fontSize: 14,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
