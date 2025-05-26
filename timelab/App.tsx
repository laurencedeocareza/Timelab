import NewGoal from "./app/child/newGoal"; // ✅ Adjust path if needed
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

<Stack.Screen name="NewGoal" component={NewGoal} />;
