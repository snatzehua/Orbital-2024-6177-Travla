import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ErrorDisplayProps {
  error: string;
  doNotOccupySpace?: boolean;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  doNotOccupySpace = false,
}) => {
  if (doNotOccupySpace && error === "") {
    return null;
  }
  return (
    <View
      style={
        error == "" ? styles.error_container_empty : styles.error_container_full
      }
    >
      <Text style={styles.error_text}>{error}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  error_container_empty: {
    minHeight: 20,
    paddingVertical: 3,
  },
  error_container_full: {
    backgroundColor: "#FFF3F3",
    borderWidth: 1,
    borderColor: "#FF1705",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  error_text: {
    color: "#FF1705",
    minHeight: 18,
  },
});

export default ErrorDisplay;
