import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { validateEmail } from "../../Utils/Validation";
import Loading from "../../components/Loading";
import { withNavigation } from "react-navigation";
import * as firebase from "firebase";

function RegisterForm(props) {
  const { toastRef, navigation } = props;
  const [hide, setHide] = useState(true);
  const [hide2, setHide2] = useState(true);
  const [loading, setloading] = useState(false);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [repeat, setRepeat] = useState("");

  const register = async () => {
    setloading(true);
    const resultEmailValidation = validateEmail(email);
    if (!email || !pw || !repeat) {
      toastRef.current.show("Los Campos son obligatorios");
    } else {
      if (!resultEmailValidation) {
        toastRef.current.show("El email no es correcto");
      } else {
        if (pw !== repeat) {
          toastRef.current.show("Las contraseñas no son iguales");
        } else {
          await firebase
            .auth()
            .createUserWithEmailAndPassword(email, pw)
            .then(() => {
              toastRef.current.show("Usuario creado correctamente");
              navigation.navigate("MyAccount");
            })
            .catch(() => {
              toastRef.current.show("No eres tú somos nosotros");
            });
        }
      }
    }
    setloading(false);
  };
  return (
    <View style={styles.formContainer} behavior="padding" enabled>
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
      <Input
        placeholder="Repetir contraseña"
        password={true}
        secureTextEntry={hide2}
        containerStyle={styles.inputForm}
        onChange={e => setRepeat(e.nativeEvent.text)}
        rightIcon={
          <Icon
            type="material-community"
            name={hide2 ? "eye-outline" : "eye-off-outline"}
            iconStyle={styles.iconRight}
            onPress={() => setHide2(!hide2)}
          />
        }
      />
      <Button
        title="Unirse"
        containerStyle={styles.btnContainerStyles}
        buttonStyle={styles.btnRegister}
        onPress={register}
      />
      <Loading text="Creando cuenta" isVisible={loading} />
    </View>
  );
}

export default withNavigation(RegisterForm);

const styles = StyleSheet.create({
  formContainer: {
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
  btnContainerStyles: {
    marginTop: 20,
    width: "95%"
  },
  btnRegister: {
    backgroundColor: "#00a680"
  }
});
