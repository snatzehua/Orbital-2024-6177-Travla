import React from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

import CommonStyles from "../shared/CommonStyles";
import BackButton from "../components/BackButton/BackButton";
import { useUserData } from "../shared/UserDataContext";
import { DateTimeDisplay } from "../shared/DateTimeContext";

const Settings = () => {
  // Typing for navigation
  type RootStackParamList = {
    Login: undefined;
    Profile: undefined;
  };
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Data
  const { userData } = useUserData();
  const trips = Array.from(userData.trips);
  const pastNumberOfTrips = trips.filter(
    (trip) => trip[1].end.getTime() < new Date().getTime()
  ).length;
  const totalNumberOfTrips = userData.trips.size;
  const currentNumberOfTrips = totalNumberOfTrips - pastNumberOfTrips;

  // Handle button presses
  const handleNavBack = async () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          marginLeft: "2%",
          alignItems: "flex-start",
          zIndex: 1,
        }}
      >
        <BackButton
          onPress={handleNavBack}
          containerStyle={styles.button_container}
        />
      </View>
      <View style={styles.container}>
        <View style={styles.title_container}>
          <Text style={styles.title_text}>Insights</Text>
          <View style={styles.date_time_display_container}>
            <DateTimeDisplay />
          </View>
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
        <View
          style={{
            flex: 1,
            width: "100%",
            marginTop: 5,
            alignItems: "center",
          }}
        >
          <ScrollView
            horizontal={true}
            snapToAlignment="center"
            snapToInterval={Dimensions.get("screen").width}
            decelerationRate={"fast"}
            style={{ width: "100%" }}
          >
            <View style={styles.top_view_components}>
              <Text style={styles.top_view_text}>Upcoming Trips</Text>
              <Text style={styles.top_view_number}>{currentNumberOfTrips}</Text>
            </View>
            <View style={styles.top_view_components}>
              <Text style={styles.top_view_text}>Total Trips</Text>
              <Text style={styles.top_view_number}>{totalNumberOfTrips}</Text>
            </View>
            <View style={styles.top_view_components}>
              <Text style={styles.top_view_text}>Past Trips</Text>
              <Text style={styles.top_view_number}>{pastNumberOfTrips}</Text>
            </View>
          </ScrollView>
          <View style={styles.bottom_view}>
            <Text> wow</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button_container: { marginTop: 10, position: "absolute" },
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
  date_time_display_container: {
    backgroundColor: "#1C355B",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginVertical: 5,
  },
  bottom_view: {
    height: "10%",
    marginTop: 5,
  },
  top_view_components: {
    ...CommonStyles.perfect_shadows,
    width: Dimensions.get("window").width * 0.8,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    marginHorizontal: Dimensions.get("window").width * 0.1,
    marginBottom: 10,
  },
  top_view_number: {
    color: "black",
    fontFamily: "Arimo-Bold",
    fontSize: 20,
  },
  top_view_text: {
    color: "#7D7D7D",
    fontFamily: "Arimo-Bold",
    fontSize: 12,
  },
});

export default Settings;
