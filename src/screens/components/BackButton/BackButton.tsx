import React from "react";
import { StyleProp, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { Button } from "@rneui/base";

interface BackButtonProps {
  onPress: () => void;
  iconName?: string;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  iconName,
  containerStyle,
  textStyle,
}) => {
  return (
    <Button
      icon={{
        name: iconName ?? "arrow-left",
        type: "font-awesome", // Specify the icon type
        size: 40,
        color: "black",
      }}
      type="clear"
      containerStyle={containerStyle ?? styles.container}
      titleStyle={textStyle ?? styles.textStyle}
      onPress={onPress}
    />
  );
};

// Default settings if no containerStyle / textStyle
const styles = StyleSheet.create({
  container: {},
  textStyle: {},
});

export default BackButton;
