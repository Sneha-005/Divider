import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
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
              <MaterialCommunityIcons name="layers-triple-outline" size={12} color="#34D399" style={styles.qtyIcon} />
              <Text style={styles.qtyText}>{availableQuantity.toLocaleString('en-IN')} avail.</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text style={styles.price}>₹{price.toFixed(2)}</Text>
        <View style={[styles.changeBox, { backgroundColor: isPositive ? 'rgba(0, 208, 132, 0.15)' : 'rgba(255, 107, 107, 0.15)' }]}> 
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
    borderBottomColor: colors.border,
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  symbol: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  name: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  qtyBadge: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.2)',
  },
  qtyIcon: {
    marginRight: 4,
  },
  qtyText: {
    fontSize: 10,
    color: '#34D399',
    fontWeight: '600',
  },
  price: {
    color: colors.text,
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
