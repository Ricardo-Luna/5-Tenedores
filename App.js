import React from "react";
import Navigation from "./app/navigations/Navigation";
import { StyleSheet, Text, View } from "react-native";
import { firebaseApp } from "./app/Utils/Firebase";

export default function App() {
  return <Navigation />;
}
