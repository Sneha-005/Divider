import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../shared/theme/colors';
import { usePortfolio, useStocks, useBuySell } from '../hooks/useStock';
import { Stock } from '../../domain/entities/stock.entity';
import { PortfolioCard } from '../components/PortfolioCard';
import { StockListItem } from '../components/StockListItem';
import { BuySellModal } from '../components/BuySellModal';

export const HomeScreen: React.FC<{ onNavigateToPortfolio?: () => void }> = ({ onNavigateToPortfolio }) => {
  const { portfolio, loading: portfolioLoading, error: portfolioError } = usePortfolio();
  const { stocks, loading: stocksLoading, error: stocksError } = useStocks();
  const { buyStock, sellStock } = useBuySell();

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

  const handleTransactionConfirm = async (quantity: number): Promise<boolean> => {
    if (!selectedStock) return false;

    try {
      if (transactionType === 'buy') {
        const result = await buyStock(selectedStock.id, quantity);
        return result.success;
      } else {
        const result = await sellStock(selectedStock.id, quantity);
        return result.success;
      }
    } catch {
      return false;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.screenBackground }]}>
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
              {stocks.map(stock => (
                <StockListItem
                  key={stock.id}
                  symbol={stock.symbol}
                  name={stock.name}
                  price={stock.price}
                  changePercent={stock.changePercent}
                  change={stock.change}
                  onPress={() => handleStockItemPress(stock)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Buy/Sell Modal */}
      {selectedStock && (
        <BuySellModal
          visible={showModal}
          stockSymbol={selectedStock.symbol}
          stockPrice={selectedStock.price}
          type={transactionType}
          onClose={() => {
            setShowModal(false);
            setSelectedStock(null);
          }}
          onConfirm={handleTransactionConfirm}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screenBackground,
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
    color: colors.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
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
    backgroundColor: colors.errorLight,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: colors.error,
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
    borderRadius: 8,
    alignItems: 'center',
  },
  buyButton: {
    backgroundColor: colors.success,
  },
  sellButton: {
    backgroundColor: colors.error,
  },
  actionButtonText: {
    color: colors.cardBackground,
    fontSize: 14,
    fontWeight: '600',
  },
  pricesSection: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionHeader: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
  },
  stockListContainer: {
    backgroundColor: colors.cardBackground,
  },
  emptyContainer: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
  },
});

export default HomeScreen;
