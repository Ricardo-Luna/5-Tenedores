import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Alert, Dimensions } from "react-native";
import { Icon, Avatar, Image, Input, Button } from "react-native-elements";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import Modal from "../Modal";
import uuid from "uuid/v4";
import { YellowBox } from "react-native";
import { firebaseApp } from "../../Utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

const WidthScreen = Dimensions.get("window").width;
YellowBox.ignoreWarnings(["componentwillreceiveprops has been renamed"]);

export default function AddRestaurantForm(props) {
  const { navigation, toastRef, setIsLoading } = props;
  const [imageSelected, setImageSelected] = useState([]);
  const [nombre, setNombre] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [isVisibleMap, setIsVisibleMap] = useState(false);
  const [locationRestaurant, setlocationRestaurant] = useState();

  const addRestaurant = () => {
    if (!nombre || !address || !description) {
      toastRef.current.show("Todos los campos son necesarios");
    } else if (imageSelected.length === 0) {
      toastRef.current.show("El restaurant necesita al menos una foto");
    } else if (!locationRestaurant) {
      toastRef.current.show("Tienes que localizar el restaurant en el mapa");
    } else {
      setIsLoading(true);
      UploadImageStorage(imageSelected).then(arrayImages => {
        db.collection("restaurants")
          .add({
            name: nombre,
            address: address,
            description: description,
            location: locationRestaurant,
            images: arrayImages,
            rating: 0,
            ratingTotal: 0,
            quantityVoting: 0,
            createAt: new Date(),
            createBy: firebaseApp.auth().currentUser.uid
          })
          .then(() => {
            setIsLoading(false);
            navigation.navigate("Restaurants");
          })
          .catch(error => {
            setIsLoading(false);
            toastRef.current.show("Te vas a tu casa");
            console.log(error);
          });
      });
    }
  };

  const UploadImageStorage = async imageArray => {
    const imageBlob = [];
    await Promise.all(
      imageArray.map(async image => {
        const response = await fetch(image);
        const blob = await response.blob();
        const ref = firebase
          .storage()
          .ref("restaurant-images")
          .child(uuid());
        await ref.put(blob).then(result => {});
      })
    );
    return imageBlob;
  };

  return (
    <ScrollView>
      <ImageRestaurant imageRestaurant={imageSelected[0]} />
      <FormAddRestaurant
        setNombre={setNombre}
        setAddress={setAddress}
        setDescription={setDescription}
        setIsVisibleMap={setIsVisibleMap}
        locationRestaurant={locationRestaurant}
      />
      <UploadImage
        imageSelected={imageSelected}
        setImageSelected={setImageSelected}
        toastRef={toastRef}
      />
      <Button
        title="Crear Restaurante"
        onPress={addRestaurant}
        buttonStyle={styles.btnAddRestaurant}
      />
      <Map
        isVisibleMap={isVisibleMap}
        setIsVisibleMap={setIsVisibleMap}
        setLocationRestaurant={setlocationRestaurant}
        toastRef={toastRef}
      />
    </ScrollView>
  );
}

function FormAddRestaurant(props) {
  const {
    setNombre,
    setAddress,
    setDescription,
    setIsVisibleMap,
    locationRestaurant
  } = props;
  return (
    <View style={styles.viewForm}>
      <Input
        placeholder="Nombre del restaurante"
        containerStyle={styles.input}
        onChange={e => {
          setNombre(e.nativeEvent.text);
        }}
      />
      <Input
        placeholder="Dirección del restaurante"
        containerStyle={styles.input}
        rightIcon={{
          type: "material-community",
          name: "google-maps",
          color: locationRestaurant ? "#00a680" : "#c2c2c2",
          onPress: () => setIsVisibleMap(true)
        }}
        onChange={e => {
          setAddress(e.nativeEvent.text);
        }}
      />
      <Input
        placeholder="Descripción del restaurante"
        multiline={true}
        containerStyle={styles.textArea}
        onChange={e => {
          setDescription(e.nativeEvent.text);
        }}
      />
    </View>
  );
}

