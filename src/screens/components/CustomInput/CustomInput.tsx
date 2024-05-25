import React from "react";
import { StyleSheet, View, TextInput, TextInputProps } from "react-native";

interface CustomInputProps extends TextInputProps {
  value: string;
  setValue: (newValue: string) => void;
  placeholder: string;
  secureTextEntry: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  value,
  setValue,
  placeholder,
  secureTextEntry,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        style={styles.input}
        secureTextEntry={secureTextEntry}
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
  },
});

export default CustomInput;
