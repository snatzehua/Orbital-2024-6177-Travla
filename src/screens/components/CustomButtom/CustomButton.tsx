import React from "react";
import {
  Animated,
  Text,
  Pressable,
  PressableProps,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import CommonStyles from "../../shared/CommonStyles";

interface CustomButtonProps extends PressableProps {
  text: string;
  onPress: () => void;
  onLongPress?: () => void;
  wrapperStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  onPress,
  onLongPress,
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
        { opacity: animatedOpacity },
        {
          ...CommonStyles.perfect_shadows,
        }, // Apply opacity animation directly
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onLongPress={onLongPress}
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
    ...CommonStyles.perfect_shadows,
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
