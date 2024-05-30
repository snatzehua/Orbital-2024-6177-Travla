import React from "react";
import {
  Animated,
  Text,
  Pressable,
  PressableProps,
  StyleSheet,
  StyleProp,
  View,
  ViewStyle,
  TextStyle,
} from "react-native";

interface CustomButtonProps extends PressableProps {
  text: string;
  onPress: () => void;
  wrapperStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  onPress,
  wrapperStyle,
  containerStyle,
  textStyle,
}) => {
  const animatedOpacity = React.useRef(new Animated.Value(1)).current; // Ref for animation

  const handlePressIn = () => {
    Animated.timing(animatedOpacity, {
      toValue: 0.8, // Adjust this value to your desired opacity
      duration: 50, // Optional: adjust duration for faster/slower effect
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(animatedOpacity, {
      toValue: 1,
      duration: 50,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        wrapperStyle ?? styles.wrapper,
        { opacity: animatedOpacity }, // Apply opacity animation directly
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={containerStyle ?? styles.container}
      >
        <Text style={textStyle ?? styles.text}>{text}</Text>
      </Pressable>
    </Animated.View>
  );
};

// Default settings if no containerStyle / textStyle
const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignItems: "center",
  },
  container: {
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
  },
  text: {
    alignItems: "center",
    fontFamily: "Arimo-Regular",
  },
});

export default CustomButton;
