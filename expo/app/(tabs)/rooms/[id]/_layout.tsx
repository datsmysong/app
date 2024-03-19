import { Stack, useLocalSearchParams } from "expo-router";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Socket } from "socket.io-client";

import WebsocketError from "../../../../components/ErrorComponent/WebsocketError";
import { getApiUrl } from "../../../../lib/apiUrl";
import SocketIo from "../../../../lib/socketio";

const WebSocketContext = createContext<Socket | null>(null);

const WebSocketProvider = ({
  children,
  roomId,
}: {
  children: ReactNode;
  roomId: string;
}) => {
  const [webSocket, setWebSocket] = useState<Socket | null>(null);

  const [socketError, setSockerError] = useState<Error | null>(null);

  useEffect(() => {
    const url: URL = new URL("/room/" + roomId, getApiUrl());

    const socketInstance = SocketIo.getInstance().getSocket(url.pathname);
    setWebSocket(socketInstance);
    console.log("Socket connecté");

    socketInstance.on("connect_error", (error) => {
      setSockerError(error);
    });

    socketInstance.on("connect", () => {
      setSockerError(null);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [roomId]);

  return (
    <WebSocketContext.Provider value={webSocket}>
      {socketError && <WebsocketError />}
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
        <Stack.Screen name="add" options={{ title: "Ajouter une musique" }} />
        <Stack.Screen name="settings" options={{ title: "Paramètres" }} />
      </Stack>
    </WebSocketProvider>
  );
}
