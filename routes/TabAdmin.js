import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Customer from "../screens/admin/Customer";
import Setting from "../screens/admin/Setting";
import Transaction from "../screens/admin/Transaction";
import RouterHome from "./admin/RouterHome";
const Tab = createMaterialBottomTabNavigator()
const TabAdmin =()=>{
    return(
        <Tab.Navigator 
            screenOptions={{
                headerShown:false
            }}
        >
            <Tab.Screen name="RouterHome" component={RouterHome}
                options={{
                    tabBarIcon: "home",
                    title:"home"
                }}
            />
            <Tab.Screen name="Transaction" component={Transaction}
                options={{
                    tabBarIcon: "cash"
                }}
            />
            <Tab.Screen name="Customer" component={Customer}
                options={{
                    tabBarIcon: "account"
                }}
            />
            <Tab.Screen name="Setting" component={Setting}
                options={{
                    tabBarIcon: "cog"
                }}
            />
        </Tab.Navigator>
    )
}
export default TabAdmin;