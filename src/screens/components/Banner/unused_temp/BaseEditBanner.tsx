import React, { useState } from "react";
import { Alert, View, Text, StyleSheet } from "react-native";
import { EventData, TripData } from "..";
import BackButton from "../../BackButton/BackButton";
import ErrorDisplay from "../../ErrorDisplay/ErrorDisplay";
import {
  formatDate,
  addNewDaysInRange,
  deleteDaysOutsideRange,
} from "../../../shared/DateTimeContext";

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
  console.log("New");
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

  const checkForIssues = () => {
    if (editedData.datatype === "Trip") {
      if (editedData.start < startDate || editedData.end > endDate) {
        Alert.alert(
          "Change Trip Dates?",
          "Are you sure you want to do this? This may delete some of your events.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Change",
              onPress: () => {
                const updatedDays = deleteDaysOutsideRange(
                  editedData.days,
                  startDate,
                  endDate
                );
                console.log(updatedDays);
                handleInputChange("days", updatedDays);
                handleSave();
              },
              style: "destructive", // Indicate a destructive action
            },
          ]
        );
      } else if (editedData.start > startDate || editedData.end < endDate) {
        const updatedDays = addNewDaysInRange(
          editedData.days,
          startDate,
          endDate
        );
        console.log(updatedDays);
        handleInputChange("days", updatedDays);
        handleSave();
      } else {
        handleSave();
      }
    } else {
      handleSave();
    }
  };

  const handleSave = () => {
    // Error handling
    if (editedData.title === "") {
      setError("Please enter a title");
      return;
    }
    if (startDate.getTime > endDate.getTime) {
      setError("End cannot be before start");
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
    } else {
      setEditedData({ ...editedData, [key]: value });
    }
  };

  return (
    <>
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
        {editedData.datatype == "Event" ? (
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
              From Trip:{" "}
            </Text>
            <Text style={{ fontFamily: "Arimo-Regular", color: "white" }}>
              {editedData.trip} - {"("}
              {formatDate(editedData.start, editedData.end)}
              {")"}
            </Text>
          </View>
        ) : null}
      </View>
    </>
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
  items_text: { color: "black", fontSize: 14 },
  button_container: { position: "absolute" },
  // ... Add styles for other elements (e.g., error messages) as needed
});

export default EditBanner;
