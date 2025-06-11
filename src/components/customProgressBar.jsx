import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

export default function CustomProgressBar({
  progress = 0,
  height = 8,
  color = '#007AFF',
  unfilledColor = '#eee',
  borderRadius = 999,
  borderColor,
  borderWidth,
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

  const animatedWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      style={[
        {
          height,
          backgroundColor: unfilledColor,
          borderColor,
          borderRadius,
          borderWidth,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View
        style={{
          height,
          width: animatedWidth,
          backgroundColor: color,
          borderRadius: 999,
        }}
      />
    </View>
  );
}
