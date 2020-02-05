import { createStackNavigator } from "react-navigation-stack";
import RestaurantScreen from "../screens/Restaurants";

const RestaurantsScreenStack = createStackNavigator({
  Restaurants: {
    screen: RestaurantScreen,
    navigationOptions: () => ({
      title: "Restaurantes"
    })
  }
});

export default RestaurantsScreenStack;
