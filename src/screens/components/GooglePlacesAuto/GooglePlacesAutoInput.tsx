import React, { memo } from "react";
import { StyleSheet } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

interface GooglePlacesInputProps {
  setSelectedLocation: React.Dispatch<React.SetStateAction<string>>;
  setGeometry: React.Dispatch<
    React.SetStateAction<{
      lat: number;
      lng: number;
    }>
  >;
  placeholder?: string;
}

const GooglePlacesInput = memo((props: GooglePlacesInputProps) => {
  console.log("Invoked Auto!");

  return (
    <GooglePlacesAutocomplete
      fetchDetails={true}
      minLength={5}
      debounce={500}
      placeholder={props.placeholder ?? "Search"}
      onPress={(data, details = null) => {
        const placeName = data.structured_formatting.main_text;
        props.setSelectedLocation(placeName);
        details?.geometry.location
          ? props.setGeometry(details.geometry.location)
          : null;
        console.log(details?.geometry.location);
        console.log(data);
      }}
      query={{
        key: "AIzaSyDi7Dbjik4Dm9hKM0nvUU_uY-piIsguxu0",
        language: "en",
        predictions: 5,
      }}
      disableScroll={true}
      textInputProps={
        props.placeholder
          ? {
              placeholderTextColor: "black",
            }
          : undefined
      }
    />
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "90%",
    borderColor: "white",
    borderRadius: 20,
    padding: 10,
    marginVertical: 5,
  },
  input: {
    fontFamily: "Arimo-Regular",
    paddingLeft: 5,
    textAlignVertical: "top",
  },
});

export default GooglePlacesInput;
