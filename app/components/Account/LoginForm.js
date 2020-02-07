import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { validateEmail } from "../../Utils/Validation";
import * as firebase from "firebase";
import Loading from "../Loading";
import { withNavigation } from "react-navigation";

function LoginForm(props) {
  const { toastRef, navigation } = props;
  const [hide, setHide] = useState(true);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [visible, setVisible] = useState(false);

  const login = async () => {
    setVisible(true);
    if (!email || !pw) {
      toastRef.current.show("No te pases de hueva carnal llena los campos");
    } else {
      if (!validateEmail(email)) {
        toastRef.current.show("El email no es correcto");
      } else {
        await firebase
          .auth()
          .signInWithEmailAndPassword(email, pw)
          .then(() => {
            console.log("Login correcto");
            navigation.navigate("MyAccount");
          })
          .catch(() => {
            toastRef.current.show("El email o contraseña no es correcto");
          });
      }
    }
    setVisible(false);
  };

  return (
    <View style={styles.formContainer}>
      <Input
        placeholder="Correo Electrónico"
        containerStyle={styles.inputForm}
        onChange={e => setEmail(e.nativeEvent.text)}
        rightIcon={
          <Icon
            type="material-community"
            name="at"
            iconStyle={styles.iconRight}
          />
        }
      />

      <Input
        placeholder="Contraseña"
        password={true}
        secureTextEntry={hide}
        containerStyle={styles.inputForm}
        onChange={e => setPw(e.nativeEvent.text)}
        rightIcon={
          <Icon
            type="material-community"
            name={hide ? "eye-outline" : "eye-off-outline"}
            iconStyle={styles.iconRight}
            onPress={() => setHide(!hide)}
          />
        }
      />
      <Button
        title="Iniciar Sesión"
        containerStyle={styles.btnContainerLogin}
        buttonStyle={styles.btnLogin}
        onPress={login}
      />
      <Loading isVisible={visible} text="Iniciando sesión" />
    </View>
  );
}
export default withNavigation(LoginForm);
const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30
  },
  inputForm: {
    width: "100%",
    marginTop: 20
  },
  iconRight: {
    color: "#c1c1c1"
  },
  btnContainerLogin: {
    marginTop: 30,
    width: "95%"
  },
  btnLogin: {
    backgroundColor: "#006a80"
  }
});
