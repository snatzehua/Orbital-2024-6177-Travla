import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

const DateTimeDisplay = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(interval); // Clean up on component unmount
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {date.toLocaleDateString()} - {date.toLocaleTimeString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center" },
  text: { fontFamily: "Arimo-Bold", color: "white" },
});

export default DateTimeDisplay;
