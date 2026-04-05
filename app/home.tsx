import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../src/shared/theme/colors";
import { useMarketData } from "../src/presentation/hooks/useMarketData";
import { useWallet } from "../src/presentation/hooks/useTrading";
import { TradingModal } from "../src/presentation/components/TradingModal";
import { debugWebSocket } from "../src/utils/websocketDebugger";

export default function HomeScreen() {
  const router = useRouter();
  const { marketData, loading, connected, error } = useMarketData();
  const { wallet, refetch: refetchWallet } = useWallet();
  
  // Trading modal state
  const [tradingModalVisible, setTradingModalVisible] = React.useState(false);
  const [selectedStock, setSelectedStock] = React.useState<{
    symbol: string;
    currentPrice: number;
  } | null>(null);
  const [tradeType, setTradeType] = React.useState<'BUY' | 'SELL'>('BUY');

  React.useEffect(() => {
    console.log('\n\n═══════════════════════════════════════════');
    console.log('🏠 HOME SCREEN MOUNTED - RUNNING DIAGNOSTICS');
    console.log('═══════════════════════════════════════════\n');
    
    // Run debug on mount
    debugWebSocket().then((success) => {
      console.log('\n🔍 Debug Result:', success ? '✅ PASSED' : '❌ FAILED');
      console.log('═══════════════════════════════════════════\n');
    });
  }, []);

  React.useEffect(() => {
    if (marketData.length > 0) {
      console.log('\n💹 Market Data Updated:');
      console.log(`   📊 Total Stocks: ${marketData.length}`);
      console.log('   Available Quantities:');
      marketData.forEach((stock) => {
        console.log(`      • ${stock.symbol}: ${stock.availableQuantity?.toLocaleString('en-IN') || 'N/A'} shares | Price: ₹${stock.currentPrice}`);
      });
      console.log('');
    }
  }, [marketData]);

  React.useEffect(() => {
    console.log('\n📊 HOME SCREEN STATE UPDATE:');
    console.log('   Connected:', connected);
    console.log('   Loading:', loading);
    console.log('   Market Data Count:', marketData.length);
    console.log('   Error:', error);
    if (marketData.length > 0) {
      console.log('   First Item:', marketData[0]);
      console.log('   Last Item:', marketData[marketData.length - 1]);
    }
    console.log('');
  }, [marketData, connected, loading, error]);

  const renderMarketItem = ({ item }: { item: any }) => {
    const isPositive = item.percentageChange >= 0;
    
    // Defensive check for available quantity
    const availableQty = item.availableQuantity !== undefined && item.availableQuantity !== null 
      ? item.availableQuantity 
      : 0;
    
    // Log each item being rendered with detailed info
    console.log(`\n🎨 Rendering card for ${item.symbol}`);
    console.log(`   ✓ Full Item:`, JSON.stringify(item, null, 2));
    console.log(`   ✓ availableQuantity from item:`, item.availableQuantity);
    console.log(`   ✓ Calculated availableQty:`, availableQty);
    console.log(`   ✓ Type: ${typeof availableQty}, Value: ${availableQty}`);
    console.log(`   ✓ Available Formatted: ${availableQty > 0 ? availableQty.toLocaleString('en-IN') : 'N/A'}`);
    console.log(`   ✓ Price: ${item.currentPrice}`);
    console.log(`   ✓ Change: ${item.percentageChange}%`);
    
    if (!availableQty || availableQty === 0) {
      console.warn(`⚠️  WARNING: No available quantity for ${item.symbol}`);
    }
    
    const handleBuy = () => {
      setSelectedStock({
        symbol: item.symbol,
        currentPrice: item.currentPrice,
      });
      setTradeType('BUY');
      setTradingModalVisible(true);
    };

    const handleSell = () => {
      setSelectedStock({
        symbol: item.symbol,
        currentPrice: item.currentPrice,
      });
      setTradeType('SELL');
      setTradingModalVisible(true);
    };

    const handlePricePress = () => {
      setSelectedStock({
        symbol: item.symbol,
        currentPrice: item.currentPrice,
      });
      setTradeType('BUY');
      setTradingModalVisible(true);
    };
    
    return (
      <TouchableOpacity 
        style={styles.marketCard}
        onPress={handlePricePress}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.symbolSection}>
            <Text style={styles.symbol}>{item.symbol}</Text>
            <View style={styles.quantityBadge}>
              <Text style={styles.quantityLabel}>📊</Text>
              <Text style={styles.quantityText}>
                {availableQty && availableQty > 0 
                  ? `${availableQty.toLocaleString('en-IN')} shares` 
                  : 'N/A'}
              </Text>
            </View>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              ₹{item.currentPrice?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </Text>
            <Text
              style={[
                styles.percentage,
                { color: isPositive ? "#34D399" : "#EF4444" },
              ]}
            >
              {isPositive ? "+" : ""}
              {item.percentageChange?.toFixed(2)}%
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.buyButton]}
            onPress={handleBuy}
          >
            <Text style={styles.actionButtonText}>💰 Buy</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.sellButton]}
            onPress={handleSell}
          >
            <Text style={styles.actionButtonText}>📊 Sell</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const handleTradeSuccess = () => {
    // Refresh wallet data after successful trade
    refetchWallet();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.title}>Market Updates</Text>
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: connected ? "#34D399" : "#EF4444" },
            ]}
          />
          <Text style={styles.statusText}>
            {connected ? "Live" : "Disconnected"}
          </Text>
        </View>
      </View>

      {/* Market Data List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Connecting to market data...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => router.replace("/home")}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={marketData}
          renderItem={(props) => {
            console.log(`\n🎴 FlatList rendering item:`, props.item.symbol);
            console.log(`   Full item data:`, JSON.stringify(props.item));
            console.log(`   availableQuantity:`, props.item.availableQuantity);
            console.log(`   Type:`, typeof props.item.availableQuantity);
            return renderMarketItem(props);
          }}
          keyExtractor={(item) => item.symbol}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No market data available</Text>
            </View>
          }
        />
      )}

      {/* Footer Navigation */}
      <View style={styles.footerSection}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/(tabs)/portfolio")}
        >
          <Text style={styles.navButtonText}>Portfolio</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => router.replace("/login")}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Trading Modal */}
      {selectedStock && (
        <TradingModal
          visible={tradingModalVisible}
          symbol={selectedStock.symbol}
          currentPrice={selectedStock.currentPrice}
          type={tradeType}
          marketData={marketData}
          onClose={() => {
            setTradingModalVisible(false);
            setSelectedStock(null);
          }}
          onSuccess={handleTradeSuccess}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2D3556",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#B0B8D4",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#B0B8D4",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  errorText: {
    color: "#FCA5A5",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  marketCard: {
    backgroundColor: "#1A1F3A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2D3556",
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buyButton: {
    backgroundColor: "#34D399",
  },
  sellButton: {
    backgroundColor: "#EF4444",
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  symbol: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  symbolSection: {
    flexDirection: 'column',
  },
  quantityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#34D399',
    marginTop: 8,
  },
  quantityLabel: {
    fontSize: 14,
    marginRight: 6,
  },
  quantityText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#34D399',
  },
  quantitySubtext: {
    fontSize: 9,
    color: '#7A8393',
    marginTop: 4,
    fontWeight: '500',
  },
  volume: {
    fontSize: 12,
    color: "#B0B8D4",
    fontWeight: "500",
  },
  quantity: {
    fontSize: 11,
    color: "#7A8393",
    fontWeight: "500",
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  percentage: {
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: {
    fontSize: 14,
    color: "#B0B8D4",
  },
  footerSection: {
    borderTopWidth: 1,
    borderTopColor: "#2D3556",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  navButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  logoutButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
