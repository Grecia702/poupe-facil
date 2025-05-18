import React, { useEffect, useRef } from 'react';
import { Animated, View, I18nManager } from 'react-native';

export default function CustomProgressBar({
  progress = 0,
  height = 8,
  width = 200,
  color = '#007AFF',
  unfilledColor = '#eee',
  borderRadius = 999,
  duration = 500,
  style,
}) {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: Math.min(Math.max(progress, 0), 1),
      duration,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const translateX = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-(width / 2), 0],
  });

  const scaleX = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.0001, 1],
  });

  return (
    <View
      style={[
        {
          width,
          height,
          backgroundColor: unfilledColor,
          borderRadius,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View
        style={{
          height,
          backgroundColor: color,
          borderTopRightRadius: borderRadius,
          borderBottomRightRadius: borderRadius,
          transform: [
            { translateX: I18nManager.isRTL ? -translateX : translateX },
            { scaleX },
          ],
        }}
      />
    </View>
  );
}
