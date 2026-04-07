import { Colors } from '@/constants/theme';
import { useColorScheme } from './use-color-scheme';

type ThemeColors = keyof typeof Colors.light;

export function useThemeColor(
  colors: { light?: string; dark?: string },
  colorName: ThemeColors
) {
  const colorScheme = useColorScheme() ?? 'light';
  const colorFromProps = colors[colorScheme];

  if (colorFromProps) {
    return colorFromProps;
  }

  return Colors[colorScheme][colorName];
}
