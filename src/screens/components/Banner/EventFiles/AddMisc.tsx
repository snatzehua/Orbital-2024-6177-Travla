import React, { useState, useEffect } from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

import { Currencies } from "../../../shared/data/Currencies";
import BackButton from "../../BackButton/BackButton";
import CustomButton from "../../CustomButtom/CustomButton";
import CustomInput from "../../CustomInput/CustomInput";
import ErrorDisplay from "../../ErrorDisplay/ErrorDisplay";
import {
  convertToStartDate,
  getUTCTime,
} from "../../../shared/contexts/DateTimeContext";
import CommonStyles from "../../../shared/CommonStyles";
import { useUserData } from "../../../shared/contexts/UserDataContext";
import { Switch } from "react-native-gesture-handler";

interface AddMiscProps {
  toggleModal: () => void; // Function that takes no arguments and returns void
  updateAsync: (newMisc: Miscellaneous) => Promise<void>;
  providedTrip?: string;
  daysArray?: string[];
}

// Add event popup form
const AddMisc = ({
  toggleModal,
  updateAsync,
  providedTrip,
  daysArray,
}: AddMiscProps) => {
  // Defining hooks
  const [backButtonHeight, setBackButtonHeight] = useState(0);
  const [error, setError] = useState("");
  const [newMisc, setNewMisc] = useState("");
  const [newCurrency, setNewCurrency] = useState("");
  const [newAmount, setNewAmount] = useState("");

  // Defining button press functions (Add Event)
  const handleAddMisc = () => {
    if (newMisc.trim() === "") {
      setError("Please enter a title");
      return;
    }
    if (
      Number(newAmount) == undefined ||
      Number(newAmount) == null ||
      Number(newAmount) < 0
    ) {
      setError("Invalid cost amount");
      return;
    }
    if (Number(newAmount) > 0 && newCurrency == "") {
      setError("Please select a currency");
      return;
    }
    const trimmedCost = () => {
      return Number(newAmount) == 0 || newAmount == ""
        ? { currency: "", amount: 0 }
        : {
            currency: newCurrency,
            amount: newAmount == "" ? 0 : Number(newAmount),
          };
    };
    const editedData: Miscellaneous = {
      item: newMisc,
      cost: trimmedCost(),
    };
    updateAsync(editedData);
    toggleModal();
  };
  const handleAddBackButton = () => {
    toggleModal();
  };

  return (
    <SafeAreaView style={{ height: "85%", backgroundColor: "#EBEBEB" }}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: "#DCDCDC",
            borderBottomWidth: 2,
            borderBottomColor: "#D3D3D3",
          }}
        >
          <View
            style={{
              justifyContent: "center",
              flexDirection: "row",
              minHeight: backButtonHeight,
            }}
          >
            <View
              style={{ position: "absolute", left: 0 }}
              onLayout={(event) => {
                setBackButtonHeight(event.nativeEvent.layout.height);
              }}
            >
              <BackButton onPress={handleAddBackButton} />
            </View>
            <View style={{ justifyContent: "center" }}>
              <ErrorDisplay error={error} />
            </View>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={{ alignItems: "center" }}
          style={{
            flex: 1,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              margin: "5%",
            }}
          >
            <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />
            <View>
              <Text
                style={{
                  color: "black",
                  textAlign: "center",
                  fontFamily: "Arimo-Bold",
                  marginHorizontal: "2.5%",
                }}
              >
                Compulsory
              </Text>
            </View>
            <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />
          </View>
          <CustomInput
            value={newMisc}
            setValue={setNewMisc}
            placeholder="Miscellaneous"
            secureTextEntry={false}
          />
          <View style={{ paddingVertical: 10 }} />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              margin: "5%",
            }}
          >
            <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />
            <View>
              <Text
                style={{
                  color: "black",
                  textAlign: "center",
                  fontFamily: "Arimo-Bold",
                  marginHorizontal: "2.5%",
                }}
              >
                Optional
              </Text>
            </View>
            <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />
          </View>
          <View style={{ flex: 1, flexDirection: "row", width: "90%" }}>
            <Dropdown
              style={styles.dropdown}
              search
              searchPlaceholder={"Search..."}
              placeholder="Currency"
              placeholderStyle={styles.placeholderStyle1}
              selectedTextStyle={styles.selected_text1}
              itemTextStyle={styles.items_text}
              data={Currencies}
              onChange={(item) => setNewCurrency(item.value)}
              labelField="label"
              valueField="value"
            />
            <View
              style={{
                flex: 1,
                alignItems: "flex-end",
              }}
            >
              <CustomInput
                value={newAmount}
                setValue={setNewAmount}
                placeholder="Amount"
                secureTextEntry={false}
                keyboardType="numeric"
                containerStyle={styles.custom_input}
              />
            </View>
          </View>
          <View style={{ height: Dimensions.get("window").height * 0.15 }} />
        </ScrollView>
        <View
          style={{
            backgroundColor: "#DCDCDC",
            borderTopWidth: 2,
            borderTopColor: "#D3D3D3",
          }}
        >
          <CustomButton
            text="Add Miscellaneous"
            onPress={handleAddMisc}
            containerStyle={styles.add_event_container}
            textStyle={styles.add_event_text}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  line: {
    width: "80%",
    height: 1,
    backgroundColor: "#7D7D7D",
    marginVertical: 10,
  },
  time_dropdown: {
    flexDirection: "row",
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
  },
  to: { marginVertical: 5 },
  add_event_container: {
    ...CommonStyles.perfect_shadows,
    backgroundColor: "#FFB000",
    width: "90%",
    borderRadius: 5,
    alignItems: "center",
    padding: 10,
    marginTop: "5%",
    marginBottom: "5%",
    borderBottomWidth: 1,
    borderBottomColor: "darkorange",
  },
  add_event_text: {
    fontFamily: "Arimo-Bold",
  },
  dropdown: {
    width: "40%",
    backgroundColor: "white",
    borderRadius: 20,
    marginVertical: 5,
  },
  custom_input: {
    width: "96%",
    backgroundColor: "white",
    borderColor: "white",
    borderRadius: 20,
    padding: 10,
    marginVertical: 5,
  },
  placeholderStyle1: { color: "#7D7D7D", fontSize: 14, marginLeft: 15 },
  placeholderStyle2: { color: "#7D7D7D", fontSize: 14, marginLeft: 5 },
  selected_text1: { color: "black", fontSize: 14, marginLeft: 15 },
  selected_text2: { color: "black", fontSize: 14, marginLeft: 5 },
  items_text: { color: "black", fontSize: 14 },
});

export default AddMisc;
