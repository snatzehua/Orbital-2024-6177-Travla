import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

import { Currencies } from "../shared/Currencies";
import BackButton from "../components/BackButton/BackButton";
import CustomButton from "../components/CustomButtom/CustomButton";
import CustomInput from "../components/CustomInput/CustomInput";
import DateTimeDropdown from "../components/DateTimeDropdown/DateTimeDropdown";
import ErrorDisplay from "../components/ErrorDisplay/ErrorDisplay";
import SelectTrip from "./SelectTrip";
import SelectDate from "./SelectDate";
import { convertToDate } from "../shared/DateTimeContext";
import CustomMultipleInput from "../components/CustomMultipleInput.tsx/CustomMultipleInput";

interface AddEventProps {
  toggleModal: () => void; // Function that takes no arguments and returns void
  updateAsync: (
    selectedTrip: string,
    selectedDate: string,
    newEvent: EventData
  ) => Promise<void>;
}

// Add event popup form
const AddEvent = ({ toggleModal, updateAsync }: AddEventProps) => {
  // Defining hooks
  const baseStart = convertToDate(new Date());
  const baseEnd = convertToDate(new Date());

  const [backButtonHeight, setBackButtonHeight] = useState(0);
  const [error, setError] = useState("");
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newStart, setNewStart] = useState(baseStart);
  const [newEnd, setNewEnd] = useState(baseEnd);
  const [newDescription, setNewDescription] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [items, setItems] = useState<string[]>([]);
  const [newCurrency, setNewCurrency] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newRemarks, setNewRemarks] = useState("");
  const [newAdditionalInformation, setNewAdditionalInformation] = useState("");
  const [selectedTrip, setSelectedTrip] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Defining button press functions (Add Event)
  const handleAddEvent = async () => {
    // Error handling
    if (newEventTitle === "") {
      setError("Please enter a title");
      return;
    }
    if (newStart.getTime > newEnd.getTime) {
      setError("End cannot be before start");
      return;
    }
    if (Number(newAmount) == undefined || Number(newAmount) == null) {
      setError("Invalid cost amount");
      return;
    }
    if (Number(newAmount) > 0 && newCurrency == "") {
      setError("Please select a currency");
      return;
    }

    // Data trimming
    if (items.length > 0) {
      setItems(items.filter((item) => item != ""));
    }
    if ((Number(newAmount) == 0 || newAmount == "") && newCurrency != "") {
      setNewCurrency("");
    }

    const newEvent: EventData = {
      trip: selectedTrip,
      day: selectedDate,
      title: newEventTitle,
      datatype: "Event",
      start: newStart,
      end: newEnd,
      location: newLocation,
      description: newDescription,
      cost: {
        currency: newCurrency,
        amount: newAmount == "" ? 0 : Number(newAmount),
      },
      items: items.filter((item) => item.trim() !== ""),
      remarks: newRemarks,
      additional_information: newAdditionalInformation,
    };
    updateAsync(selectedTrip, selectedDate, newEvent);
    toggleModal();
  };
  const handleDateBackButton = () => {
    setSelectedTrip("");
  };

  const handleAddBackButton = () => {
    setSelectedDate("");
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
          <View>
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
              value={newEventTitle}
              setValue={setNewEventTitle}
              placeholder="Event title"
              secureTextEntry={false}
            />
            <View style={styles.line} />
            <View style={styles.time_dropdown}>
              <Text style={{ fontFamily: "Arimo-Bold", fontSize: 20 }}>
                Start :
              </Text>
              <DateTimeDropdown
                datatype={"Event"}
                date={new Date(newStart)}
                setDate={setNewStart}
              />
            </View>
            <Text style={styles.to}> - </Text>
            <View style={styles.time_dropdown}>
              <Text style={{ fontFamily: "Arimo-Bold", fontSize: 20 }}>
                End :
              </Text>
              <DateTimeDropdown
                datatype={"Event"}
                date={new Date(newEnd)}
                setDate={setNewEnd}
              />
            </View>
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
            <CustomInput
              value={newLocation}
              setValue={setNewLocation}
              placeholder="Location"
              secureTextEntry={false}
            />
            <CustomInput
              value={newDescription}
              setValue={setNewDescription}
              placeholder="Description"
              secureTextEntry={false}
              multiline={true}
              numberOfLines={5}
            />
            <View style={{ flex: 1, flexDirection: "row", width: "90%" }}>
              <Dropdown
                style={styles.dropdown}
                search
                searchPlaceholder={"Search..."}
                placeholder="Currency"
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selected_text}
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
            <CustomMultipleInput items={items} setItems={setItems} />
            <CustomInput
              value={newRemarks}
              setValue={setNewRemarks}
              placeholder="Remarks"
              secureTextEntry={false}
            />
            <CustomInput
              value={newAdditionalInformation}
              setValue={setNewAdditionalInformation}
              placeholder="Additional information"
              secureTextEntry={false}
            />
          </ScrollView>
          <CustomButton
            text="Add Event"
            onPress={handleAddEvent}
            containerStyle={styles.add_event_container}
            textStyle={styles.add_event_text}
          />
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
    backgroundColor: "#FFB000",
    width: "90%",
    borderRadius: 5,
    alignItems: "center",
    padding: 10,
    marginTop: 5,
    marginBottom: "5%",
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
  placeholderStyle: { color: "#7D7D7D", fontSize: 14, marginLeft: 15 },
  blurOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50, // Adjust this for the desired blur height
  },
  selected_text: { color: "black", fontSize: 14, marginLeft: 15 },
  items_text: { color: "black", fontSize: 14 },
});

export default AddEvent;
