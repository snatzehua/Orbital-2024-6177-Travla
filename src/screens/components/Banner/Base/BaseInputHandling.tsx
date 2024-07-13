import React from "react";

const BaseInputHandling = (title: string): void => {
  if (title.trim() === "") {
    throw new Error("Please enter a title");
  }
};

export default BaseInputHandling;
