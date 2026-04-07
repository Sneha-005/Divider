import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  StatusBar,
} from 'react-native';
import { colors } from '../../shared/theme/colors';
import styles from './ChartScreen.styles';
import { useCandles } from '../hooks/useCandles';
import { Candle } from '../../domain/entities/candle.entity';
import { useStocks } from '../hooks/useStock';

const screenWidth = Dimensions.get('window').width;
const CANDLE_LIMIT = 10;
const CHART_HEIGHT = 210;
const CANDLE_SLOT_WIDTH = 36;
const AXIS_COLUMN_WIDTH = 56;

const DEFAULT_SYMBOL = 'RELIANCE-CE-2900';

type CompanyOption = {
  name: string;
  symbol: string;
};

const FALLBACK_COMPANIES: CompanyOption[] = [
  { name: 'Reliance', symbol: 'RELIANCE-CE-2900' },
  { name: 'HDFC Bank', symbol: 'HDFC-PE-1400' },
  { name: 'Infosys', symbol: 'INFY-CE-1500' },
  { name: 'Tata Consultancy', symbol: 'TCS-CE-4500' },
  { name: 'ITC Limited', symbol: 'ITC-PE-2800' },
];

const formatXAxisTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return '--:--';
  }

  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

// OHLC Candlestick Component
type CandlestickProps = {
  candle: Candle;
  minPrice: number;
  maxPrice: number;
  width: number;
  height: number;
};

