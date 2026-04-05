import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { colors } from '../../shared/theme/colors';
import { usePortfolio, useStocks } from '../hooks/useStock';
import { useMarketData } from '../hooks/useMarketData';
import { Stock } from '../../domain/entities/stock.entity';
import { PortfolioCard } from '../components/PortfolioCard';
import { StockListItem } from '../components/StockListItem';
import { TradingModal } from '../components/TradingModal';

export const HomeScreen: React.FC<{ onNavigateToPortfolio?: () => void }> = ({ onNavigateToPortfolio }) => {
  const { portfolio, loading: portfolioLoading, error: portfolioError } = usePortfolio();
  const { stocks, loading: stocksLoading, error: stocksError } = useStocks();
  const { marketData, connected } = useMarketData();

  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [transactionType, setTransactionType] = useState<'buy' | 'sell'>('buy');
  const [showModal, setShowModal] = useState(false);

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

  // Merge live WebSocket data with static stock data
  const liveStocks = stocks.map(stock => {
    const liveUpdate = marketData.find(m => m.symbol === stock.symbol);
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Divider</Text>
          <Text style={styles.headerSubtitle}>Stock Market Analytics</Text>
        </View>

        {/* Portfolio Card */}
        {portfolioLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : portfolioError || !portfolio ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{portfolioError || 'Failed to load portfolio'}</Text>
          </View>
        ) : (
          <TouchableOpacity onPress={onNavigateToPortfolio} activeOpacity={0.7}>
            <PortfolioCard
              totalAmount={portfolio.totalAmount}
              profitLoss={portfolio.profitLoss}
              profitLossPercent={portfolio.profitLossPercent}
            />
          </TouchableOpacity>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.buyButton]}
            onPress={() => {
              if (stocks.length > 0) {
                handleBuyPress(stocks[0]);
              }
            }}
          >
            <Text style={styles.actionButtonText}>Buy Stock</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.sellButton]}
            onPress={() => {
              if (stocks.length > 0) {
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
            <Text style={styles.sectionTitle}>✓ Live Prices</Text>
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
          ) : stocks.length === 0 ? (
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
                  availableQuantity={stock.availableQuantity}
                  onPress={() => handleStockItemPress(stock)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

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
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#B0B8D4',
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
});

export default HomeScreen;
