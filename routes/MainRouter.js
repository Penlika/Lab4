import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screens/Login";
import Register from "../screens/Register";
import TabAdmin from "./TabAdmin";
import TabCustomer from "./TabCustomer";

const Stack = createStackNavigator()
const MainRouter =({navigation})=>{
    return (
        <Stack.Navigator 
            screenOptions={{
                headerShown:false
            }}>
            <Stack.Screen name="login" component={Login}/>
            <Stack.Screen name="register" component={Register}/>
            <Stack.Screen name="tabadmin" component={TabAdmin}/>
            <Stack.Screen name="tabcustomer" component={TabCustomer}/>
        </Stack.Navigator>
    )
        
}
export default MainRouter;