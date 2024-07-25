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
import SelectTrip from "../../SelectionComponents/SelectTrip";
import SelectDate from "../../SelectionComponents/SelectDate";
import {
  convertToStartDate,
  getUTCTime,
} from "../../../shared/contexts/DateTimeContext";
import CommonStyles from "../../../shared/CommonStyles";
import { useUserData } from "../../../shared/contexts/UserDataContext";
import { Switch } from "react-native-gesture-handler";

interface AddAccomodationProps {
  toggleModal: () => void; // Function that takes no arguments and returns void
  updateAsync: (
    selectedTrip: string,
    selectedStart: number,
    selectedEnd: number,
    newAccomodation: Accommodation
  ) => Promise<void>;
  providedTrip?: string;
  providedDate?: string;
  daysArray?: string[];
}

// Add event popup form
const AddAccomodation = ({
  toggleModal,
  updateAsync,
  providedTrip,
  providedDate,
  daysArray,
}: AddAccomodationProps) => {
  // Defining hooks
  const baseStart = convertToStartDate(getUTCTime());
  const baseEnd = convertToStartDate(getUTCTime());

  const { userData } = useUserData();
  const [backButtonHeight, setBackButtonHeight] = useState(0);
  const [error, setError] = useState("");
  const [newAccommodation, setNewAccommodation] = useState("");
  const [newCurrency, setNewCurrency] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [selectedTrip, setSelectedTrip] = useState(providedTrip ?? "");
  const [selectedDate, setSelectedDate] = useState(providedDate ?? "");
  const [selectedStart, setSelectedStart] = useState(0);
  const [selectedEnd, setSelectedEnd] = useState(0);
  const [isPerNightCost, setIsPerNightCost] = useState(false);
  const days = daysArray!.map((day, index) => ({
    label: `Day ${index + 1} (${day})`,
    value: `${index}`,
  }));
  const [daysEdited, setDaysEdited] = useState(days);

  useEffect(() => {
    setDaysEdited(days.slice(selectedStart + 1));
  }, [selectedStart]);

  // Defining button press functions (Add Event)
  const handleAddAccomodation = () => {
    if (newAccommodation.trim() === "") {
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
    if (selectedEnd <= selectedStart) {
      setError("Invalid date range");
      return;
    }
    const trimmedCost = () => {
      const totalNights = selectedEnd - selectedStart;
      return Number(newAmount) == 0 || newAmount == ""
        ? { currency: "", amount: 0 }
        : {
            currency: newCurrency,
            amount: isPerNightCost
              ? Number(newAmount)
              : Number(newAmount) / totalNights,
          };
    };
    const editedData: Accommodation = {
      name: newAccommodation,
      cost: trimmedCost(),
    };
    updateAsync(selectedTrip, selectedStart, selectedEnd, editedData);
    toggleModal();
  };
  const handleDateBackButton = () => {
    if (providedTrip != undefined) {
      toggleModal();
    } else {
      setSelectedTrip("");
      setError("");
    }
  };
  const handleAddBackButton = () => {
    if (providedDate != undefined) {
      toggleModal();
    } else {
      setSelectedDate("");
      setError("");
    }
  };

  return (
    <SafeAreaView style={{ height: "85%", backgroundColor: "#EBEBEB" }}>
      {selectedTrip === "" ? (
        <>
          <View style={{ alignItems: "flex-start" }}>
            <BackButton onPress={toggleModal} iconName="window-close-o" />
          </View>
          <SelectTrip setSelectedTrip={setSelectedTrip} />
        </>
      ) : selectedDate === "" ? (
        <>
          <View style={{ alignItems: "flex-start" }}>
            <BackButton onPress={handleDateBackButton} />
          </View>
          <SelectDate
            selectedTrip={selectedTrip}
            setSelectedDate={setSelectedDate}
          />
        </>
      ) : (
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
              value={newAccommodation}
              setValue={setNewAccommodation}
              placeholder="Accommodation"
              secureTextEntry={false}
            />
            <View style={styles.line} />
            <Dropdown
              style={{
                ...CommonStyles.perfect_shadows,
                backgroundColor: "white",
                width: "90%",

                borderColor: "white",
                borderRadius: 20,

                padding: 10,
                marginVertical: 5,
              }}
              search
              searchPlaceholder={"Search..."}
              placeholder="Start"
              placeholderStyle={styles.placeholderStyle2}
              selectedTextStyle={styles.selected_text2}
              itemTextStyle={styles.items_text}
              data={days}
              onChange={(item) => setSelectedStart(Number(item.value))}
              labelField="label"
              valueField="value"
              value={selectedStart.toString()}
            />
            <Text style={styles.to}> - </Text>
            <Dropdown
              style={{
                ...CommonStyles.perfect_shadows,
                backgroundColor: "white",
                width: "90%",

                borderColor: "white",
                borderRadius: 20,

                padding: 10,
                marginVertical: 5,
              }}
              search
              searchPlaceholder={"Search..."}
              placeholder="End"
              placeholderStyle={styles.placeholderStyle2}
              selectedTextStyle={styles.selected_text2}
              itemTextStyle={styles.items_text}
              data={daysEdited}
              onChange={(item) => setSelectedEnd(Number(item.value))}
              labelField="label"
              valueField="value"
              value={selectedEnd.toString()}
            />
            <View style={styles.line} />
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
            <View
              style={{
                width: "85.5%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ marginTop: 5 }}>
                <Text style={{ fontFamily: "Arimo-Bold" }}>
                  Toggle Amount Options
                </Text>
                <Text>
                  {isPerNightCost
                    ? '(Amount stated is "per night")'
                    : '(Amount stated is "total amount")'}
                </Text>
              </View>
              <Switch
                style={{ alignSelf: "flex-end" }}
                trackColor={{ false: "#767577", true: "#FFB000" }}
                thumbColor={"#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => {
                  setIsPerNightCost(!isPerNightCost);
                }}
                value={isPerNightCost}
              />
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
              text="Add Accommodation"
              onPress={handleAddAccomodation}
              containerStyle={styles.add_event_container}
              textStyle={styles.add_event_text}
            />
          </View>
        </View>
      )}
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

export default AddAccomodation;
