import React from "react";
import { StyleSheet, Text, View } from "react-native";

const formatItemList = (items: string[]): string => {
  let formattedString = "Items to bring:\n";
  for (const item of items) {
    formattedString += `- ${item}\n`;
  }
  return formattedString;
};

const EventBody = ({ data }: { data: EventData }) => {
  return (
    <View style={styles.container}>
      {data.location ? (
        <Text style={styles.location_text}>@{data.location}</Text>
      ) : null}
      {data.description && data.description != "" ? (
        <Text style={styles.smaller_text}>{data.description}</Text>
      ) : null}
      {data.items.length != 0 ? (
        <Text style={styles.smaller_text}>{formatItemList(data.items)}</Text>
      ) : null}
      {data.remarks ? (
        <>
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: "#7D7D7D",
              marginVertical: 5,
            }}
          />
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.note_text}>{data.remarks}</Text>
          </View>
        </>
      ) : null}
      <View style={{ alignItems: "flex-end" }}>
        {data.cost.amount != 0 ? (
          <Text style={styles.cost_text}>
            {data.cost.currency} {data.cost.amount.toFixed(2)}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  location_text: { fontFamily: "Arimo-Regular", fontSize: 14, marginBottom: 5 },
  smaller_text: { fontFamily: "Arimo-Regular", fontSize: 12, marginTop: 5 },
  note_text: { fontFamily: "Arimo-Italic", fontSize: 12 },
  cost_text: { fontFamily: "Arimo-Bold", fontSize: 12 },
});

export default EventBody;
