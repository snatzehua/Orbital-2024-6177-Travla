import React, { useState, useEffect } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Modal,
  StyleSheet,
} from "react-native";
import { EventData, TripData } from "..";
import { Dropdown } from "react-native-element-dropdown";

import { Currencies } from "../../../shared/data/Currencies";
import BackButton from "../../BackButton/BackButton";
import CustomInput from "../../CustomInput/CustomInput";
import CustomMultipleInput from "../../CustomMultipleInput.tsx/CustomMultipleInput";
import DateTimeDropdown from "../../DateTimeDropdown/DateTimeDropdown";
import ErrorDisplay from "../../ErrorDisplay/ErrorDisplay";
import CustomButton from "../../CustomButtom/CustomButton";
import {
  formatDate,
  updateAccomsDates,
  updateTripDates,
} from "../../../shared/contexts/DateTimeContext";
import CommonStyles from "../../../shared/CommonStyles";
import { Tags } from "../../../shared/data/Tags";

interface EditBannerProps {
  bannerData: BannerData;
  isVisible: boolean;
  onClose: () => void;
  onUpdate: (oldTitle: string, updatedData: BannerData) => void;
  onDelete: () => void;
}

const EditBanner: React.FC<EditBannerProps> = ({
  bannerData,
  isVisible,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const [editedData, setEditedData] = useState<TripData | EventData>(
    bannerData
  );
  const [error, setError] = useState("");
  const [newAmount, setNewAmount] = useState<string>(
    editedData?.cost?.amount.toString() ?? ""
  );
  const [items, setItems] = useState<string[]>(editedData?.items ?? []);
  const [startDate, setStartDate] = useState<Date>(editedData.start);
  const [endDate, setEndDate] = useState<Date>(editedData.end);

  useEffect(() => {
    if (startDate > endDate) {
      setEndDate(startDate);
    }
  }, [startDate]);

  const handleSave = () => {
    // Error handling
    if (editedData.title === "") {
      setError("Please enter a title");
      return;
    }

    // Event
    if (editedData.datatype === "Event") {
      if (Number(newAmount) == undefined || Number(newAmount) == null) {
        setError("Invalid cost amount");
        return;
      }
      if (Number(newAmount) > 0 && editedData.cost.currency == "") {
        setError("Please select a currency");
        return;
      }

      // Data trimming
      if (
        (Number(newAmount) == 0 || newAmount == "") &&
        editedData.cost.currency != ""
      ) {
        handleInputChange("currency", "");
      }
      onUpdate(bannerData.title, {
        ...editedData,
        cost: { ...editedData.cost, amount: Number(newAmount) },
        items: items.filter((item) => item.trim() !== ""),
        start: startDate,
        end: endDate,
      });

      // Trip
    } else if (editedData.datatype === "Trip") {
      if (editedData.start != startDate || editedData.end != endDate) {
        console.log("Procced!");
        updateTripDates(editedData.days, startDate, endDate);
        updateAccomsDates(editedData.accommodation, startDate, endDate);
      }
      onUpdate(bannerData.title, {
        ...editedData,
        start: startDate,
        end: endDate,
      });
    }
    onClose();
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            onDelete();
          },
          style: "destructive", // Indicate a destructive action
        },
      ]
    );
  };

  const handleCancel = () => {
    onClose();
  };

  const handleInputChange = (key: keyof typeof editedData, value: any) => {
    if (key === "currency") {
      const updatedCost = { ...editedData.cost, currency: value.value };
      setEditedData({ ...editedData, cost: updatedCost });
    } else if (key === "amount") {
      const updatedCost = { ...editedData.cost, amount: Number(value) };
      setEditedData({ ...editedData, cost: updatedCost });
    } else if (key === "tag") {
      setEditedData({ ...editedData, tag: value.value });
    } else {
      setEditedData({ ...editedData, [key]: value });
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#EBEBEB" }}>
        <View
          style={{
            marginLeft: "2%",
            alignItems: "flex-start",
            zIndex: 1,
          }}
        >
          <BackButton
            onPress={handleCancel}
            containerStyle={styles.button_container}
          />
        </View>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Edit {editedData.datatype}</Text>
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <ErrorDisplay error={error} />
            </View>
          </View>
          <View
            style={{
              width: "90%",
              height: 1,
              backgroundColor: "#7D7D7D",
              alignSelf: "center",
            }}
          />
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
            <Text style={{ fontFamily: "Arimo-Bold", color: "white" }}>
              {"Current Trip: "}
            </Text>
            <Text style={{ fontFamily: "Arimo-Regular", color: "white" }}>
              {editedData.trip} {"("}
              {formatDate(editedData.start, editedData.end)}
              {")"}
            </Text>
          </View>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
            style={{ flex: 1, backgroundColor: "#D6E1EE" }}
          >
            <View
              style={{
                width: "90%",
                alignItems: "flex-start",
                marginTop: 10,
              }}
            >
              <Text style={styles.input_titles}>Title</Text>
            </View>
            <CustomInput
              value={editedData.title}
              setValue={(value) => handleInputChange("title", value)}
              placeholder="..."
              secureTextEntry={false}
            />
            <View style={styles.datetimeContainer}>
              <View style={styles.datetimeLabelContainer}>
                <Text style={styles.input_titles}>
                  {editedData.datatype === "Event" ? "Time:" : "Dates:"}
                </Text>
              </View>
              <DateTimeDropdown
                datatype={editedData.datatype}
                date={startDate} // Use startDate state
                setDate={setStartDate} // Use setStartDate updater
              />
              <DateTimeDropdown
                datatype={editedData.datatype}
                date={endDate} // Use endDate state
                setDate={setEndDate} // Use setEndDate updater
                minimumDate={startDate} // End date should not be before start date
              />
            </View>
            <View
              style={{
                width: "90%",
                height: 1,
                backgroundColor: "#7D7D7D",
                alignSelf: "center",
              }}
            />
            {editedData.datatype === "Trip" ? <View /> : null}
            {editedData.datatype === "Event" ? (
              <>
                <View
                  style={{
                    width: "90%",
                    alignItems: "flex-start",
                    marginTop: 10,
                  }}
                >
                  <Text style={styles.input_titles}>Location</Text>
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
                  value={(editedData as EventData).tag} // Correct key for value
                  onChange={(item) => handleInputChange("tag", item)}
                  labelField="label"
                  valueField="value"
                />
                <CustomInput
                  value={(editedData as EventData).location}
                  setValue={(value) => handleInputChange("location", value)}
                  placeholder="..."
                  secureTextEntry={false}
                />
                <View
                  style={{
                    width: "90%",
                    alignItems: "flex-start",
                    marginTop: 10,
                  }}
                >
                  <Text style={styles.input_titles}>Description</Text>
                </View>
                <CustomInput
                  value={(editedData as EventData).description}
                  setValue={(value) => handleInputChange("description", value)}
                  placeholder="..."
                  secureTextEntry={false}
                  multiline={true}
                  numberOfLines={5}
                />

                <View
                  style={{
                    width: "90%",
                    alignItems: "flex-start",
                    marginTop: 10,
                  }}
                >
                  <Text style={styles.input_titles}>Cost</Text>
                </View>
                <View style={{ flexDirection: "row", width: "90%" }}>
                  <Dropdown
                    style={styles.dropdown}
                    search
                    searchPlaceholder={"Search..."}
                    placeholder="Currency"
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selected_text}
                    itemTextStyle={styles.items_text}
                    data={Currencies}
                    value={(editedData as EventData).cost?.currency} // Correct key for value
                    onChange={
                      (value) => handleInputChange("currency", value) // Correct key
                    }
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
                <View
                  style={{
                    width: "90%",
                    alignItems: "flex-start",
                    marginTop: 10,
                  }}
                >
                  <Text style={styles.input_titles}>Remarks</Text>
                </View>
                <CustomInput
                  value={(editedData as EventData).remarks}
                  setValue={(value) => handleInputChange("remarks", value)}
                  placeholder="..."
                  secureTextEntry={false}
                />
              </>
            ) : null}
          </ScrollView>
          <View style={{ marginTop: 5 }}>
            <CustomButton
              text="Save"
              onPress={handleSave}
              containerStyle={styles.save_container}
              textStyle={styles.save_text}
            />
            <CustomButton
              text="Delete"
              onPress={handleDelete}
              containerStyle={styles.delete_container}
              textStyle={styles.delete_text}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1 },
  title: {
    fontSize: 24,
    fontFamily: "Arimo-Bold",
    marginBottom: 5,
    textAlign: "center", // Center the title text
  },
  input_titles: { fontFamily: "Arimo-Bold", marginLeft: 5 },
  dropdownContainer: {
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 10,
  },
  save_container: {
    backgroundColor: "#FFB000",
    width: "90%",
    borderRadius: 5,
    alignItems: "center",
    padding: 10,
    marginTop: 5,
  },
  save_text: {
    fontFamily: "Arimo-Bold",
  },
  delete_container: {
    backgroundColor: "#E62E00",
    width: "90%",
    borderRadius: 5,
    alignItems: "center",
    padding: 10,
    marginTop: 10,
  },
  delete_text: {
    color: "white",
    fontFamily: "Arimo-Bold",
  },
  datetimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    marginVertical: 10,
  },
  datetimeLabelContainer: {
    flex: 1, // Allow the label to take remaining space
  },
  datetimeLabel: {
    fontFamily: "Arimo-Bold",
    marginLeft: 15,
    fontSize: 16,
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
  selected_text: { color: "black", fontSize: 14, marginLeft: 15 },
  placeholderStyle2: { color: "#7D7D7D", fontSize: 14, marginLeft: 5 },
  selected_text2: { color: "black", fontSize: 14, marginLeft: 5 },
  items_text: { color: "black", fontSize: 14 },
  button_container: { position: "absolute" },
  // ... Add styles for other elements (e.g., error messages) as needed
});

export default EditBanner;
