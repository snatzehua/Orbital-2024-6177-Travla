import React from "react";
import {
  Text,
  Pressable,
  PressableProps,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";

interface CustomButtonProps extends PressableProps {
  text: string;
  onPress: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  onPress,
  containerStyle,
  textStyle,
}) => {
  return (
    <Pressable onPress={onPress} style={containerStyle ?? styles.container}>
      <Text style={textStyle ?? styles.text}>{text}</Text>
    </Pressable>
  );
};

// Default settings if no containerStyle / textStyle
const styles = StyleSheet.create({
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
