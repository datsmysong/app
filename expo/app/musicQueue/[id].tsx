import {FlatList, Text, View, StyleSheet} from "react-native";
import {useEffect, useState} from "react";
import {Image} from "expo-image";
import SocketIo from "../../lib/socketio";
import {useLocalSearchParams} from "expo-router";

interface JSONTrack {
  url: string,
  title: string,
  duration: number,
  artistName: string,
  albumName: string,
  imgUrl: string
}

interface ActiveRoomSkeleton {
    currentActiveRoom: string,
    tracks: JSONTrack[]
}

// https://docs.expo.dev/guides/environment-variables/
const ENDPOINT = process.env.EXPO_PUBLIC_API_ENDPOINT;
if (!ENDPOINT) {
  throw new Error("le endpoint de l'API REST n'est pas défini")
}

const TrackItem = (prop: {track: JSONTrack}) => {
    const { title, artistName: artist, albumName: album, imgUrl: rawImageUrl } = prop.track;
    let imageSrc = new URL(rawImageUrl).toString()

    return (
    <View style={styles.container} >
        <Image source={imageSrc} style={styles.image} />
        <View style={styles.textContainer}>
            <Text style={[styles.text, {fontSize: 20}]}>{title}</Text>
            <Text style={styles.text}>{artist} - {album}</Text>
        </View>
    </View>
)};


export interface MusicQueueParams {
  id: string
}

// TODO socket io which refresh playlist on live
export default function musicQueue(/*{activeRoomId= "1629a562-288b-4218-be45-fc8e64f4f6d9"}*/) {
  const {id: activeRoomId} = useLocalSearchParams() as MusicQueueParams;

    let url: URL = new URL("/queue/"+activeRoomId, ENDPOINT);

    const [data, setData] = useState<ActiveRoomSkeleton>()

    useEffect(() => {
        // fetch(url)
        //     .then(res => res.json())
        //     .then((data: ActiveRoomSkeleton) => setData(data))

        SocketIo.getInstance().getSocket(url.pathname)
            .on("socketio-client"/*"playlist"*/, /*(data: any) => console.log(data))*/ (data: ActiveRoomSkeleton) => setData(data));

    }, []);

    return (
        <View>
            <Text>{data?.currentActiveRoom}</Text>
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