function ImageRestaurant(props) {
  const { imageRestaurant } = props;
  return (
    <View style={styles.newPic}>
      {imageRestaurant ? (
        <Image
          source={{ uri: imageRestaurant }}
          style={{ width: WidthScreen, height: 200 }}
        />
      ) : (
        <Image
          source={require("../../../assets/img/no-image.png")}
          style={{ width: WidthScreen, height: 200 }}
        />
      )}
    </View>
  );
}

function UploadImage(props) {
  const { imageSelected, setImageSelected, toastRef } = props;

  const imageSelect = async () => {
    const resultPermission = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    const resultPermissionCamera =
      resultPermission.permissions.cameraRoll.status;

    if (resultPermissionCamera === "denied") {
      toastRef.current.show(
        "Es necesario aceptar los permisios de la galería",
        3000
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3]
      });
      if (result.cancelled) {
        toastRef.current.show("chinga tu madre puto perro");
      } else {
        setImageSelected([...imageSelected, result.uri]);
      }
    }
  };

  const removeImage = image => {
    const arrayImages = imageSelected;
    Alert.alert(
      "Eliminar Imagen",
      "¿Estás seguro de que quieres eliminar la imagen?",
      [
        {
          text: "cancel",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: () =>
            setImageSelected(arrayImages.filter(imageUrl => imageUrl !== image))
        }
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.viewImage}>
      {imageSelected.length < 5 && (
        <Icon
          type="material-community"
          name="camera"
          color="#7a7a7a"
          containerStyle={styles.containerIcon}
          onPress={imageSelect}
        />
      )}

      {imageSelected.map(imageRestaurant => (
        <Avatar
          key={imageRestaurant}
          onPress={() => removeImage(imageRestaurant)}
          style={styles.miniatureStyle}
          source={{ uri: imageRestaurant }}
        />
      ))}
    </View>
  );
}

function Map(props) {
  const {
    isVisibleMap,
    setIsVisibleMap,
    setLocationRestaurant,
    toastRef
  } = props;
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      const resultPermissions = await Permissions.askAsync(
        Permissions.LOCATION
      );
      const statusPermissions = resultPermissions.permissions.location.status;

      if (statusPermissions !== "granted") {
        toastRef.current.show("Permisos no aceptados aún");
      } else {
        const loc = await Location.getCurrentPositionAsync({});

        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001
        });
      }
    })();
  }, []);

  const confirmLocation = () => {
    setLocationRestaurant(location);
    toastRef.current.show("Localizació guardada correctamente");
    setIsVisibleMap(false);
  };

  return (
    <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
      <View>
        {location && (
          <MapView
            style={styles.mapStyle}
            initialRegion={location}
            showsUserLocation={true}
            onRegionChange={region => setLocation(region)}
          >
            <MapView.Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude
              }}
              draggable
            />
          </MapView>
        )}
        <View style={styles.viewMapBtn}>
          <Button
            title="Guardar mi ubicación"
            onPress={confirmLocation}
            containerStyle={styles.save}
            buttonStyle={styles.btnSave}
          />
          <Button
            title="Cancelar"
            onPress={() => {
              setIsVisibleMap(false);
            }}
            containerStyle={styles.cancel}
            buttonStyle={styles.ViewBtnCancel}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  newPic: {
    alignItems: "center",
    height: 200,
    marginBottom: 20
  },
  viewImage: {
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 30
  },
  containerIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    height: 70,
    width: 70,
    backgroundColor: "#e3e3e3"
  },
  miniatureStyle: {
    width: 70,
    height: 70,
    marginRight: 10
  },
  viewForm: {
    marginLeft: 10,
    marginRight: 10
  },
  input: {
    marginBottom: 30
  },
  textArea: {
    height: 100,
    width: "100%",
    padding: 0,
    margin: 0
  },
  button: {
    width: 70
  },
  mapStyle: {
    width: "100%",
    height: 550
  },
  viewMapBtn: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10
  },
  save: {
    paddingRight: 5
  },
  btnSave: {
    backgroundColor: "#00a680"
  },
  cancel: {
    paddingLeft: 5
  },
  ViewBtnCancel: {
    backgroundColor: "#a60d0d"
  },
  btnAddRestaurant: {
    backgroundColor: "#00a680",
    margin: 50
  }
});
