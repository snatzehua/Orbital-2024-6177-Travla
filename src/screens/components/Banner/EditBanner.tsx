import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { EventData, TripData } from ".";
import { Dropdown } from "react-native-element-dropdown";

import CustomInput from "../CustomInput/CustomInput";
import DateTimeDropdown from "../DateTimeDropdown/DateTimeDropdown";
import { useUserData } from "../../shared/UserDataContext";
import CustomButton from "../CustomButtom/CustomButton";

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
  const { userData } = useUserData();
  const tripNames = Array.from(userData.trips.keys());

  const handleSave = () => {
    onUpdate(bannerData.title, editedData);
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

  const handleInputChange = (key: keyof typeof editedData, value: any) => {
    setEditedData({ ...editedData, [key]: value });
  };

  const handleDateTimeChange = (key: "start" | "end", newDate: Date) => {
    setEditedData({ ...editedData, [key]: newDate });
  };

  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#EBEBEB" }}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Edit {editedData.datatype}</Text>
          <View
            style={{
              width: "90%",
              height: 1,
              backgroundColor: "#7D7D7D",
              alignSelf: "center",
            }}
          />
          <ScrollView
            contentContainerStyle={{ alignItems: "center" }}
            style={{}}
          >
            <View
              style={{
                width: "90%",
                alignItems: "flex-start",
                marginTop: 10,
              }}
            >
              <Text style={{ fontFamily: "Arimo-Bold", marginLeft: 15 }}>
                Event title
              </Text>
            </View>
            <CustomInput
              value={editedData.title}
              setValue={(value) => handleInputChange("title", value)}
              placeholder="Title"
              secureTextEntry={false}
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
                  <Text style={{ fontFamily: "Arimo-Bold", marginLeft: 15 }}>
                    Description
                  </Text>
                </View>
                <CustomInput
                  value={(editedData as EventData).description}
                  setValue={(value) => handleInputChange("description", value)}
                  placeholder="Description"
                  secureTextEntry={false}
                />
              </>
            ) : null}
          </ScrollView>
          {editedData.datatype === "Event" && (
            <>
              {/* ... your custom input fields for EventData (description, cost, etc.) */}
            </>
          )}

          {/* Trip-specific input fields */}
          {editedData.datatype === "Trip" && (
            <>{/* ... your custom input fields for TripData (days, etc.) */}</>
          )}
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
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {},
  title: {
    fontSize: 24,
    fontFamily: "Arimo-Bold",
    marginBottom: 15,
    textAlign: "center", // Center the title text
  },
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
    backgroundColor: "#FD1415",
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
  // ... Add styles for other elements (e.g., error messages) as needed
});

export default EditBanner;
