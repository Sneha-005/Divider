import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface SvgIconProps {
  name: 'home' | 'portfolio' | 'profile' | 'chart' | 'alert';
  size?: number;
  color?: string;
  width?: number;
  height?: number;
}

// SVG path data for each icon
const SVG_PATHS = {
  home: 'M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z',
  portfolio: 'M160-280v80h640v-80H160Zm120-440v-80q0-33 23.5-56.5T360-880h240q33 0 56.5 23.5T680-800v80h120q33 0 56.5 23.5T880-640v440q0 33-23.5 56.5T800-120H160q-33 0-56.5-23.5T80-200v-440q0-33 23.5-56.5T160-720h120ZM160-400h640v-240H680v80h-80v-80H360v80h-80v-80H160v240Zm200-320h240v-80H360v80ZM160-200v-440 80-80 80-80 440Z',
  profile: 'M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q560-607 560-640t-23.5-56.5Q513-720 480-720t-56.5 23.5Q400-673 400-640t23.5 56.5Q447-560 480-560t56.5-23.5ZM480-640Zm0 400Z',
  chart: 'm140-220-60-60 300-300 160 160 284-320 56 56-340 384-160-160-240 240Z',
  alert: 'M451.5-291.5Q440-303 440-320t11.5-28.5Q463-360 480-360t28.5 11.5Q520-337 520-320t-11.5 28.5Q497-280 480-280t-28.5-11.5ZM440-440v-400h80v400h-80ZM200-120q-33 0-56.5-23.5T120-200v-120h80v120h560v-120h80v120q0 33-23.5 56.5T760-120H200Z',
};

export function SvgIcon({ name, size = 24, color = '#e3e3e3', width, height }: SvgIconProps) {
  const iconWidth = width || size;
  const iconHeight = height || size;

  return (
    <Svg
      width={iconWidth}
      height={iconHeight}
      viewBox="0 -960 960 960"
      fill={color}
      style={styles.icon}
    >
      <Path d={SVG_PATHS[name]} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
