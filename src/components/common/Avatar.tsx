import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface AvatarProps {
  text?: string;
  emoji?: string;
  size?: number;
  isActive?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  text,
  emoji,
  size = 40,
  isActive = false,
  style,
  textStyle,
}) => {
  // Use first letter of text if provided, otherwise use emoji or default
  const displayText = text ? text.charAt(0).toUpperCase() : emoji || '👤';

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <View
        style={[
          styles.avatar,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      >
        <Text
          style={[
            styles.text,
            {
              fontSize: size * 0.4,
            },
            textStyle,
          ]}
        >
          {displayText}
        </Text>
      </View>
      {isActive && (
        <View
          style={[
            styles.activeIndicator,
            {
              width: size * 0.25,
              height: size * 0.25,
              borderRadius: size * 0.125,
              bottom: 0,
              right: 0,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  avatar: {
    backgroundColor: '#1E3A5F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  activeIndicator: {
    position: 'absolute',
    backgroundColor: '#48BB78',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});