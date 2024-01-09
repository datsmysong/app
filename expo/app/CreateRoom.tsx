import { View, Text, TextInput, StyleSheet } from "react-native";
import ServiceList from "../components/servicesList";
import ParametersList from "../components/parametersList";
import CustomTextInput from "../components/customTextInput";

export default function CreateRoom() {

  return (
    <View>
      <Text style={styles.title}>Créer une salle</Text>
        <Text>Nom de la salle</Text>
        <CustomTextInput placeholder={"Nom de la salle"}/>
        <Text>Code de la salle</Text>
        <CustomTextInput placeholder={"Code de la salle"}/>
        <Text>Plateforme de streaming à utiliser</Text>
        <ServiceList/>
        <ParametersList/>
    </View>
  );
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        width: 200,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingBottom: 20,
    },
    image: {
        width: 100,
        height: 100,
    },
    centered: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20,
    },
    text: {
        paddingTop: 20,
        paddingBottom: 20,
    }
});