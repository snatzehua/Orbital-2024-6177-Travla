import React from "react";
import { StyleSheet, Text, View } from "react-native";

const formatItemList = (items: string[]): string => {
  let formattedString = "Items to bring:\n";
  for (const item of items) {
    formattedString += `- ${item}\n`;
  }
  return formattedString;
};

const EventBody = ({ data }: any) => {
  return (
    <View style={styles.container}>
      {data.location ? (
        <Text style={styles.generic_text}>@{data.location}</Text>
      ) : null}
      {data.description ? (
        <Text style={styles.smaller_text}>{data.description}</Text>
      ) : null}
      {data.items.length != 0 ? (
        <Text style={styles.smaller_text}>{formatItemList(data.items)}</Text>
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
        {data.cost.currency != "" && data.cost.amount != 0 ? (
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
  generic_text: { fontFamily: "Arimo-Regular", fontSize: 14 },
  smaller_text: { fontFamily: "Arimo-Regular", fontSize: 12, marginTop: 10 },
});

export default EventBody;
