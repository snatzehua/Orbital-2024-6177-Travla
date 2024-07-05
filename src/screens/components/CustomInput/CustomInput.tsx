import React from "react";
import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  TextInput,
  TextInputProps,
  KeyboardTypeOptions,
} from "react-native";

import CommonStyles from "../../shared/CommonStyles";

interface CustomInputProps extends TextInputProps {
  value: string;
  setValue: (newValue: string) => void;
  placeholder: string;
  secureTextEntry: boolean;
  multiline?: boolean; // Add a prop for multiline input
  numberOfLines?: number; // Add a prop to control the number of lines
  keyboardType?: KeyboardTypeOptions;
  containerStyle?: StyleProp<ViewStyle>;
  onSubmitEditing?: () => void;
}

const CustomInput: React.FC<CustomInputProps> = ({
  value,
  setValue,
  placeholder,
  placeholderTextColor = "#7D7D7D",
  secureTextEntry,
  multiline = false, // Default to single-line
  numberOfLines,
  keyboardType = "default",
  containerStyle,
  onSubmitEditing,
}) => {
  return (
    <View
      style={[containerStyle ?? styles.container, CommonStyles.perfect_shadows]}
    >
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        style={[
          styles.input,
          multiline && { height: numberOfLines ? numberOfLines * 20 : 80 }, // Adjust height dynamically
        ]}
        secureTextEntry={secureTextEntry}
        onSubmitEditing={onSubmitEditing}
        autoCapitalize="none"
        keyboardType={keyboardType}
        multiline={multiline} // Enable multiline if the prop is true
        numberOfLines={numberOfLines} // Allow controlling the number of visible lines
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "90%",

    borderColor: "white",
    borderRadius: 20,

    padding: 10,
    marginVertical: 5,
  },
  input: {
    fontFamily: "Arimo-Regular",
    paddingLeft: 5,
    textAlignVertical: "top",
  },
});

export default CustomInput;
