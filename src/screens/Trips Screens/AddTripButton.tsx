import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AddTripButtonProps {
  toggleModal: () => void; // Correct type for toggleModal
  text: string;
}

const AddTripButton: React.FC<AddTripButtonProps> = ({ toggleModal, text }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={toggleModal}>
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