function CandlestickBar({ candle, minPrice, maxPrice, width, height }: CandlestickProps) {
  const range = maxPrice - minPrice || 1;
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
  const bodyHeight = Math.max(Math.abs(closeY - openY), 2);
  const wickTop = Math.min(highY, lowY);
  const wickHeight = Math.max(Math.abs(highY - lowY), 1);
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
          top: wickTop,
          height: wickHeight,
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
  const [symbol, setSymbol] = useState(DEFAULT_SYMBOL);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const { candles, loading, error, fetchCandles } = useCandles();
  const { stocks } = useStocks();

  const companyOptions = useMemo<CompanyOption[]>(() => {
    if (stocks.length === 0) {
      return FALLBACK_COMPANIES;
    }

    const uniqueCompanies = new Map<string, CompanyOption>();
    stocks.forEach(stock => {
      if (!uniqueCompanies.has(stock.symbol)) {
        uniqueCompanies.set(stock.symbol, {
          name: stock.name,
          symbol: stock.symbol,
        });
      }
    });

    return Array.from(uniqueCompanies.values());
  }, [stocks]);

  const selectedCompany = useMemo(
    () => companyOptions.find(company => company.symbol === symbol),
    [companyOptions, symbol],
  );

  useEffect(() => {
    if (!symbol) {
      return;
    }
    fetchCandles(symbol, CANDLE_LIMIT);
  }, [symbol, fetchCandles]);

  useEffect(() => {
    if (companyOptions.length === 0) {
      return;
    }

    const symbolExists = companyOptions.some(company => company.symbol === symbol);
    if (!symbolExists) {
      setSymbol(companyOptions[0].symbol);
    }
  }, [companyOptions, symbol]);

  const candlesToShow = useMemo(() => {
    const sortedCandles = [...candles].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );

    return sortedCandles.slice(-CANDLE_LIMIT);
  }, [candles]);

  const chartStats = useMemo(() => {
    if (candlesToShow.length === 0) {
      return {
        scaleMin: 0,
        scaleMax: 100,
        priceHigh: 100,
        priceLow: 0,
      };
    }

    const highs = candlesToShow.map((candle) => candle.high);
    const lows = candlesToShow.map((candle) => candle.low);
    const priceLow = Math.min(...lows);
    const priceHigh = Math.max(...highs);
    const padding = Math.max((priceHigh - priceLow) * 0.08, 0.5);

    return {
      scaleMin: priceLow - padding,
      scaleMax: priceHigh + padding,
      priceHigh,
      priceLow,
    };
  }, [candlesToShow]);

  const yAxisTicks = useMemo(() => {
    const tickCount = 5;
    const range = chartStats.scaleMax - chartStats.scaleMin || 1;

    return Array.from({ length: tickCount }, (_, index) => {
      const ratio = index / (tickCount - 1);
      return chartStats.scaleMax - range * ratio;
    });
  }, [chartStats]);

  const xAxisLabels = useMemo(() => {
    if (candlesToShow.length === 0) {
      return [] as Array<{ key: string; label: string }>;
    }

    return candlesToShow.map((candle, index) => ({
      key: `${index}-${candle.timestamp}`,
      label: formatXAxisTime(candle.timestamp),
    }));
  }, [candlesToShow]);

  const latestCandle = candlesToShow[candlesToShow.length - 1];
  const previousClose = candlesToShow.length > 1
    ? candlesToShow[candlesToShow.length - 2].close
    : latestCandle?.open ?? 0;
  const absoluteChange = latestCandle ? latestCandle.close - previousClose : 0;
  const percentChange = previousClose
    ? (absoluteChange / previousClose) * 100
    : 0;
  const isGain = absoluteChange >= 0;
  const chartWidth = Math.max(
    screenWidth - AXIS_COLUMN_WIDTH * 2 - 56,
    candlesToShow.length * CANDLE_SLOT_WIDTH,
  );

  useEffect(() => {
    if (candlesToShow.length === 0) {
      return;
    }

    console.log('[Chart] Candle coordinates', {
      symbol,
      count: candlesToShow.length,
      points: candlesToShow.map((candle, index) => ({
        index: index + 1,
        time: formatXAxisTime(candle.timestamp),
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
      })),
    });

    console.log('[Chart] Axis coordinates', {
      xLabels: xAxisLabels.map((item) => item.label),
      yTicks: yAxisTicks.map((value) => Number(value.toFixed(2))),
      scaleMin: Number(chartStats.scaleMin.toFixed(2)),
      scaleMax: Number(chartStats.scaleMax.toFixed(2)),
    });
  }, [symbol, candlesToShow, xAxisLabels, yAxisTicks, chartStats]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >

      {/* ERROR MESSAGE */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Warning: {error}</Text>
        </View>
      )}

      {/* HEADER */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Market Chart</Text>
        <Text style={styles.limitBadge}>Last {CANDLE_LIMIT}</Text>
      </View>

      {/* COMPANY DROPDOWN */}
      <View style={styles.selectorCard}>
        <Text style={styles.selectorLabel}>Choose Company</Text>
        <TouchableOpacity
          style={styles.dropdownTrigger}
          onPress={() => setShowCompanyDropdown(prev => !prev)}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.dropdownName}>
              {selectedCompany?.name || symbol.split('-')[0]}
            </Text>
            <Text style={styles.dropdownSymbol}>{symbol}</Text>
          </View>
          <Text style={styles.dropdownArrow}>{showCompanyDropdown ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {showCompanyDropdown && (
          <View style={styles.dropdownMenu}>
            <ScrollView nestedScrollEnabled style={styles.dropdownScroll}>
              {companyOptions.map((company) => {
                const isSelected = company.symbol === symbol;
                return (
                  <TouchableOpacity
                    key={company.symbol}
                    style={[
                      styles.dropdownItem,
                      isSelected && styles.dropdownItemActive,
                    ]}
                    onPress={() => {
                      setSymbol(company.symbol);
                      setShowCompanyDropdown(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemName,
                        isSelected && styles.dropdownItemNameActive,
                      ]}
                    >
                      {company.name}
                    </Text>
                    <Text style={styles.dropdownItemSymbol}>{company.symbol}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
      </View>

      {/* SNAPSHOT */}
      {latestCandle && (
        <View style={styles.snapshotCard}>
          <View>
            <Text style={styles.snapshotLabel}>Latest Close</Text>
            <Text style={styles.snapshotPrice}>₹{latestCandle.close.toFixed(2)}</Text>
          </View>
          <View style={styles.snapshotChangeWrap}>
            <Text style={[styles.snapshotChange, { color: isGain ? colors.success : colors.error }]}>
              {isGain ? '+' : ''}{absoluteChange.toFixed(2)}
            </Text>
            <Text style={[styles.snapshotPercent, { color: isGain ? colors.success : colors.error }]}>
              {isGain ? '+' : ''}{percentChange.toFixed(2)}%
            </Text>
          </View>
        </View>
      )}

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
            <View style={styles.chartCanvas}>
              <View style={styles.ohlcChart}>
                <View style={styles.yAxisLabelsLeft}>
                  <Text style={styles.axisTitle}>Price (INR)</Text>
                  {yAxisTicks.map((tickValue, index) => (
                    <Text key={`left-${index}`} style={styles.yAxisLabel}>
                      ₹{tickValue.toFixed(2)}
                    </Text>
                  ))}
                </View>

                <View style={[styles.chartPlotArea, { width: chartWidth }]}> 
                  {yAxisTicks.map((_, index) => (
                    <View
                      key={`line-${index}`}
                      style={[
                        styles.gridLine,
                        {
                          top: (CHART_HEIGHT * index) / (yAxisTicks.length - 1),
                        },
                      ]}
                    />
                  ))}

                  <View style={styles.candlesContainer}>
                    {candlesToShow.map((candle, idx) => (
                      <CandlestickBar
                        key={idx}
                        candle={candle}
                        minPrice={chartStats.scaleMin}
                        maxPrice={chartStats.scaleMax}
                        width={CANDLE_SLOT_WIDTH}
                        height={CHART_HEIGHT}
                      />
                    ))}
                  </View>
                </View>

                <View style={styles.yAxisLabelsRight}>
                  <Text style={[styles.axisTitle, styles.axisTitleRight]}>Price (INR)</Text>
                  {yAxisTicks.map((tickValue, index) => (
                    <Text key={`right-${index}`} style={[styles.yAxisLabel, styles.yAxisLabelRight]}>
                      ₹{tickValue.toFixed(2)}
                    </Text>
                  ))}
                </View>
              </View>

              <View style={styles.xAxisRow}>
                <View style={styles.xAxisSpacer} />
                <View style={[styles.xAxisLabelsRow, { width: chartWidth }]}> 
                  {xAxisLabels.map((item) => (
                    <Text key={item.key} style={[styles.xAxisLabel, { width: CANDLE_SLOT_WIDTH }]}>
                      {item.label}
                    </Text>
                  ))}
                </View>
                <View style={styles.xAxisSpacer} />
              </View>

              <Text style={styles.axisHint}>X: Time</Text>
            </View>
          </ScrollView>
        ) : (
          <Text style={styles.emptyText}>No data available</Text>
        )}
      </View>

      <Text style={styles.scrollHint}>Swipe chart left or right to inspect all 10 API candle coordinates.</Text>

      </ScrollView>
    </SafeAreaView>
  );
}


