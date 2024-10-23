import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Setting from "../screens/admin/Setting";
import RouterHome from "./admin/RouterHome";
import Appointments from "../screens/customer/Appointments";
import RouterServiceCustomer from "./customer/RouterServiceCustomer";
import AppointmentDetail from "../screens/customer/AppointmentDetail";
const Tab = createMaterialBottomTabNavigator()
const TabCutomer =()=>{
    return(
        <Tab.Navigator 
            screenOptions={{
                headerShown:false
            }}
        >
            <Tab.Screen name="RouteServiceCustomer" component={RouterServiceCustomer}
                options={{
                    tabBarIcon: "home",
                    title:"home"
                }}
            />
            <Tab.Screen name="Appointments" component={Appointments}
                options={{
                    tabBarIcon: "cash"
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
export default TabCutomer   ;