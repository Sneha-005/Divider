import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../shared/theme/colors';

interface StockListItemProps {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  change: number;
  availableQuantity?: number;
  onPress?: () => void;
}

export const StockListItem: React.FC<StockListItemProps> = ({
  symbol,
  name,
  price,
  changePercent,
  change,
  availableQuantity,
  onPress,
}) => {
  const isPositive = changePercent >= 0;
  const changeColor = isPositive ? colors.success : colors.error;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.leftSection}>
        <View>
          <Text style={styles.symbol}>{symbol}</Text>
          <Text style={styles.name}>{name}</Text>
          {availableQuantity !== undefined && (
            <View style={styles.qtyBadge}>
              <MaterialCommunityIcons
                name="package-multiple"
                size={14}
                color="#34D399"
                style={styles.qtyIcon}
              />
              <Text style={styles.qtyText}>{availableQuantity.toLocaleString('en-IN')} avail.</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text style={styles.price}>₹{price.toFixed(2)}</Text>
        <View style={[styles.changeBox, { backgroundColor: isPositive ? colors.successLight : colors.errorLight }]}>
          <Text style={[styles.changeText, { color: changeColor }]}>
            {isPositive ? '↗' : '↘'} {Math.abs(changePercent).toFixed(2)}%
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  symbol: {
    color: colors.textDark,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  name: {
    color: colors.textMuted,
    fontSize: 12,
  },
  qtyBadge: {
    marginTop: 6,
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  qtyIcon: {
    marginRight: 2,
  },
  qtyText: {
    fontSize: 10,
    color: '#34D399',
    fontWeight: '600',
  },
  price: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  changeBox: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
