import React from "react";
import { StyleSheet } from "react-native";
import MapView from "react-native-maps";

export default function Maps(props) {
  const { location, name, height } = props;
  return (
    <MapView
      style={{ height: height, width: "100%" }}
      initialRegion={location}
      onPress={() => console.log("Abriendo APP map")}
    >
      <MapView.Marker
        coordinate={{
          latitude: location.latitude,
          longitude: location.longitude
        }}
      />
    </MapView>
  );
}
