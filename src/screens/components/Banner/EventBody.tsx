import React from "react";
import { StyleSheet, Text, View } from "react-native";

const EventBody = ({ data }: any) => {
  return (
    <View style={styles.container}>
      {data.location ? (
        <Text style={styles.generic_text}>@{data.location}</Text>
      ) : null}
      {data.description ? (
        <Text style={styles.generic_text}>{data.description}</Text>
      ) : null}
      {data.remarks || data.additional_information ? (
        <>
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: "#7D7D7D",
              marginVertical: 10,
            }}
          />
          <Text style={styles.generic_text}>{data.remarks}</Text>
          <Text style={styles.generic_text}>{data.additional_information}</Text>
        </>
      ) : null}
      <View style={{ alignItems: "flex-end" }}>
        {data.cost.amount && data.cost.amount != 0 ? (
          <Text style={{ fontFamily: "Arimo-Bold" }}>
            {data.cost.currency} {data.cost.amount.toFixed(2)}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  generic_text: { fontFamily: "Arimo-Regular" },
});

export default EventBody;
