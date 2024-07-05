import React from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import EventBanner from "../EventFiles/EventBanner";
import BackButton from "../../BackButton/BackButton";
import { useUserData } from "../../../shared/UserDataContext";

interface TripDetailsProps {
  tripData: TripData;
  isVisible: boolean;
  onClose: () => void;
}

const TripDetails: React.FC<TripDetailsProps> = ({
  tripData,
  isVisible,
  onClose,
}) => {
  const { userData } = useUserData();
  const days = Array.from(tripData.days.values());

  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: "#EBEBEB" }}>
        <SafeAreaView style={{ flex: 1 }}>
          <View
            style={{
              marginLeft: "2%",
              alignItems: "flex-start",
              zIndex: 1,
            }}
          >
            <BackButton
              onPress={onClose}
              containerStyle={styles.button_container}
            />
          </View>
          <View style={styles.container}>
            <View style={styles.title_container}>
              <Text style={styles.title}>{tripData.trip} Details</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    minHeight: 20,
                    paddingVertical: 3,
                  }}
                ></View>
              </View>
              <View
                style={{
                  width: "90%",
                  flexDirection: "row",
                  marginTop: 5,
                }}
              >
                <View
                  style={{ flex: 1, height: 1, backgroundColor: "#7D7D7D" }}
                />
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
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "center",
                  backgroundColor: "black",
                  marginVertical: 5,
                  alignSelf: "center",
                  borderColor: "black",
                  borderWidth: 8,
                }}
              >
                <Text
                  style={{ fontFamily: "Arimo-Bold", color: "white" }}
                ></Text>
                <Text
                  style={{ fontFamily: "Arimo-Regular", color: "white" }}
                ></Text>
              </View>
              <View style={{ width: "90%", backgroundColor: "pink" }}>
                <FlatList
                  data={days}
                  renderItem={({ item, index }) => (
                    <View style={{ width: Dimensions.get("window").width }}>
                      <ScrollView style={{ backgroundColor: "transparent" }}>
                        {item.map((datapack) => (
                          <EventBanner
                            key={datapack.title}
                            data={datapack}
                            displayEventDetails={
                              userData.settings.displayEventDetails
                            }
                          />
                        ))}
                      </ScrollView>
                    </View>
                  )}
                  horizontal={true}
                  style={{ width: "95%" }}
                ></FlatList>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
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
  title: {
    fontSize: 24,
    fontFamily: "Arimo-Bold",
    marginBottom: 5,
    textAlign: "center", // Center the title text
  },
});

export default TripDetails;
