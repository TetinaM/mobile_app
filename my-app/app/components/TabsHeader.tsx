import React from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';

export const HapticTab: React.FC<BottomTabBarButtonProps> = (props) => {
  const { onPress, children, ...rest } = props;

  // Triggers haptic feedback and executes the original onPress navigation action
  const handlePress = (event: any) => {
    // Selection feedback is only available on iOS and Android
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    
    if (onPress) {
      onPress(event);
    }
  };

  // Extracting delayLongPress to avoid passing unsupported props to TouchableOpacity
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