import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface TagProps {
  tag: string;
}

const Tag: React.FC<TagProps> = ({ tag }) => {
  const getStyle = () => {
    if (tag == "Activity") {
      return {
        backgroundColor: "#fff2cc",
        borderColor: "#fff2cc",
      };
    }
    if (tag == "Food / Drink") {
      return {
        backgroundColor: "#c9daf8",
        borderColor: "#c9daf8",
      };
    }
    if (tag == "Transport") {
      return {
        backgroundColor: "#d9d9d9",
        borderColor: "#d9d9d9",
      };
    }
    if (tag == "Essentials") {
      return {
        backgroundColor: "#f4cccc",
        borderColor: "#f4cccc",
      };
    }
  };
  return (
    <View
      style={[
        {
          paddingHorizontal: 7,
          borderRadius: 10,
          borderWidth: 3,
        },
        getStyle(),
      ]}
    >
      <Text style={styles.text}>{tag}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "Arimo-Bold",
    fontSize: 12,
  },
});

export default Tag;
