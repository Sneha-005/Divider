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
import { Colors } from "../src/shared/theme/colors";
import { useMarketData } from "../src/presentation/hooks/useMarketData";
import { debugWebSocket } from "../src/utils/websocketDebugger";

export default function HomeScreen() {
  const router = useRouter();
  const { marketData, loading, connected, error } = useMarketData();

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
    
    return (
      <View style={styles.marketCard}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.symbol}>{item.symbol}</Text>
            <Text style={styles.volume}>Vol: {(item.volume / 1000).toFixed(0)}K</Text>
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
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
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
          <ActivityIndicator size="large" color={Colors.primary} />
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
          renderItem={renderMarketItem}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    backgroundColor: Colors.primary,
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
  },
  symbol: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  volume: {
    fontSize: 12,
    color: "#B0B8D4",
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
    backgroundColor: Colors.primary,
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
    flex: 1,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    backgroundColor: Colors.button.primary,
    borderRadius: 10,
    marginBottom: 40,
  },
  buttonText: {
    color: Colors.button.primaryText,
    fontSize: 16,
    fontWeight: "700",
  },
});
