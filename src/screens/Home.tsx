import React from "react";
import {
  Button,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { ScrollView } from "react-native-reanimated/lib/typescript/Animated";

const Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.title_container}>
        <Text style={styles.title_text}>Home</Text>
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: "5%",
            marginTop: 5,
          }}
        >
          <View style={{ flex: 1, height: 1, backgroundColor: "#7D7D7D" }} />
        </View>
      </View>
      <View style={{ flex: 1, backgroundColor: "gray" }}>
        <Text>test</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title_container: {
    alignItems: "center",
  },
  title_text: {
    fontFamily: "Arimo-Bold",
    fontSize: Dimensions.get("window").height * 0.05,
  },
});

export default Home;
