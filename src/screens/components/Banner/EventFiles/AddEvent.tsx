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
import { Tags } from "../../../shared/data/Tags";
import BackButton from "../../BackButton/BackButton";
import CustomButton from "../../CustomButtom/CustomButton";
import CustomInput from "../../CustomInput/CustomInput";
import DateTimeDropdown from "../../DateTimeDropdown/DateTimeDropdown";
import ErrorDisplay from "../../ErrorDisplay/ErrorDisplay";
import SelectTrip from "../../SelectionComponents/SelectTrip";
import SelectDate from "../../SelectionComponents/SelectDate";
import {
  convertToStartDate,
  getUTCTime,
} from "../../../shared/contexts/DateTimeContext";
import CustomMultipleInput from "../../CustomMultipleInput.tsx/CustomMultipleInput";
import { useUserData } from "../../../shared/contexts/UserDataContext";
import CommonStyles from "../../../shared/CommonStyles";
import EventInputHandling from "./EventInputHandling";

interface AddEventProps {
  toggleModal: () => void; // Function that takes no arguments and returns void
  updateAsync: (
    selectedTrip: string,
    selectedDate: string,
    newEvent: EventData
  ) => Promise<void>;
  providedTrip?: string;
  providedDate?: string;
}

// Add event popup form
const AddEvent = ({
  toggleModal,
  updateAsync,
  providedTrip,
  providedDate,
}: AddEventProps) => {
  // Defining hooks
  const baseStart = convertToStartDate(getUTCTime());
  const baseEnd = convertToStartDate(getUTCTime());

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
  const [newTag, setNewTag] = useState("");
  const [selectedTrip, setSelectedTrip] = useState(providedTrip ?? "");
  const [selectedDate, setSelectedDate] = useState(providedDate ?? "");
  const { user } = useUserData();

  // Defining button press functions (Add Event)

  useEffect(() => {
    if (newStart > newEnd) {
      setNewEnd(newStart);
    }
  }, [newStart]);

  const handleAddEvent = async () => {
    setError(
      EventInputHandling(
        newEventTitle,
        newStart,
        newEnd,
        user,
        selectedTrip,
        selectedDate,
        newLocation,
        newDescription,
        newCurrency,
        newAmount,
        items,
        newRemarks,
        newTag,
        (editedData) => {
          updateAsync(selectedTrip, selectedDate, editedData);
          toggleModal();
        }
      )
    );
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
                date={newStart}
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
                date={newEnd}
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
              placeholder="Tag"
              placeholderStyle={styles.placeholderStyle2}
              selectedTextStyle={styles.selected_text2}
              itemTextStyle={styles.items_text}
              data={Tags}
              onChange={(item) => setNewTag(item.value)}
              labelField="label"
              valueField="value"
            />
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
            <CustomMultipleInput items={items} setItems={setItems} />
            <CustomInput
              value={newRemarks}
              setValue={setNewRemarks}
              placeholder="Remarks"
              secureTextEntry={false}
            />
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
              text="Add Event"
              onPress={handleAddEvent}
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

export default AddEvent;
