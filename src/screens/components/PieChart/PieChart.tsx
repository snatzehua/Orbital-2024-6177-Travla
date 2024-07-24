import React from "react";
import { StyleSheet } from "react-native";
import Svg, { G, Circle, Text } from "react-native-svg";
import { useUserData } from "../../shared/contexts/UserDataContext";

interface PieChartProps {
  data: { label: string; value: number; color: string }[];
  dimensions: { width: number; height: number };
}

const PieChart: React.FC<PieChartProps> = ({ data, dimensions }) => {
  const { userData } = useUserData();
  const radius = 70;
  const circleCircumference = 2 * Math.PI * radius;
  const total = data.reduce((total, item) => total + item.value, 0);
  console.log(total);

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
        <Text
          x="50%"
          y="50%"
          fontSize={20}
          textAnchor="middle"
          alignmentBaseline="central"
          fill="black"
        >
          {userData.settings.domesticCurrency + " " + total.toFixed(2)}
        </Text>
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
