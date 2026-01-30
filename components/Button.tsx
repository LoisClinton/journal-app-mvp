import React from "react";
import { Animated, Pressable, StyleSheet, Text } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  color?: string;
  clickedColor?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  color,
  clickedColor,
}) => {
  const backgroundColorRef = new Animated.Value(0);

  const handlePress = () => {
    Animated.timing(backgroundColorRef, {
      toValue: 1,
      duration: 60,
      useNativeDriver: true,
    }).start();
  };
  const handleRelease = () => {
    Animated.timing(backgroundColorRef, {
      toValue: 0,
      duration: 60,
      useNativeDriver: true,
    }).start();
  };

  const backgroundColor = backgroundColorRef.interpolate({
    inputRange: [0, 1],
    outputRange: [color ?? "#607bd5", clickedColor ?? "#345ad6"],
  });

  return (
    <Pressable
      onPressIn={handlePress}
      onPressOut={handleRelease}
      onPress={() => onPress()}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <Animated.View style={[styles.buttonContainer, { backgroundColor }]}>
        <Text style={styles.buttonText}>{title}</Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 10,
    padding: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});

export default Button;
