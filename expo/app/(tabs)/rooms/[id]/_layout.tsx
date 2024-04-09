import { Stack, router, useLocalSearchParams } from "expo-router";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Socket } from "socket.io-client";

import Alert from "../../../../components/Alert";
import ErrorBoundary from "../../../../components/ErrorBoundary";
import RoomErrorBoundary from "../../../../components/ErrorComponent/RoomError";
import WebsocketError from "../../../../components/ErrorComponent/WebsocketError";
import HeaderBack from "../../../../components/HeaderBack";
import { useAsyncError } from "../../../../lib/AsyncError";
import { getApiUrl } from "../../../../lib/apiUrl";
import SocketIo from "../../../../lib/socketio";
import useRoom from "../../../../lib/useRoom";
import { useUserProfile } from "../../../../lib/userProfile";

const WebSocketContext = createContext<Socket | null>(null);

const WebSocketProvider = ({
  children,
  roomId,
}: {
  children: ReactNode;
  roomId: string;
}) => {
  const [webSocket, setWebSocket] = useState<Socket | null>(null);

  const [socketError, setSocketError] = useState<Error | null>(null);
  const throwError = useAsyncError();

  const user = useUserProfile();

  const room = useRoom(roomId);

  useEffect(() => {
    if (!room) return;
    if (!room.is_active) return;
    if (!user) return;

    const url: URL = new URL("/room/" + roomId, getApiUrl());

    const socketInstance = SocketIo.getInstance().getSocket(
      url.pathname,
      user.user_profile_id === room.host_user_profile_id
    );

    setWebSocket(socketInstance);
    console.debug("Socket connecté");

    socketInstance.on("connect_error", (error) => {
      setSocketError(error);
    });

    socketInstance.on("room:error", (error: string) => {
      throwError(new Error(error));
    });

    socketInstance.on("connect", () => {
      setSocketError(null);
    });

    socketInstance.on("room:end", () => {
      Alert.alert(
        "Fermeture de la salle, redirection vers la liste des salles"
      );
      router.push("/rooms");
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [roomId, room, user]);

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
    <ErrorBoundary fallback={<RoomErrorBoundary />}>
      <WebSocketProvider roomId={id}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{ header: () => <HeaderBack /> }}
          />
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
    </ErrorBoundary>
  );
}
