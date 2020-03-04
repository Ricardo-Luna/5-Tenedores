import React from "react";
import Navigation from "./app/navigations/Navigation";
import { StyleSheet, Text, View } from "react-native";
import { firebaseApp } from "./app/Utils/Firebase";
import { YellowBox } from "react-native";
YellowBox.ignoreWarnings(["componentwillreceiveprops", "Setting a timer"]);
export default function App() {
  return <Navigation />;
}
