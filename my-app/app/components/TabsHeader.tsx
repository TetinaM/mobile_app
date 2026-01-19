import React from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';

// component makes tab buttons with haptic feedback
export const HapticTab: React.FC<BottomTabBarButtonProps> = (props) => {
  const { onPress, children, ...rest } = props; // get onPress and children from props

  // function to handle press with haptic feedback
  const handlePress = (event: any) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync(); // trigger small vibration on press
    }
    if (onPress) {
      onPress(event); // call original onPress function
    }
  };

  const { delayLongPress, ...touchableProps } = rest as any; // remove delayLongPress to prevent errors

  return (
    <TouchableOpacity {...touchableProps} onPress={handlePress} activeOpacity={0.7}>
      {children} {/* show the content of the tab button */}
    </TouchableOpacity>
  );
};