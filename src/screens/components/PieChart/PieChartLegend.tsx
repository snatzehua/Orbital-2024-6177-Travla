import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

interface PieChartLegendProps {
  data: { label: string; value: number; color: string }[];
}

const PieChartLegend: React.FC<PieChartLegendProps> = ({ data }) => {
  const total = data.reduce((total, item) => total + item.value, 0);
  return (
    <View
      style={{
        backgroundColor: "white",
        padding: 5,
        paddingTop: 10,
        paddingHorizontal: 15,
        flexDirection: "row",
        borderRadius: 10,
        borderWidth: 3,
        borderColor: "#7D7D7D",
      }}
    >
      <View style={styles.legendContainer}>
        {data.map((array, index) => (
          <View key={index}>
            <View style={styles.legendItem}>
              <View
                style={[styles.colorBox, { backgroundColor: array.color }]}
              />
              <Text style={styles.label}>{`${array.label}`}</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={{ alignItems: "flex-end", marginLeft: "5%" }}>
        {data.map((array, index) => (
          <View key={index}>
            <View style={styles.legendItem}>
              <Text style={[styles.label, { color: "blue" }]}>
                (
                {array.value == 0
                  ? (0).toFixed(2)
                  : ((100 * array.value) / total).toFixed(2)}
                %)
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default PieChartLegend;

const styles = StyleSheet.create({
  legendContainer: {},
  legendItem: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  colorBox: { height: 10, width: 10, marginRight: "5%" },
  label: {
    fontFamily: "Arimo-Regular",
    fontSize: Dimensions.get("window").height * 0.02,
  },
});
