import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { colors } from '../../shared/theme/colors';
import { useCandles } from '../hooks/useCandles';
import { Candle } from '../../domain/entities/candle.entity';

const screenWidth = Dimensions.get('window').width;

const timeframes = ['1 Min', '5 Min', '15 Min', '1 Hour'];
const DEFAULT_SYMBOL = 'RELIANCE-CE-2900';

// OHLC Candlestick Component
type CandlestickProps = {
  candle: Candle;
  minPrice: number;
  maxPrice: number;
  width: number;
  height: number;
};

function CandlestickBar({ candle, minPrice, maxPrice, width, height }: CandlestickProps) {
  const range = maxPrice - minPrice;
  const bodyWidth = width * 0.6;

  // Calculate normalized positions (0 = minPrice, 1 = maxPrice)
  const openPos = (candle.open - minPrice) / range;
  const closePos = (candle.close - minPrice) / range;
  const highPos = (candle.high - minPrice) / range;
  const lowPos = (candle.low - minPrice) / range;

  // Convert to pixel coordinates (inverted because Y increases downward)
  const openY = height - openPos * height;
  const closeY = height - closePos * height;
  const highY = height - highPos * height;
  const lowY = height - lowPos * height;

  const isGain = candle.close >= candle.open;
  const bodyTop = Math.min(openY, closeY);
  const bodyHeight = Math.abs(closeY - openY) || 2; // min 2px for visibility
  const wickColor = isGain ? colors.success : colors.error;
  const bodyColor = isGain ? colors.success : colors.error;

  return (
    <View style={[styles.candlestick, { width }]}>
      {/* Wick (high-low line) */}
      <View
        style={{
          position: 'absolute',
          width: 1,
          left: width / 2 - 0.5,
          top: lowY,
          height: highY - lowY || 1,
          backgroundColor: wickColor,
        }}
      />
      {/* Body (open-close) */}
      <View
        style={{
          position: 'absolute',
          width: bodyWidth,
          left: (width - bodyWidth) / 2,
          top: bodyTop,
          height: bodyHeight,
          backgroundColor: bodyColor,
          borderWidth: 1,
          borderColor: wickColor,
        }}
      />
    </View>
  );
}

export default function ChartScreen() {
  const [selectedTF, setSelectedTF] = useState('1 Min');
  const [symbol] = useState(DEFAULT_SYMBOL);
  const { candles, loading, error, fetchCandles } = useCandles();

  const mapTimeframeToAPI = (tf: string): string => {
    const map: Record<string, string> = {
      '1 Min': '1m',
      '5 Min': '5m',
      '15 Min': '15m',
      '1 Hour': '1h',
    };
    return map[tf] || '1m';
  };

  useEffect(() => {
    fetchCandles(symbol, 50, mapTimeframeToAPI(selectedTF));
  }, [symbol, selectedTF, fetchCandles]);

  // Calculate chart bounds
  const getChartBounds = () => {
    if (candles.length === 0) return { min: 0, max: 100 };
    const allPrices = candles.flatMap(c => [c.open, c.high, c.low, c.close]);
    const min = Math.min(...allPrices);
    const max = Math.max(...allPrices);
    const padding = (max - min) * 0.1;
    return { min: min - padding, max: max + padding };
  };

  const { min: minPrice, max: maxPrice } = getChartBounds();
  const candlesToShow = candles.slice(-20); // Show last 20 candles
  const chartWidth = Math.max(screenWidth - 32, candlesToShow.length * 35);

  return (
    <SafeAreaView style={styles.container}>

      {/* ERROR MESSAGE */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}

      {/* HEADER */}
      <Text style={styles.title}>{symbol.split('-')[0]}</Text>

      {/* TIMEFRAME */}
      <View style={styles.tfRow}>
        {timeframes.map(tf => (
          <TouchableOpacity
            key={tf}
            style={[
              styles.tfBtn,
              selectedTF === tf && styles.activeTF,
            ]}
            onPress={() => setSelectedTF(tf)}
          >
            <Text
              style={[
                styles.tfText,
                selectedTF === tf && styles.activeText,
              ]}
            >
              {tf}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* CHART */}
      <View style={styles.chartCard}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading chart data...</Text>
          </View>
        ) : candlesToShow.length > 0 ? (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 8 }}
          >
            <View style={styles.ohlcChart}>
              {/* Y-axis labels */}
              <View style={styles.yAxisLabels}>
                <Text style={styles.yAxisLabel}>₹{maxPrice.toFixed(0)}</Text>
                <Text style={styles.yAxisLabel}>₹{((minPrice + maxPrice) / 2).toFixed(0)}</Text>
                <Text style={styles.yAxisLabel}>₹{minPrice.toFixed(0)}</Text>
              </View>

              {/* Candlesticks */}
              <View style={styles.candlesContainer}>
                {candlesToShow.map((candle, idx) => (
                  <CandlestickBar
                    key={idx}
                    candle={candle}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    width={32}
                    height={200}
                  />
                ))}
              </View>
            </View>
          </ScrollView>
        ) : (
          <Text style={styles.emptyText}>No data available</Text>
        )}
      </View>

      {/* TABLE TITLE */}
      <Text style={styles.section}>Candle Data</Text>

      {/* TABLE HEADER */}
      <View style={styles.tableHeader}>
        <Text style={styles.cell}>Time</Text>
        <Text style={styles.cell}>Open</Text>
        <Text style={styles.cell}>High</Text>
        <Text style={styles.cell}>Low</Text>
        <Text style={styles.cell}>Close</Text>
      </View>

      {/* TABLE */}
      {candlesToShow.length > 0 ? (
        <FlatList
          data={candlesToShow.slice(-4).reverse()}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.rowItem}>
              <Text style={styles.cell}>{item.getFormattedTime()}</Text>
              <Text style={styles.cell}>₹{item.open.toFixed(2)}</Text>
              <Text style={[styles.cell, styles.green]}>
                ₹{item.high.toFixed(2)}
              </Text>
              <Text style={[styles.cell, styles.red]}>
                ₹{item.low.toFixed(2)}
              </Text>
              <Text style={styles.cell}>₹{item.close.toFixed(2)}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.emptyText}>No data available</Text>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },

  errorContainer: {
    backgroundColor: colors.error,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },

  errorText: {
    color: colors.text,
    fontSize: 14,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
    color: colors.text,
  },

  tfRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },

  tfBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: colors.border,
  },

  activeTF: {
    backgroundColor: colors.primary,
  },

  activeText: {
    color: colors.background,
    fontWeight: '600',
  },

  tfText: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  loadingContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    color: colors.textSecondary,
    marginTop: 10,
    fontSize: 12,
  },

  section: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
    color: colors.text,
  },

  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },

  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: colors.surface,
    marginTop: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },

  cell: {
    fontSize: 12,
    color: colors.text,
  },

  green: {
    color: colors.success,
  },

  red: {
    color: colors.error,
  },

  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },

  ohlcChart: {
    flexDirection: 'row',
    height: 200,
    alignItems: 'flex-end',
    marginVertical: 10,
  },

  yAxisLabels: {
    width: 50,
    justifyContent: 'space-between',
    paddingRight: 8,
  },

  yAxisLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'right',
  },

  candlesContainer: {
    flexDirection: 'row',
    height: 200,
    alignItems: 'flex-end',
  },

  candlestick: {
    height: 200,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});