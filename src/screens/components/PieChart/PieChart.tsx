import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Svg, { G, Circle, Defs } from "react-native-svg";

interface PieChartProps {
  data: { label: string; value: number; color: string }[];
  dimensions: { width: number; height: number };
}

const PieChart: React.FC<PieChartProps> = ({ data, dimensions }) => {
  const radius = 70;
  const circleCircumference = 2 * Math.PI * radius;
  const total = data.reduce((total, item) => total + item.value, 0);

  const length = Math.min(dimensions.width, dimensions.height);

  interface PieSliceProps {
    color: string;
    offset: number;
    rotation: number;
  }

  const PieSlice: React.FC<PieSliceProps> = ({ color, offset, rotation }) => {
    return (
      <Circle
        cx="50%"
        cy="50%"
        r={radius}
        stroke={color}
        fill="transparent"
        strokeWidth="40"
        strokeDasharray={circleCircumference}
        strokeDashoffset={offset}
        rotation={rotation}
        originX="90"
        originY="90"
        strokeLinecap="butt"
      />
    );
  };

  let currentAngle = 0;

  return (
    <>
      <Svg height={length} width={length} viewBox="0 0 180 180">
        <G rotation={-90} originX="90" originY="90">
          {data.map((array, index) => {
            const offset =
              circleCircumference - (circleCircumference * array.value) / total;
            const rotation = currentAngle;
            currentAngle += (array.value / total) * 360;
            return (
              <PieSlice
                key={index}
                color={array.color}
                offset={offset}
                rotation={rotation}
              />
            );
          })}
        </G>
      </Svg>
    </>
  );
};

export default PieChart;

const styles = StyleSheet.create({
  graphWrapper: {
    backgroundColor: "pink",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    position: "absolute",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 24,
  },
});
