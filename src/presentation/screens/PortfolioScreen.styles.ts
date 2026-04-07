import { StyleSheet } from 'react-native';
import { colors } from '../../shared/theme/colors';

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

export default styles;