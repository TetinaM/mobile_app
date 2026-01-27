import React from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';

export const HapticTab: React.FC<BottomTabBarButtonProps> = (props) => {
  const { onPress, children, ...rest } = props;

  const handlePress = (event: any) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    if (onPress) {
      onPress(event);
    }
  };

  const { delayLongPress, ...touchableProps } = rest as any;

  return (
    <TouchableOpacity 
      {...touchableProps} 
      onPress={handlePress} 
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
};