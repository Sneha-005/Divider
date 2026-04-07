import { StyleSheet } from 'react-native';
import { colors } from '../../shared/theme/colors';

const CHART_HEIGHT = 210;
const AXIS_COLUMN_WIDTH = 56;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },

  errorContainer: {
    backgroundColor: colors.error,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },

  errorText: {
    color: colors.text,
    fontSize: 14,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  limitBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    backgroundColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  selectorCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },

  selectorLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 8,
  },

  dropdownTrigger: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#141A33',
  },

  dropdownName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },

  dropdownSymbol: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },

  dropdownArrow: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },

  dropdownMenu: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 12,
    maxHeight: 220,
    backgroundColor: '#141A33',
  },

  dropdownScroll: {
    maxHeight: 220,
  },

  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  dropdownItemActive: {
    backgroundColor: 'rgba(0, 208, 132, 0.12)',
  },

  dropdownItemName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },

  dropdownItemNameActive: {
    color: colors.success,
  },

  dropdownItemSymbol: {
    marginTop: 2,
    color: colors.textSecondary,
    fontSize: 11,
  },

  snapshotCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  snapshotLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  snapshotPrice: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },

  snapshotChangeWrap: {
    alignItems: 'flex-end',
  },

  snapshotChange: {
    fontSize: 16,
    fontWeight: '700',
  },

  snapshotPercent: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 3,
  },

  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  loadingContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    color: colors.textSecondary,
    marginTop: 10,
    fontSize: 12,
  },

  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },

  chartCanvas: {
    paddingBottom: 8,
  },

  ohlcChart: {
    flexDirection: 'row',
    minHeight: CHART_HEIGHT,
    alignItems: 'flex-start',
    marginVertical: 10,
  },

  yAxisLabelsLeft: {
    width: AXIS_COLUMN_WIDTH,
    height: CHART_HEIGHT,
    justifyContent: 'space-between',
    paddingRight: 6,
  },

  yAxisLabelsRight: {
    width: AXIS_COLUMN_WIDTH,
    height: CHART_HEIGHT,
    justifyContent: 'space-between',
    paddingLeft: 6,
  },

  axisTitle: {
    fontSize: 9,
    color: colors.textSecondary,
    textAlign: 'right',
    fontWeight: '600',
    marginBottom: 4,
  },

  axisTitleRight: {
    textAlign: 'left',
  },

  yAxisLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'right',
  },

  yAxisLabelRight: {
    textAlign: 'left',
  },

  chartPlotArea: {
    height: CHART_HEIGHT,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#121834',
    overflow: 'hidden',
    position: 'relative',
  },

  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(176, 184, 212, 0.2)',
  },

  candlesContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    height: CHART_HEIGHT,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },

  candlestick: {
    height: CHART_HEIGHT,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  xAxisRow: {
    flexDirection: 'row',
    marginTop: 6,
    alignItems: 'center',
  },

  xAxisSpacer: {
    width: AXIS_COLUMN_WIDTH,
  },

  xAxisLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  xAxisLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  axisHint: {
    marginLeft: 58,
    marginTop: 6,
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },

  scrollHint: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
});

export default styles;
