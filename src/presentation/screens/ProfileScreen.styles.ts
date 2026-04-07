import { StyleSheet } from 'react-native';
import { colors } from '../../shared/theme/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  contentContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },

  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 20,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },

  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginBottom: 14,
  },

  infoRow: {
    marginBottom: 14,
  },

  label: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },

  value: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },

  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },

  toggleLeft: {
    flex: 1,
  },

  toggleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },

  toggleDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },

  errorText: {
    fontSize: 16,
    color: colors.error,
  },

  // Badge styles
  badgeSuccess: {
    backgroundColor: colors.success,
    color: colors.text,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
    fontWeight: '600',
  },

  badgeWarning: {
    backgroundColor: colors.warning,
    color: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
    fontWeight: '600',
  },
});

export default styles;