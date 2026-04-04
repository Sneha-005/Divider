import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { useStocks } from '../hooks/useStock';

export const ChartScreen: React.FC = () => {
  const { stocks, loading, error } = useStocks();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📊 Market Charts</Text>
          <Text style={styles.headerSubtitle}>Stock Performance Analysis</Text>
        </View>

        {/* Content */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1E40AF" />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <View style={styles.chartContainer}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Top Gainers</Text>
              {stocks.slice(0, 3).map(stock => (
                <View key={stock.id} style={styles.chartItem}>
                  <View style={styles.itemLeft}>
                    <Text style={styles.symbolText}>{stock.symbol}</Text>
                    <Text style={styles.priceText}>₹{stock.price.toFixed(2)}</Text>
                  </View>
                  <View
                    style={[
                      styles.changeIndicator,
                      { backgroundColor: stock.changePercent >= 0 ? '#34D399' : '#EF4444' },
                    ]}
                  >
                    <Text style={styles.changeText}>
                      {stock.changePercent >= 0 ? '↑' : '↓'} {Math.abs(stock.changePercent).toFixed(2)}%
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Market Analysis</Text>
              <View style={styles.analysisBox}>
                <Text style={styles.analysisLabel}>Total Stocks Monitored</Text>
                <Text style={styles.analysisValue}>{stocks.length}</Text>
              </View>
              <View style={styles.analysisBox}>
                <Text style={styles.analysisLabel}>Average Change</Text>
                <Text style={styles.analysisValue}>
                  {(stocks.reduce((a, b) => a + b.changePercent, 0) / stocks.length).toFixed(2)}%
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
  },
  loadingContainer: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    marginHorizontal: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    marginBottom: 20,
  },
  errorText: {
    color: '#991B1B',
    fontSize: 14,
    fontWeight: '500',
  },
  chartContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  chartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  itemLeft: {
    flex: 1,
  },
  symbolText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 12,
    color: '#64748B',
  },
  changeIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  changeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  analysisBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  analysisLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  analysisValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E40AF',
  },
});

export default ChartScreen;
