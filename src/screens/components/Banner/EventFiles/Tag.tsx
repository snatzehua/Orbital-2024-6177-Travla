import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface TagProps {
  tag: string;
}

const Tag: React.FC<TagProps> = ({ tag }) => {
  const getStyle = () => {
    if (tag == "Activity") {
      return {
        backgroundColor: "#ffe599",
        borderColor: "#ffe599",
      };
    }
    if (tag == "Food / Drink") {
      return {
        backgroundColor: "#a4c2f4",
        borderColor: "#a4c2f4",
      };
    }
    if (tag == "Transport") {
      return {
        backgroundColor: "#b6d7a8",
        borderColor: "#b6d7a8",
      };
    }
    if (tag == "Essentials") {
      return {
        backgroundColor: "#ea9999",
        borderColor: "#ea9999",
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
