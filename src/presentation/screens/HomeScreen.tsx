import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Animated,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../shared/theme/colors';
import { useStocks } from '../hooks/useStock';

import { useMarketData } from '../hooks/useMarketData';
import { useDashboard } from '../hooks/useTrading';
import { Stock } from '../../domain/entities/stock.entity';
import { StockListItem } from '../components/StockListItem';
import { TradingModal } from '../components/TradingModal';

export const HomeScreen: React.FC<{ onNavigateToPortfolio?: () => void }> = () => {
  const { stocks, loading: stocksLoading, error: stocksError } = useStocks();
  const { marketData, connected } = useMarketData();
  const { dashboard, loading: dashboardLoading, refetch: refetchDashboard } = useDashboard();

  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [transactionType, setTransactionType] = useState<'buy' | 'sell'>('buy');
  const [showModal, setShowModal] = useState(false);
  
  // Smooth animations
  const scrollViewOpacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(scrollViewOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [scrollViewOpacity]);

  const handleBuyPress = (stock: Stock) => {
    setSelectedStock(stock);
    setTransactionType('buy');
    setShowModal(true);
  };

  const handleSellPress = (stock: Stock) => {
    setSelectedStock(stock);
    setTransactionType('sell');
    setShowModal(true);
  };

  const handleStockItemPress = (stock: Stock) => {
    setSelectedStock(stock);
    setTransactionType('buy');
    setShowModal(true);
  };

  const handleTradeSuccess = () => {
    // After a successful trade, refetch dashboard data
    if (refetchDashboard) {
      refetchDashboard();
    }
  };

  // Merge live WebSocket data with static stock data
  const liveStocks = (stocks || []).map(stock => {
    const liveUpdate = (marketData || []).find(m => m.symbol === stock.symbol);
    if (liveUpdate) {
      return {
        ...stock,
        price: liveUpdate.currentPrice,
        changePercent: liveUpdate.percentageChange,
        availableQuantity: liveUpdate.availableQuantity,
      };
    }
    return { ...stock, availableQuantity: undefined };
  });

  const formatCurrency = (value: number | string | null | undefined, maximumFractionDigits = 2) => {
    const amount = Number(value ?? 0);
    return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits })}`;
  };

  const formatSignedCurrency = (value: number | string | null | undefined) => {
    const amount = Number(value ?? 0);
    const sign = amount >= 0 ? '+' : '-';
    return `${sign}${formatCurrency(Math.abs(amount), 2)}`;
  };

  const formatSignedPercent = (value: number | string | null | undefined) => {
    const percent = Number(value ?? 0);
    const sign = percent >= 0 ? '+' : '-';
    return `${sign}${Math.abs(percent).toFixed(2)}%`;
  };

  const formatLastUpdated = (timestamp?: string) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return timestamp;
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <Animated.ScrollView
        style={[styles.scrollView, { opacity: scrollViewOpacity }]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Divider</Text>
        </View>

        {/* Dashboard Stats Section */}
        {!dashboardLoading && dashboard && (
          <View style={styles.dashboardSection}>
            <View style={styles.dashboardSectionHeader}>
              <MaterialCommunityIcons name="view-dashboard-outline" size={18} color="#60A5FA" />
              <Text style={styles.dashboardSectionTitle}>Stats</Text>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={styles.statMetaRow}>
                  <MaterialCommunityIcons name="wallet-outline" size={14} color="#60A5FA" />
                  <Text style={styles.statLabel}>Total Balance</Text>
                </View>
                <Text style={styles.statValue}>{formatCurrency(dashboard.total_balance, 2)}</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statMetaRow}>
                  <MaterialCommunityIcons name="cash-multiple" size={14} color="#34D399" />
                  <Text style={styles.statLabel}>Available Cash</Text>
                </View>
                <Text style={styles.statValue}>{formatCurrency(dashboard.available_cash, 2)}</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statMetaRow}>
                  <MaterialCommunityIcons name="chart-box-outline" size={14} color="#FACC15" />
                  <Text style={styles.statLabel}>Invested Amount</Text>
                </View>
                <Text style={styles.statValue}>{formatCurrency(dashboard.invested_amount, 2)}</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statMetaRow}>
                  <MaterialCommunityIcons name="briefcase-variant-outline" size={14} color="#A78BFA" />
                  <Text style={styles.statLabel}>Holding Count</Text>
                </View>
                <Text style={styles.statValue}>{String(dashboard.holding_count ?? 0)}</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statMetaRow}>
                  <MaterialCommunityIcons
                    name={Number(dashboard.total_pnl) >= 0 ? 'trending-up' : 'trending-down'}
                    size={14}
                    color={Number(dashboard.total_pnl) >= 0 ? '#34D399' : '#EF4444'}
                  />
                  <Text style={styles.statLabel}>Total P&L</Text>
                </View>
                <Text
                  style={[
                    styles.statValue,
                    Number(dashboard.total_pnl) >= 0 ? styles.statValuePositive : styles.statValueNegative,
                  ]}
                >
                  {formatSignedCurrency(dashboard.total_pnl)}
                </Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statMetaRow}>
                  <MaterialCommunityIcons name="percent-outline" size={14} color="#38BDF8" />
                  <Text style={styles.statLabel}>P&L %</Text>
                </View>
                <Text
                  style={[
                    styles.statValue,
                    Number(dashboard.total_pnl_percent) >= 0 ? styles.statValuePositive : styles.statValueNegative,
                  ]}
                >
                  {formatSignedPercent(dashboard.total_pnl_percent)}
                </Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statMetaRow}>
                  <MaterialCommunityIcons name="arrow-up-bold-circle-outline" size={14} color="#34D399" />
                  <Text style={styles.statLabel}>Top Gainer</Text>
                </View>
                <Text style={styles.statValueCompact}>{dashboard.top_gainer || 'N/A'}</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statMetaRow}>
                  <MaterialCommunityIcons name="arrow-down-bold-circle-outline" size={14} color="#EF4444" />
                  <Text style={styles.statLabel}>Top Loser</Text>
                </View>
                <Text style={styles.statValueCompact}>{dashboard.top_loser || 'N/A'}</Text>
              </View>
            </View>

            <View style={styles.lastUpdatedRow}>
              <MaterialCommunityIcons name="clock-time-four-outline" size={14} color="#B0B8D4" />
              <Text style={styles.lastUpdatedText}>Updated: {formatLastUpdated(dashboard.last_updated)}</Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.buyButton]}
            onPress={() => {
              if (stocks && stocks.length > 0) {
                handleBuyPress(stocks[0]);
              }
            }}
          >
            <Text style={styles.actionButtonText}>Buy Stock</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.sellButton]}
            onPress={() => {
              if (stocks && stocks.length > 0) {
                handleSellPress(stocks[0]);
              }
            }}
          >
            <Text style={styles.actionButtonText}>Sell Stock</Text>
          </TouchableOpacity>
        </View>

        {/* Live Prices Section */}
        <View style={styles.pricesSection}>
          <View style={styles.sectionHeader}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.sectionTitle}>✓ Live Prices</Text>
              <Text style={{ color: connected ? '#00D084' : '#FF6B6B', fontSize: 12, fontWeight: 'bold' }}>{connected ? '🟢 Live' : '🔴 Reconnecting...'}</Text>
            </View>
          </View>

          {stocksLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : stocksError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{stocksError}</Text>
            </View>
          ) : !stocks || stocks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No stocks available</Text>
            </View>
          ) : (
            <View style={styles.stockListContainer}>
              {liveStocks.map(stock => (
                <StockListItem
                  key={stock.id}
                  symbol={stock.symbol}
                  name={stock.name}
                  price={stock.price}
                  changePercent={stock.changePercent}
                  change={stock.change}
                  availableQuantity={(stock as any).availableQuantity}
                  onPress={() => handleStockItemPress(stock)}
                />
              ))}
            </View>
          )}
        </View>
      </Animated.ScrollView>

      {/* Buy/Sell Modal */}
      {selectedStock && (
        <TradingModal
          visible={showModal}
          symbol={selectedStock.symbol}
          currentPrice={selectedStock.price}
          type={transactionType === 'buy' ? 'BUY' : 'SELL'}
          marketData={marketData}
          onClose={() => {
            setShowModal(false);
            setSelectedStock(null);
          }}
          onSuccess={handleTradeSuccess}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E27',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#00D084',
    marginBottom: 0,
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
    backgroundColor: '#7F1D1D',
    borderRadius: 12,
    marginBottom: 20,
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buyButton: {
    backgroundColor: '#34D399',
  },
  sellButton: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  pricesSection: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: '#1A1F3A',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2D3556',
  },
  sectionHeader: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3556',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stockListContainer: {
    backgroundColor: '#1A1F3A',
  },
  emptyContainer: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#B0B8D4',
    fontSize: 14,
  },
  dashboardSection: {
    marginHorizontal: 16,
    marginBottom: 16,
    marginTop: 12,
    backgroundColor: '#1A1F3A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2D3556',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  dashboardSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  dashboardSectionTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  statCard: {
    width: '48.5%',
    backgroundColor: '#141932',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2D3556',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  statMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 10,
    color: '#B0B8D4',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    flex: 1,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statValueCompact: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statValuePositive: {
    color: '#34D399',
  },
  statValueNegative: {
    color: '#EF4444',
  },
  lastUpdatedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#2D3556',
  },
  lastUpdatedText: {
    color: '#B0B8D4',
    fontSize: 11,
    fontWeight: '500',
  },
});

export default HomeScreen;
