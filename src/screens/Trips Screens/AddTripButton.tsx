import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AddTripButtonProps {
  onPressFunction: () => void; // Correct type for onPressFunction
  text: string;
}

const AddTripButton: React.FC<AddTripButtonProps> = ({
  onPressFunction,
  text,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPressFunction}>
      <View>
        <Text style={styles.text}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#FFB000",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 5,
  },
  text: {
    color: "black",
    fontFamily: "Arimo-Bold",
    marginBottom: 1,
  },
  bottom_right: {
    fontFamily: "Arimo-Regular",
    fontSize: 12,
  },
});

export default AddTripButton;
