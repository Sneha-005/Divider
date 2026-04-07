import { StyleSheet } from 'react-native';
import { colors } from '../../shared/theme/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  errorContainer: {
    backgroundColor: colors.error,
    borderRadius: 8,
    padding: 10,
    margin: 16,
    marginBottom: 12,
  },

  errorText: {
    color: colors.text,
    fontSize: 14,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    color: colors.text,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: colors.text,
    paddingHorizontal: 16,
  },

  card: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },

  activeCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
    borderWidth: 1,
    borderColor: colors.border,
  },

  triggeredCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
    borderWidth: 1,
    borderColor: colors.border,
  },

  symbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },

  sub: {
    color: colors.textSecondary,
    marginTop: 5,
    fontSize: 12,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  greenDot: {
    width: 10,
    height: 10,
    backgroundColor: colors.success,
    borderRadius: 5,
    marginRight: 6,
  },

  active: {
    color: colors.success,
    fontWeight: '600',
    fontSize: 12,
  },

  label: {
    marginTop: 10,
    fontWeight: '600',
    color: colors.text,
    fontSize: 14,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    marginTop: 5,
    color: colors.text,
    backgroundColor: colors.background,
    fontSize: 14,
  },

  conditionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },

  conditionBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
  },

  conditionBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  conditionText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 12,
  },

  conditionTextActive: {
    color: colors.background,
  },

  createBtn: {
    backgroundColor: colors.success,
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },

  createBtnDisabled: {
    opacity: 0.6,
  },

  createText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 14,
  },

  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },

  loadingText: {
    color: colors.textSecondary,
    marginTop: 10,
    fontSize: 12,
  },

  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    fontSize: 14,
  },
});

export default styles;