import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@rneui/base";

interface CustomMultipleInputProps {
  items: string[];
  setItems: React.Dispatch<React.SetStateAction<string[]>>;
}

const CustomMultipleInput: React.FC<CustomMultipleInputProps> = ({
  items,
  setItems,
}) => {
  const handleAddItem = () => {
    setItems([...items, ""]); // Add a new empty input field
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index)); // Remove the item at the specified index
  };

  const handleItemChange = (index: number, text: string) => {
    const newItems = [...items];
    newItems[index] = text;
    setItems(newItems);
  };

  return (
    <View style={{ width: "100%", alignItems: "center" }}>
      {items.map((item, index) => (
        <View
          key={index}
          style={{
            flex: 1,
            width: "90%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <View style={styles.container}>
            <TextInput
              placeholder={`Item ${index + 1}...`}
              placeholderTextColor={"#7D7D7D"}
              style={styles.input}
              value={item}
              onChangeText={(text) => handleItemChange(index, text)}
            />
          </View>
          <Button
            icon={<FontAwesomeIcon icon={faXmark} size={14} color="white" />}
            containerStyle={{ borderRadius: 10 }}
            buttonStyle={{ backgroundColor: "#333333" }}
            onPress={() => handleRemoveItem(index)}
          />
        </View>
      ))}
      <Button
        icon={<FontAwesomeIcon icon={faPlus} size={14} color="white" />}
        containerStyle={{
          alignItems: "center",
          marginVertical: 5,
          borderRadius: 10,
        }}
        buttonStyle={{
          backgroundColor: "#1C355B",
        }}
        title="Add Item"
        onPress={handleAddItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",

    borderColor: "white",
    borderRadius: 20,

    padding: 10,
    marginVertical: 5,
    marginRight: 15,
  },
  input: {
    fontFamily: "Arimo-Regular",
    paddingLeft: 5,
  },
});

export default CustomMultipleInput;
