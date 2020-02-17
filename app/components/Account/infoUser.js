import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Avatar } from "react-native-elements";
import { useState, useEffect } from "react";
import * as firebase from "firebase";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { YellowBox } from "react-native";

YellowBox.ignoreWarnings(["Setting a timer"]);

export default function infoUser(props) {
  const {
    userInfo: { uid, displayName, email, photoURL },
    setReloadData,
    toastRef,
    setIsLoading,
    setTextLoading
  } = props;

  const changeAvatar = async () => {
    const resultPermission = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );

    const resultPermissionCamera =
      resultPermission.permissions.cameraRoll.status;
    //console.log(resultPermission);

    if (resultPermissionCamera === "denied") {
      console.log("Es necesario aceptar los permisos de la galería");
      toastRef.current.show("Es necesario aceptar los permisos de la galería");
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3]
      });

      if (result.cancelled) {
        console.log("Has cerrado la galería de imágenes");
        toastRef.current.show("Has cerrado la galería de imágenes");
      } else {
        uploadImage(result.uri, uid).then(() => {
          console.log("Imagen subida correctamente");
          toastRef.current.show("Imagen subida correctamente");
          updatePhotoUrl(uid);
        });
      }
    }
  };

  const uploadImage = async (uri, nameImage) => {
    setTextLoading("Actualizando Avatar");
    setIsLoading(true);
    const response = await fetch(uri);
    const blob = await response.blob();

    console.log(JSON.stringify(response));

    const ref = firebase
      .storage()
      .ref()
      .child(`avatar/${nameImage}`);

    return ref.put(blob);
  };

  const updatePhotoUrl = uid => {
    firebase
      .storage()
      .ref(`avatar/${uid}`)
      .getDownloadURL()
      .then(async result => {
        const update = {
          photoURL: result
        };
        await firebase.auth().currentUser.updateProfile(update);
        setReloadData(true);
        setIsLoading(false);
      })
      .catch(() => {
        console.log("Error al recuperar el avatar");
        toastRef.current.show("Error al recuperar el avatar");
      });
  };
  return (
    <View style={styles.viewUserInfo}>
      <Avatar
        rounded
        size="large"
        showEditButton
        onEditPress={changeAvatar}
        containerStyle={styles.userAvatar}
        source={{
          uri: photoURL
            ? photoURL
            : "https://api.adorable.io/avatars/285/abott@adorable.png"
        }}
      />
      <View>
        <Text styles={styles.displayName}>
          {displayName ? displayName : "Anónimo"}
        </Text>
        <Text>{email ? email : "Social Login"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewUserInfo: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    padding: 30,
    paddingBottom: 30
  },
  userAvatar: {
    marginRight: 20
  },
  displayName: {
    fontWeight: "bold"
  }
});
