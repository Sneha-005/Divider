import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Modal,
  TextInput,
} from 'react-native';
import { colors } from '../../shared/theme/colors';
import { useWallet, useTransactions, useCashOperations } from '../hooks/useTrading';
import { PortfolioHeader } from '../components/PortfolioHeader';
import { StatisticsBox } from '../components/StatisticsBox';

interface PortfolioScreenProps {
  onNavigateToHome?: () => void;
}

export const PortfolioScreen: React.FC<PortfolioScreenProps> = ({ onNavigateToHome }) => {
  const { wallet, loading, error, refetch } = useWallet();
  const { transactions, loading: txLoading, error: txError, refetch: refetchTx } = useTransactions();
  const {
    depositCash,
    withdrawCash,
    loading: cashLoading,
    error: cashError,
  } = useCashOperations();

  const [cashModalVisible, setCashModalVisible] = useState(false);
  const [cashAction, setCashAction] = useState<'deposit' | 'withdraw'>('deposit');
  const [amountInput, setAmountInput] = useState('');
  const [cashResultMessage, setCashResultMessage] = useState<string | null>(null);

  useEffect(() => {
    console.log('PortfolioScreen mounted, fetching wallet and transactions...');
    refetch();
    refetchTx();
  }, [refetch, refetchTx]);

  const openCashModal = (action: 'deposit' | 'withdraw') => {
    setCashAction(action);
    setAmountInput('');
    setCashResultMessage(null);
    setCashModalVisible(true);
  };

  const closeCashModal = () => {
    setCashModalVisible(false);
    setAmountInput('');
  };

  const formatAmount = (value: number) =>
    value.toLocaleString('en-IN', { maximumFractionDigits: 2 });

  const getFailureMessage = (code?: string, message?: string, details?: any) => {
    if (code === 'INSUFFICIENT_FUNDS' && details) {
      const available = details.available_cash ?? details.available ?? 0;
      return `❌ ${message} (Available: ₹${formatAmount(Number(available))})`;
    }

    if (code) {
      return `❌ ${code}: ${message || 'Operation failed'}`;
    }

    return `❌ ${message || 'Operation failed'}`;
  };

  const handleCashOperation = async () => {
    const amount = Number(amountInput);

    if (!Number.isFinite(amount) || amount <= 0) {
      setCashResultMessage('❌ Please enter a valid amount greater than 0');
      return;
    }

    const result =
      cashAction === 'deposit' ? await depositCash(amount) : await withdrawCash(amount);

    if (result.success) {
      const actionLabel = cashAction === 'deposit' ? 'Deposited' : 'Withdrawn';
      const resultAmount = result.data?.amount ?? amount;
      setCashResultMessage(`✅ ${actionLabel} ₹${formatAmount(Number(resultAmount))}`);
      closeCashModal();

      // Refresh portfolio and transactions after cash operation
      await Promise.all([refetch(), refetchTx()]);
      return;
    }

    setCashResultMessage(getFailureMessage(result.code, result.message, result.details));
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !wallet) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Failed to load portfolio'}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <PortfolioHeader
          totalAmount={wallet?.total_balance || 0}
        />

        {/* Statistics Section */}
        <View style={styles.statisticsSection}>
          <View style={styles.statisticsRow}>
            <StatisticsBox
              label="Total"
              value={`₹${(wallet?.total_balance || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
            />
            <View style={styles.divider} />
            <StatisticsBox
              label="Invested"
              value={`₹${(wallet?.invested_amount || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
              color="#3B82F6"
            />
            <View style={styles.divider} />
            <StatisticsBox
              label="Cash"
              value={`₹${(wallet?.available_cash || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
              color="#34D399"
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.depositButton, cashLoading && styles.disabledActionButton]}
            onPress={() => openCashModal('deposit')}
            disabled={cashLoading}
          >
            <Text style={styles.buttonText}>Deposit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.withdrawButton, cashLoading && styles.disabledActionButton]}
            onPress={() => openCashModal('withdraw')}
            disabled={cashLoading}
          >
            <Text style={styles.buttonText}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        {(cashResultMessage || cashError) && (
          <View style={styles.cashMessageContainer}>
            <Text style={styles.cashMessageText}>{cashResultMessage || `❌ ${cashError}`}</Text>
          </View>
        )}

        {/* Holdings Section */}
        <View style={styles.holdingsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Holdings ({wallet?.holdings?.length || 0})</Text>
          </View>

          {!wallet?.holdings || wallet.holdings.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No holdings yet</Text>
            </View>
          ) : (
            <View style={styles.holdingsList}>
              {wallet.holdings.map((holding: any, index: number) => {
                const isProfit = (holding.unrealized_pnl || 0) >= 0;
                return (
                  <View key={index} style={styles.holdingCard}>
                    {/* Top Row: Symbol and Current Value */}
                    <View style={styles.holdingHeader}>
                      <View>
                        <Text style={styles.holdingSymbol}>{holding.symbol || 'N/A'}</Text>
                        <Text style={styles.holdingQty}>Qty: {holding.quantity || 0}</Text>
                      </View>
                      <View style={styles.holdingRight}>
                        <Text style={styles.holdingValue}>
                          ₹{(holding.current_value || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </Text>
                        <Text style={[
                          styles.holdingPercentage,
                          { color: isProfit ? colors.success : colors.error }
                        ]}>
                          {isProfit ? '+' : ''}{(holding.percentage || 0).toFixed(2)}%
                        </Text>
                      </View>
                    </View>

                    {/* Middle Row: Price Information */}
                    <View style={styles.holdingDetails}>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Current Price:</Text>
                        <Text style={styles.detailValue}>
                          ₹{(holding.current_price || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Avg Cost:</Text>
                        <Text style={styles.detailValue}>
                          ₹{(holding.average_cost || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </Text>
                      </View>
                    </View>

                    {/* Bottom Row: P&L */}
                    <View style={styles.holdingFooter}>
                      <Text style={styles.pnlLabel}>Unrealized P&L:</Text>
                      <Text style={[
                        styles.pnlValue,
                        { color: isProfit ? colors.success : colors.error }
                      ]}>
                        {isProfit ? '+' : ''}₹{(holding.unrealized_pnl || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Transactions Section */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions ({transactions.length})</Text>
          </View>

          {transactions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No transactions yet</Text>
            </View>
          ) : (
            <View style={styles.transactionsList}>
              {transactions.map((transaction: any, index: number) => {
                const isBuy = transaction.type === 'BUY';
                const createdDate = new Date(transaction.created_at).toLocaleDateString('en-IN');
                const createdTime = new Date(transaction.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
                
                return (
                  <View key={index} style={styles.transactionCard}>
                    {/* Header: Type and Symbol */}
                    <View style={styles.transactionHeader}>
                      <View style={styles.typeContainer}>
                        <Text style={[
                          styles.transactionType,
                          { color: isBuy ? colors.success : colors.error }
                        ]}>
                          {transaction.type}
                        </Text>
                        <Text style={styles.transactionSymbol}>{transaction.symbol}</Text>
                      </View>
                      <View style={styles.amountContainer}>
                        <Text style={[
                          styles.transactionAmount,
                          { color: isBuy ? colors.error : colors.success }
                        ]}>
                          {isBuy ? '-' : '+'}₹{(transaction.amount || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </Text>
                        <Text style={styles.transactionQty}>Qty: {transaction.quantity}</Text>
                      </View>
                    </View>

                    {/* Details Row */}
                    <View style={styles.transactionDetails}>
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Price</Text>
                        <Text style={styles.detailValue}>
                          ₹{(transaction.price || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Fee</Text>
                        <Text style={styles.detailValue}>
                          ₹{(transaction.fee || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Date</Text>
                        <Text style={styles.detailValue}>{createdDate}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Time</Text>
                        <Text style={styles.detailValue}>{createdTime}</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={cashModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeCashModal}
      >
        <View style={styles.cashModalOverlay}>
          <View style={styles.cashModalCard}>
            <Text style={styles.cashModalTitle}>
              {cashAction === 'deposit' ? 'Deposit Cash' : 'Withdraw Cash'}
            </Text>
            <Text style={styles.cashModalSubtitle}>
              {cashAction === 'deposit'
                ? 'Add funds to your available cash balance.'
                : `Available cash: ₹${formatAmount(Number(wallet?.available_cash || 0))}`}
            </Text>

            <TextInput
              value={amountInput}
              onChangeText={setAmountInput}
              keyboardType="decimal-pad"
              placeholder="Enter amount"
              placeholderTextColor="#94A3B8"
              style={styles.cashInput}
              editable={!cashLoading}
            />

            {cashError && !cashResultMessage && <Text style={styles.cashInlineError}>{cashError}</Text>}

            <View style={styles.cashModalActions}>
              <TouchableOpacity
                style={styles.cashCancelButton}
                onPress={closeCashModal}
                disabled={cashLoading}
              >
                <Text style={styles.cashCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.cashConfirmButton,
                  cashAction === 'withdraw' && styles.cashConfirmWithdraw,
                  cashLoading && styles.disabledActionButton,
                ]}
                onPress={handleCashOperation}
                disabled={cashLoading}
              >
                {cashLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.cashConfirmText}>
                    {cashAction === 'deposit' ? 'Deposit' : 'Withdraw'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E27',
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
    color: '#FCA5A5',
    fontSize: 16,
    textAlign: 'center',
  },
  statisticsSection: {
    backgroundColor: '#1A1F3A',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2D3556',
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
    backgroundColor: '#2D3556',
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
    borderRadius: 12,
    alignItems: 'center',
  },
  withdrawButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  disabledActionButton: {
    opacity: 0.6,
  },
  cashMessageContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2D3556',
    backgroundColor: '#141932',
  },
  cashMessageText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '500',
  },
  cashModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.7)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  cashModalCard: {
    backgroundColor: '#111827',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2D3556',
    padding: 16,
  },
  cashModalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  cashModalSubtitle: {
    color: '#B0B8D4',
    fontSize: 12,
    marginBottom: 12,
  },
  cashInput: {
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 10,
  },
  cashInlineError: {
    color: '#FCA5A5',
    fontSize: 12,
    marginBottom: 10,
  },
  cashModalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  cashCancelButton: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#475569',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cashCancelText: {
    color: '#CBD5E1',
    fontSize: 14,
    fontWeight: '600',
  },
  cashConfirmButton: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: '#22C55E',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cashConfirmWithdraw: {
    backgroundColor: '#EF4444',
  },
  cashConfirmText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
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
    color: '#FFFFFF',
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
    color: '#B0B8D4',
    fontSize: 14,
  },
  holdingCard: {
    backgroundColor: '#1A1F3A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2D3556',
    padding: 16,
  },
  holdingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  holdingSymbol: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  holdingQty: {
    color: '#B0B8D4',
    fontSize: 12,
  },
  holdingRight: {
    alignItems: 'flex-end',
  },
  holdingValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  holdingPercentage: {
    fontSize: 12,
    fontWeight: '600',
  },
  holdingDetails: {
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#0F172A',
    padding: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailRow_last: {
    marginBottom: 0,
  },
  detailLabel: {
    color: '#B0B8D4',
    fontSize: 12,
    fontWeight: '500',
  },
  detailValue: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  holdingFooter: {
    borderTopWidth: 1,
    borderTopColor: '#2D3556',
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pnlLabel: {
    color: '#B0B8D4',
    fontSize: 12,
    fontWeight: '500',
  },
  pnlValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  avgPrice: {
    color: '#B0B8D4',
    fontSize: 12,
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  transactionsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  transactionsList: {
    gap: 12,
  },
  transactionCard: {
    backgroundColor: '#1A1F3A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2D3556',
    padding: 16,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  typeContainer: {
    flex: 1,
  },
  transactionType: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  transactionSymbol: {
    fontSize: 12,
    color: '#B0B8D4',
    fontWeight: '500',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  transactionQty: {
    fontSize: 12,
    color: '#B0B8D4',
    fontWeight: '500',
  },
  transactionDetails: {
    borderTopWidth: 1,
    borderTopColor: '#2D3556',
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  detailItem: {
    width: '48%',
    marginBottom: 8,
  },
  emptyState: {
    backgroundColor: '#1A1F3A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2D3556',
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#B0B8D4',
  },
});

export default PortfolioScreen;
