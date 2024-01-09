import {View, Text, TouchableOpacity, StyleSheet} from "react-native";
import Checkbox from 'expo-checkbox';
import CustomTextInput from "./customTextInput";
import {useState} from "react";


export default function ParametersList(){

    const [isPressed, setIsPressed] = useState(false);
    const [checked, setChecked] = useState(true);
    const TriangleRight = () => {
        return <View style={[styles.triangle, styles.triangleRight]}/>;
    };

    const TriangleDown = () => {
        return <View style={[styles.triangle, styles.triangleDown]} />;
    };

    return(
        <View>
            <TouchableOpacity onPress={ () => {setIsPressed(!isPressed)}}>
                <View style={styles.items}>
                    {isPressed ? <TriangleDown/> : <TriangleRight/>}
                    <Text style={styles.item}>Paramètres supplémentaires</Text>
                </View>
            </TouchableOpacity>

            {isPressed ?
                (<View>

                    <div style={styles.checkboxContainer}>
                        <Text>Autoriser à lancer un vote pour passer une musique</Text>
                        <Checkbox
                            style={styles.checkbox}
                            disabled={false}
                            value={checked}
                            onValueChange={(newValue) => setChecked(newValue)}
                        />
                    </div>

                    <CustomTextInput placeholder={"Nombre de votes pour passer une musique"} style={styles.minimizedFont} inputMode={"numeric"}/>
                    <CustomTextInput placeholder={"Nombre maximum de musique par utilisateur"} style={styles.minimizedFont}/>
                    <CustomTextInput placeholder={"Durée maximale d'une musique"} style={styles.minimizedFont}/>

                </View>)
                :
                <View/>
            }
        </View>
    )
 }

 const styles= StyleSheet.create({

     triangle: {
         width: 0,
         height: 0,
         backgroundColor: "transparent",
         borderStyle: "solid",
         borderLeftWidth: 8,
         borderRightWidth: 8,
         borderBottomWidth: 16,
         borderLeftColor: "transparent",
         borderRightColor: "transparent",
         borderBottomColor: "black",
     },

     triangleRight: {
         transform: "rotateZ(90deg)" ,
     },

     triangleDown: {
         transform: "rotateX(180deg)",
     },

     items: {
         flexDirection: 'row',
         paddingTop: 20,
         paddingLeft: 10,
     },

     item: {
         paddingLeft: 10,
     },

    minimizedFont: {
        fontSize: 10,
    },

     checkbox: {
         margin: 8,
     },

     checkboxContainer: {
         flexDirection: 'column',
         justifyContent: 'center',
         alignItems: 'center',
         paddingLeft: 20,
         paddingTop: 10,

     }

 });

