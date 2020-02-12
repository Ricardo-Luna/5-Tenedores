import React, { useState } from "react";
import { SocialIcon } from "react-native-elements";
import * as firebase from "firebase";
import * as Facebook from "expo-facebook";
import { FacebookApi } from "../../Utils/Social";
import Loading from "../../components/Loading";

export default function LoginFacebook(props) {
  const { toastRef, navigation } = props;
  const [loading, setloading] = useState(false);
  console.log(props);

  const login = async () => {
    await Facebook.initializeAsync(FacebookApi.application_id);
    const {
      type,
      token
    } = await Facebook.logInWithReadPermissionsAsync(
      FacebookApi.application_id,
      { permissions: FacebookApi.permissions }
    );

    if (type === "success") {
      setloading(true);
      const credentials = firebase.auth.FacebookAuthProvider.credential(token);
      await firebase
        .auth()
        .signInWithCredential(credentials)
        .then(() => {
          navigation.navigate("MyAccount");
          toastRef.current.show("Inicio exitoso");
        })
        .catch(Error => {
          toastRef.current.show(
            "Error accediendo a Facebook, inténtelo más tarde"
          );
          console.log("Error accediendo a Facebook, inténtelo más tarde");
        });
    } else {
      if (type === "cancel") {
        console.log("Inicio de sesión cancelado");

        toastRef.current.show("Inicio de sesión cancelado");
      } else {
        toastRef.current.show("Error desconocido, inténtelo más tarde");
        console.log("Error desconocido, inténtelo más tarde");
      }
    }
    setloading(false);
    console.log(type);
  };
  return (
    <>
      <SocialIcon
        title="Iniciar sesión con Facebook"
        button
        type="facebook"
        onPress={login}
      />
      <Loading isVisible={loading} text="Iniciando sesión" />
    </>
  );
}
