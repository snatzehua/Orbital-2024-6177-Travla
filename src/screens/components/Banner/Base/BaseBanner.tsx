import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useUserData } from "../../../shared/UserDataContext";

type BaseBannerProps = {
  title: string;
  bannerBody: React.ReactNode; // To render either EventBody or TripBody
  onPress: () => void;
  onLongPress: () => void;
  bannerDateTime: string;
};

const BaseBanner: React.FC<BaseBannerProps> = ({
  title,
  bannerBody,
  onPress,
  onLongPress,
  bannerDateTime,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={350}
    >
      <Text style={styles.title}>{title}</Text>
      <View style={{ alignItems: "flex-end" }}>
        <View style={{ width: "100%" }}>{bannerBody}</View>
        <Text style={styles.bottom_right}>{bannerDateTime}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
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
