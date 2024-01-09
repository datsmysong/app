import {Text, View, StyleSheet, FlatList, Platform, TouchableOpacity} from "react-native";
import {Image} from "expo-image";
import {useState} from "react";

export default function ServicesList() {

    const images = new Map<string, any>([
       ["Spotify" ,require("../assets/images/spotify.png")],
        ["SoundCloud", require("../assets/images/soundcloud.png")]
    ]);

    const [selectedItems, setSelectedItems] = useState({["Spotify"] : true, ["Soundcloud"] : false} as {[key: string]: boolean});

    const toggleSelect = () => {
        for (const item in selectedItems) {
            setSelectedItems(prevState => ({...prevState, [item]: !prevState[item]}));
            console.log(item + " : " + selectedItems[item]);
        }
    };

    return (
        <FlatList
        horizontal
        showsHorizontalScrollIndicator={Platform.OS === 'web'}
        data={Array.from(images.keys())}
        renderItem={({item}) => (
            <TouchableOpacity onPress={() => toggleSelect()}>
                <View style={[styles.items, selectedItems[item] ? styles.selected : {}]}>
                    <Image style={styles.image} contentFit={"contain"} source={images.get(item)} key={item}/>
                    <Text>{item}</Text>
                </View>
            </TouchableOpacity>
        )}
        />
    )
}

const styles = StyleSheet.create({
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    items: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 30,
        paddingTop: 20,
    },
    selected: {
        borderColor: 'grey',
        borderWidth: 3,
        borderRadius: 20,
    },
});