import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Tag from "../EventFiles/Tag";
import CommonStyles from "../../../shared/CommonStyles";

type BaseBannerProps = {
  title: string;
  bannerBody: React.ReactNode; // To render either EventBody or TripBody
  onPress: () => void;
  onLongPress: () => void;
  bannerDateTime: string;
  tag?: string;
};

const BaseBanner: React.FC<BaseBannerProps> = ({
  title,
  bannerBody,
  onPress,
  onLongPress,
  bannerDateTime,
  tag,
}) => {
  return (
    <TouchableOpacity
      style={
        tag && tag == "Essentials"
          ? { ...styles.container, backgroundColor: "#FFE5CC" }
          : styles.container
      }
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={350}
    >
      <Text style={styles.title}>{title}</Text>
      <View style={{ alignItems: "flex-end" }}>
        <View style={{ width: "100%" }}>{bannerBody}</View>
        <View
          style={{
            width: "100%",
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "flex-end",
          }}
        >
          {tag ? <Tag tag={tag} /> : null}
          <Text style={styles.bottom_right}>{bannerDateTime}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    ...CommonStyles.perfect_shadows,
    width: "100%",
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 5,
  },
  title: {
    fontFamily: "Arimo-Bold",
    fontSize: 18,
    marginBottom: 1,
  },
  bottom_right: {
    fontFamily: "Arimo-Regular",
    fontSize: 12,
  },
});

export default BaseBanner;
