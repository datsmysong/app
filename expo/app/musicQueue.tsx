import {FlatList, Text, View, StyleSheet} from "react-native";
import {useEffect, useState} from "react";
import {Image} from "expo-image";
import SocketIo from "./socketio";

interface JSONTrack {
    url: string,
    title: string,
    duration: number,
    artist_name: string,
    album_name: string,
    imgUrl: string
}

interface ActiveRoomSkeleton {
    current_active_room: string,
    tracks: JSONTrack[]
}

const ENDPOINT = "http://localhost:3000";

const TrackItem = (prop: {track: JSONTrack}) => {
    const { title, artist_name: artist, album_name: album, imgUrl: raw_image_url } = prop.track;
    let image_src = new URL(raw_image_url).toString()

    return (
    <View style={styles.container} >
        <Image source={image_src} style={styles.image} />
        <View style={styles.textContainer}>
            <Text style={[styles.text, {fontSize: 20}]}>{title}</Text>
            <Text style={styles.text}>{artist} - {album}</Text>
        </View>
    </View>
)};


// TODO socket io which refresh playlist on live
export default function MusicQueue({active_room_id= "e81ca40e-9cfc-4436-89b7-76998f220f19"}) {

    let url: URL = new URL("/queue/"+active_room_id, ENDPOINT);

    const [data, setData] = useState<ActiveRoomSkeleton>()

    useEffect(() => {
        fetch(url)
            .then(res => res.json())
            .then((data: ActiveRoomSkeleton) => setData(data))

        SocketIo.getInstance().getSocket(url.pathname)
            .on("socketio-client"/*"playlist"*/, /*(data: any) => console.log(data))*/ (data: ActiveRoomSkeleton) => setData(data));
    }, []);

    return (
        <View>
            <Text>{data?.current_active_room}</Text>
            <FlatList
                data={data?.tracks}
                renderItem={({item}) => <TrackItem track={item}/>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: "1%",
        paddingVertical: "0.5%",
        margin: "1%",
        backgroundColor: "teal",
        borderRadius: 10,
        flexDirection: "row"
    },
    image: {
        width: 60,
        height: 60,
        backgroundColor: '#0553',
    },
    textContainer: {
        justifyContent: "center",
        paddingHorizontal: "1%"
    },
    text: {
        color: "white"
    }
});