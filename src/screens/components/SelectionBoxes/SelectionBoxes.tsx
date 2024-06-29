import React from "react";
import { Text, View, TouchableOpacity } from "react-native"; // Import TouchableOpacity for interactivity

import { formatDate } from "../../shared/DateTimeContext";

interface SelectionBoxesProps {
  title: string;
  dateValue: string; // new prop to pass full date string
  onPressFunction: React.Dispatch<React.SetStateAction<string>>;
  startDate?: Date;
  endDate?: Date;
  index?: number;
  maxIndex?: number;
}

const SelectionBoxes: React.FC<SelectionBoxesProps> = ({
  title,
  dateValue,
  onPressFunction,
  index,
  maxIndex,
  startDate,
  endDate,
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
        <Text style={{ fontFamily: "Arimo-Regular", fontSize: 15 }}>
          {index && maxIndex ? `Day (${index}/${maxIndex}) - ${title}` : title}
        </Text>
        {startDate && endDate ? (
          <Text
            style={{
              color: "#7D7D7D",
              fontFamily: "Arimo-Regular",
              fontSize: 15,
            }}
          >
            ({formatDate(startDate, endDate)})
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default SelectionBoxes;
