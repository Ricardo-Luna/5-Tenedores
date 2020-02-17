import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Input, Button } from "react-native-elements";
import * as firebase from "firebase";
import { reauthenticate } from "../../Utils/Api";

export default function ChangeEmailForm(props) {
  const { email, setIsVisibleModal, setReloadData, toastRef } = props;
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState({});
  const [hidePassword, setHidePassword] = useState(true);
  const [pw, setpw] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const updateEmail = () => {
    setError({});
    if (!newEmail || email === newEmail) {
      setError({ email: "El email no puede ser igual o estar vacío" });
    } else {
      setIsLoading(true);
      reauthenticate(pw)
        .then(() => {
          firebase
            .auth()
            .currentUser.updateEmail(newEmail)
            .then(() => {
              setIsLoading(false), setReloadData(true);
              toastRef.current.show("Email actualizado correctamente");
              setIsVisibleModal(false);
            })
            .catch(() => {
              setError({ email: "Error al actualizar el email" });
              setIsLoading(false);
            });
        })
        .catch(() => {
          setError({ pw: "La contraseña no es correcta" });
          setIsLoading(false);
        });
    }
  };

  return (
    <View style={styles.view}>
      <Input
        placeholder="Email"
        containerStyle={styles.inputStyle}
        defaultValue={email && email}
        onChange={e => setNewEmail(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: "at",
          color: "#c2c2c2"
        }}
        errorMessage={error.email}
      />
      <Input
        placeholder="Contraseña"
        containerStyle={styles.inputStyle}
        password={true}
        secureTextEntry={hidePassword}
        onChange={e => setpw(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: hidePassword ? "eye-outline" : "eye-off-outline",
          color: "#c2c2c2",
          onPress: () => setHidePassword(!hidePassword)
        }}
        errorMessage={error.pw}
      />
      <Button
        title="Cambiar correo"
        containerStyle={styles.container}
        buttonStyle={styles.btn}
        onPress={updateEmail}
        loading={isLoading}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  view: {
    alignItems: "center",
    paddingBottom: 10,
    paddingTop: 10
  },
  inputStyle: {
    marginBottom: 10,
    marginTop: 10
  },
  container: {
    marginTop: 20,
    width: "100%"
  },
  btn: {
    backgroundColor: "#00a680"
  }
});
