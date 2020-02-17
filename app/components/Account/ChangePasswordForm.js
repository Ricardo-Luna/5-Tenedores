import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Input, Button } from "react-native-elements";
import * as firebase from "firebase";
import { reauthenticate } from "../../Utils/Api";

export default function ChangePasswordForm(props) {
  const { setIsVisibleModal, toastRef } = props;
  const [pw, setPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPwRepeat, setNewPwRepeat] = useState("");
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [hideNewPasswordRepeat, sethideNewPasswordRepeat] = useState(true);

  const updatePassword = () => {
    setError({});
    if (!pw || !newPw || !newPwRepeat) {
      let objError = {};
      !pw && (objError.pw = "No puede estar vacío");
      !newPw && (objError.pw2 = "No puede estar vacío");
      !newPwRepeat && (objError.pw3 = "No puede estar vacío");
      setError(objError);
    } else {
      if (newPw != newPwRepeat) {
        setError({
          pw3: "Las nuevas contraseñas tienen que ser iguales"
        });
      } else {
        setIsLoading(true);
        reauthenticate(pw)
          .then(() => {
            firebase
              .auth()
              .currentUser.updatePassword(newPw)
              .then(() => {
                toastRef.current.show("Contraseña Actualizada");
                setIsLoading(false);
                setIsVisibleModal(false);
              })
              .catch(() => {
                setError({ general: "Error al actualizar la contraseña" });
                setIsLoading(false);
              });
          })
          .catch(() => {
            setError({ pw: "La contraseña no es correcta" });
            setIsLoading(false);
          });
      }
    }
  };

  return (
    <View style={styles.view}>
      <Input
        placeholder="Contraseña actual"
        containerStyle={styles.input}
        password={true}
        secureTextEntry={hidePassword}
        onChange={e => setPw(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: hidePassword ? "eye-outline" : "eye-off-outline",
          color: "#c2c2c2",
          onPress: () => setHidePassword(!hidePassword)
        }}
        errorMessage={error.pw}
      />
      <Input
        placeholder="Nueva Contraseña"
        containerStyle={styles.input}
        password={true}
        secureTextEntry={hideNewPassword}
        onChange={e => setNewPw(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: hideNewPassword ? "eye-outline" : "eye-off-outline",
          color: "#c2c2c2",
          onPress: () => setHideNewPassword(!hideNewPassword)
        }}
        errorMessage={error.pw2}
      />
      <Input
        placeholder="Repetir nueva contraseña"
        containerStyle={styles.input}
        password={true}
        secureTextEntry={hideNewPasswordRepeat}
        onChange={e => setNewPwRepeat(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: hideNewPasswordRepeat ? "eye-outline" : "eye-off-outline",
          color: "#c2c2c2",
          onPress: () => sethideNewPasswordRepeat(!hideNewPasswordRepeat)
        }}
        errorMessage={error.pw3}
      />
      <Button
        title="Cambiar Contraseña"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={updatePassword}
        loading={isLoading}
      />
      <Text>{error.general}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10
  },
  input: {
    marginTop: 10
  },
  btnContainer: {
    marginTop: 20,
    width: "95%"
  },
  btn: {
    backgroundColor: "#00a680"
  }
});
