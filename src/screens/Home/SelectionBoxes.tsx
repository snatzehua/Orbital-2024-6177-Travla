import React from "react";
import { Text, View, TouchableOpacity } from "react-native"; // Import TouchableOpacity for interactivity

interface SelectionBoxesProps {
  title: string;
  dateValue: string; // new prop to pass full date string
  onPressFunction: React.Dispatch<React.SetStateAction<string>>;
}

const SelectionBoxes: React.FC<SelectionBoxesProps> = ({
  title,
  dateValue,
  onPressFunction,
}) => {
  const handlePress = () => {
    onPressFunction(dateValue); // Call the function to update the selected trip
  };

  return (
    <TouchableOpacity
      style={{
        backgroundColor: "white",
        width: "90%",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
      }}
      onPress={handlePress}
    >
      <View>
        <Text style={{ fontFamily: "Arimo-Bold", fontSize: 20 }}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default SelectionBoxes;
