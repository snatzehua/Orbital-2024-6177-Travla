import React from "react";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

interface MenuBarProps {
  toggleModal: () => void; // Correct type for toggleModal
}

const MenuBar: React.FC<MenuBarProps> = ({ toggleModal }) => {
  // Typing for navigation
  type RootStackParamList = {
    Login: undefined;
    Settings: undefined;
    Trips: undefined;
    Map: undefined;
    Profile: undefined;
  };
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Defining button press functions
  const handleInsightsNavigation = () => {
    navigation.navigate("Settings");
  };
  const handleTripsNavigation = () => {
    navigation.navigate("Trips");
  };
  const handleMapNavigation = () => {
    navigation.navigate("Map");
  };
  const handleProfileNavigation = () => {
    navigation.navigate("Profile");
  };

  return (
    <View style={styles.menu_bar}>
      <Pressable
        onPress={handleInsightsNavigation}
        style={styles.secondary_menu_button}
      >
        <Image
          source={require("../../../assets/images/insights_tab.png")}
          style={styles.secondary_menu_icon}
        />
        <Text style={styles.secondary_menu_text}>Insights</Text>
      </Pressable>
      <Pressable
        onPress={handleTripsNavigation}
        style={styles.secondary_menu_button}
      >
        <Image
          source={require("../../../assets/images/trips_tab.png")}
          style={styles.secondary_menu_icon}
        />
        <Text style={styles.secondary_menu_text}>Trips</Text>
      </Pressable>
      <Pressable onPress={toggleModal} style={styles.primary_menu_button}>
        <Image
          source={require("../../../assets/images/plus_icon.png")}
          style={styles.secondary_menu_icon}
        />
      </Pressable>
      <Pressable
        onPress={handleMapNavigation}
        style={styles.secondary_menu_button}
      >
        <Image
          source={require("../../../assets/images/map_tab.png")}
          style={styles.secondary_menu_icon}
        />
        <Text style={styles.secondary_menu_text}>Map</Text>
      </Pressable>
      <Pressable
        onPress={handleProfileNavigation}
        style={styles.secondary_menu_button}
      >
        <Image
          source={require("../../../assets/images/profile_tab.png")}
          style={styles.secondary_menu_icon}
        />
        <Text style={styles.secondary_menu_text}>Profile</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  menu_bar: {
    backgroundColor: "white",
    width: "96%",
    flexDirection: "row",
    borderRadius: 30,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  primary_menu_button: {
    flexDirection: "column",
    backgroundColor: "#1C355B",
    width: "18%",
    height: Dimensions.get("window").width * 0.18,
    borderColor: "#2E4F82",
    borderWidth: 5,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  secondary_menu_button: {
    flexDirection: "column",
    width: "16%",
    height: Dimensions.get("window").width * 0.2,
    justifyContent: "center",
    alignItems: "center",
  },
  secondary_menu_icon: {
    resizeMode: "contain",
    width: "50%",
    height: Dimensions.get("window").width * 0.08,
  },
  secondary_menu_text: {
    color: "#7D7D7D",
    fontFamily: "Arimo-Bold",
    fontSize: 12,
    marginTop: 10,
  },
});

export default MenuBar;
