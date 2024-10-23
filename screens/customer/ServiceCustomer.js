import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useMyContextController } from "../../context";
import { useEffect, useLayoutEffect, useState } from "react";
import { Avatar, TextInput, Title } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
const ServiceCustomer =({navigation})=>{
    const [services,setServices] = useState([])
    const [servicesData,setServicesData] = useState([])
    const cSERVICES = firestore().collection("SERVICES")
    const [name , setName] = useState("")
    //fecth
    useEffect(()=>{
        cSERVICES.onSnapshot(
            response =>{
                var arr = []
                response.forEach(doc => arr.push(doc.data()))
                setServices(arr)
                setServicesData(arr)
            }
        )
    },[])
    
    const renderItem = ({item})=>{
        const {serviceName, price} = item
        return(
            <TouchableOpacity style={{flexDirection: 'row',
                borderWidth: 1,
                height: 60, 
                borderRadius: 10,
                margin: 5,
                justifyContent: 'space-between',
                alignItems:'center',
                padding: 10
            }}
                onPress={() => navigation.navigate("AddNewAppointment", {item: item})}
            >
                <Text
                    style={{
                        fontSize: 25,
                        fontWeight: 'bold'
                    }}
                >{serviceName}</Text>
                <Text> {price} VND</Text>
            </TouchableOpacity>
        )
    }

    useEffect(()=>{
       setServicesData(services.filter(s=> s.serviceName.includes(name)))
    }, [name])
    return(
        <View style={style.container}>
            <Image style={style.image} source={require("../../image/logolab3.png")}/>
            <TextInput 
                label={"Search Service by name"}
                style={{margin: 10}}
                value={name}
                onChangeText={setName}
            />
            <View style={style.title}>
                <Text style={style.text}>Danh sách dịch vụ</Text>
            </View>
            <FlatList
                data={servicesData}
                keyExtractor={item => item.id}
                renderItem={renderItem}
            />
               
        </View>
    )
}
export default ServiceCustomer;

const style = StyleSheet.create({
    container:{
        flex:1,
        padding:5,
    },
    image:{
        marginTop:30,
        alignSelf:'center'
    },
    title:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between"
    },
    text:{
        fontSize: 30,
        fontWeight:"bold",
        color:"red"
    },
})