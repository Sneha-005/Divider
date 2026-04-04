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
import { usePortfolio, useBuySell } from '../hooks/useStock';
import { Stock } from '../../domain/entities/stock.entity';
import { PortfolioHeader } from '../components/PortfolioHeader';
import { StatisticsBox } from '../components/StatisticsBox';
import { HoldingCard } from '../components/HoldingCard';
import { BuySellModal } from '../components/BuySellModal';
import { LoadingOverlay } from '../components/LoadingOverlay';

interface PortfolioScreenProps {
  onNavigateToHome?: () => void;
}

export const PortfolioScreen: React.FC<PortfolioScreenProps> = ({ onNavigateToHome }) => {
  const { portfolio, loading, error } = usePortfolio();
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E40AF" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !portfolio) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Failed to load portfolio'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={onNavigateToHome}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Portfolio Details</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <PortfolioHeader
          totalAmount={portfolio.totalAmount}
          holdingsCount={portfolio.stocks.length}
        />

        {/* Statistics Section */}
        <View style={styles.statisticsSection}>
          <View style={styles.statisticsRow}>
            <StatisticsBox
              label="Total"
              value={`₹${portfolio.totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
              color="#0F172A"
            />
            <View style={styles.divider} />
            <StatisticsBox
              label="Invested"
              value={`₹${portfolio.investedAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
              color="#3B82F6"
            />
            <View style={styles.divider} />
            <StatisticsBox
              label="Cash"
              value={`₹${(portfolio.totalAmount - portfolio.investedAmount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
              color="#34D399"
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.depositButton}>
            <Text style={styles.buttonText}>Deposit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.withdrawButton}>
            <Text style={styles.buttonText}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* Holdings Section */}
        <View style={styles.holdingsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Holdings</Text>
          </View>

          {portfolio.stocks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No holdings yet</Text>
            </View>
          ) : (
            <View style={styles.holdingsList}>
              {portfolio.stocks.map(stock => (
                <HoldingCard
                  key={stock.id}
                  symbol={stock.symbol}
                  priceChange={stock.change}
                  units={stock.quantity || 200}
                  averagePrice={stock.price * 0.95}
                  currentPrice={stock.price}
                  value={stock.price * (stock.quantity || 200)}
                  changePercent={stock.changePercent}
                  onPress={() => {
                    setSelectedStock(stock);
                    setTransactionType('buy');
                    setShowModal(true);
                  }}
                />
              ))}
            </View>
          )}
        </View>

        {/* Recent Transactions Section */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📊 Recent Transactions</Text>
          </View>
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>📋 Transaction history coming soon</Text>
          </View>
        </View>

        <View style={{ height: 20 }} />
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
    backgroundColor: '#F8FAFC',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 60,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
  },
  statisticsSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  statisticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#E2E8F0',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
  },
  depositButton: {
    flex: 1,
    backgroundColor: '#34D399',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  withdrawButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  holdingsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  holdingsList: {
    gap: 12,
  },
  emptyContainer: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  transactionsSection: {
    paddingHorizontal: 16,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#94A3B8',
  },
});

export default PortfolioScreen;
