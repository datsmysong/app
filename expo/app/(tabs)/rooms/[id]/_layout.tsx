import { ErrorBoundaryProps, Stack, useLocalSearchParams } from "expo-router";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { View, Text } from "react-native";
import { Socket } from "socket.io-client";

import ErrorBoundary from "../../../../components/ErrorBoundary";
import { getApiUrl } from "../../../../lib/apiUrl";
import SocketIo from "../../../../lib/socketio";

const WebSocketContext = createContext<Socket | null>(null);

// export function ErrorBoundary(props: ErrorBoundaryProps) {
//   return (
//     <View>
//       <Text>Enfaite faut dans le layout oyuuuu</Text>;
//     </View>
//   );
// }

const WebSocketProvider = ({
  children,
  roomId,
}: {
  children: ReactNode;
  roomId: string;
}) => {
  const [webSocket, setWebSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const url: URL = new URL("/room/" + roomId, getApiUrl());

    const socketInstance = SocketIo.getInstance().getSocket(url.pathname);
    setWebSocket(socketInstance);
    console.log("Socket connecté");

    return () => {
      socketInstance.disconnect();
      console.log("Socket déconnecté");
    };
  }, [roomId]);

  return (
    <WebSocketContext.Provider value={webSocket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

export default function RoomTabLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <WebSocketProvider roomId={id}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Nom de la salle" }} />
        <Stack.Screen
          name="invite"
          options={{ presentation: "modal", title: "Menu d'invitation" }}
        />
        <Stack.Screen
          name="qrcode"
          options={{
            title: "Rejoindre la salle",
            presentation: "transparentModal",
          }}
        />
        {/* <ErrorBoundary fallback="test2"> */}
        <ErrorBoundary>
          <Stack.Screen name="add" options={{ title: "Ajouter une musique" }} />
        </ErrorBoundary>
        {/* </ErrorBoundary> */}
        <Stack.Screen name="settings" options={{ title: "Paramètres" }} />
      </Stack>
    </WebSocketProvider>
  );
}
