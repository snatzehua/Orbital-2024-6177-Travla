import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import CommonStyles from "../shared/CommonStyles";

interface InsightComponentProps {
  baseColor: string;
  highlightColor: string;
  shadowColor: string;
  title: string;
  text: string;
  subtext: string;
  onPress: () => {};
}

const InsightComponent: React.FC<InsightComponentProps> = ({
  baseColor,
  highlightColor,
  shadowColor,
  title,
  text,
  subtext,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.top_view_components,
        {
          backgroundColor: baseColor,
          borderTopWidth: 6,
          borderTopColor: highlightColor,
          borderRightWidth: 6,
          borderRightColor: highlightColor,
          borderLeftWidth: 6,
          borderLeftColor: shadowColor,
          borderBottomWidth: 6,
          borderBottomColor: shadowColor,
        },
      ]}
    >
      <View style={[styles.top_view_component_title_view]}>
        <View
          style={{
            alignItems: "flex-start",
          }}
        >
          <Text style={styles.top_view_component_title_text}>{title}</Text>
          <View
            style={{
              width: "100%",
              height: 6,
              borderRadius: 3,
              backgroundColor: shadowColor,
              marginBottom: 5,
            }}
          />
        </View>
        <View
          style={{
            alignSelf: "flex-start",
          }}
        >
          <Text style={styles.top_view_component_text}>{text}</Text>
          <Text style={styles.top_view_component_subtext}>{subtext}</Text>
          <Text style={styles.top_view_component_details}>
            (Tap for Details)
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  top_view_components: {
    ...CommonStyles.perfect_shadows,
    alignItems: "center",
    width: Dimensions.get("window").width * 0.6,
    borderRadius: 10,
    marginHorizontal: Dimensions.get("window").width * 0.05,
    maxHeight: Dimensions.get("window").height * 0.25,
  },
  top_view_component_title_text: {
    color: "#FFF8DC",
    fontFamily: "Arimo-Bold",
    fontSize: 36,
    marginTop: 10,
  },
  top_view_component_text: {
    color: "black",
    fontFamily: "Arimo-Bold",
    fontSize: 16,
  },
  top_view_component_subtext: {
    color: "black",
    fontFamily: "Arimo-Regular",
    fontSize: 14,
    marginBottom: 10,
  },
  top_view_component_title_view: {},
  top_view_component_details: {
    fontFamily: "Arimo-Bold",
    color: "white",
    fontSize: 12,
    marginBottom: 10,
  },
});

export default InsightComponent;
