import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors } from '../../shared/theme/colors';
import { Stock } from '../../domain/entities/Stock';
import { useStocks } from './useStocks';
import { PortfolioHeader } from '../components/PortfolioHeader';
import { TradeButtons } from '../components/TradeButtons';
import { StockCard } from '../components/StockCard';

interface DashboardScreenProps {
  onLogout: () => void;
  userName?: string;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onLogout,
  userName,
}) => {
  const { stocks, portfolio, loading, trading, executeTrade, refresh } =
    useStocks();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [showTradeModal, setShowTradeModal] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const handleBuy = () => {
    setTradeType('BUY');
    setSelectedStock(null);
    setShowTradeModal(true);
  };

  const handleSell = () => {
    setTradeType('SELL');
    setSelectedStock(null);
    setShowTradeModal(true);
  };

  const handleSelectStock = async (stock: Stock) => {
    const result = await executeTrade({
      stockId: stock.id,
      quantity: 1,
      price: stock.price,
      type: tradeType,
    });
    setShowTradeModal(false);
    Alert.alert(
      result.success ? 'Success ✅' : 'Failed ❌',
      result.message,
    );
  };

  const renderStockItem = ({ item }: { item: Stock }) => (
    <StockCard stock={item} />
  );

  const renderTradeStockItem = ({ item }: { item: Stock }) => (
    <TouchableOpacity
      onPress={() => handleSelectStock(item)}
      activeOpacity={0.7}
    >
      <StockCard stock={item} />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={stocks}
        keyExtractor={item => item.id}
        renderItem={renderStockItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <>
            {/* Portfolio Value */}
            <PortfolioHeader
              totalAmount={portfolio?.totalAmount ?? 0}
              userName={userName}
            />

            {/* Buy / Sell Buttons */}
            <TradeButtons
              onBuy={handleBuy}
              onSell={handleSell}
              disabled={trading}
            />

            {/* Section Header */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>📊</Text>
              <Text style={styles.sectionTitle}>Live Prices</Text>
            </View>
          </>
        }
        ListFooterComponent={
          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Trade Modal */}
      <Modal
        visible={showTradeModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowTradeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {tradeType === 'BUY' ? '📈 Buy Stock' : '📉 Sell Stock'}
              </Text>
              <TouchableOpacity onPress={() => setShowTradeModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtitle}>
              Select a stock to {tradeType.toLowerCase()} (1 unit)
            </Text>

            {trading ? (
              <View style={styles.tradingIndicator}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.tradingText}>Processing trade...</Text>
              </View>
            ) : (
              <FlatList
                data={stocks}
                keyExtractor={item => item.id}
                renderItem={renderTradeStockItem}
                contentContainerStyle={styles.modalList}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screenBackground,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.screenBackground,
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  listContent: {
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 8,
  },
  sectionIcon: {
    fontSize: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
  },
  logoutButton: {
    marginHorizontal: 20,
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.error,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.screenBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 32,
    maxHeight: '75%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
  },
  modalClose: {
    fontSize: 22,
    color: colors.textMuted,
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  modalList: {
    paddingHorizontal: 20,
  },
  tradingIndicator: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 16,
  },
  tradingText: {
    fontSize: 14,
    color: colors.textMuted,
  },
});

export default DashboardScreen;
