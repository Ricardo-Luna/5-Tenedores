import { createStackNavigator } from "react-navigation-stack";
import RestaurantScreen from "../screens/Restaurants";
import AddRestaurantScreen from "../screens/Restaurants/AddRestaurant";
import { interpolate } from "react-native-reanimated";

const RestaurantsScreenStack = createStackNavigator({
  Restaurants: {
    screen: RestaurantScreen,
    navigationOptions: () => ({
      title: "Restaurantes"
    })
  },
  AddRestaurant: {
    screen: AddRestaurantScreen,
    navigationOptions: () => ({
      title: "Nuevo Restaurante"
    })
  }
});

export default RestaurantsScreenStack;
