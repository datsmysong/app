import { Stack, useLocalSearchParams } from "expo-router";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Socket } from "socket.io-client";

import ErrorBoundary from "../../../../components/ErrorBoundary";
import RoomErrorBoundary from "../../../../components/ErrorComponent/RoomError";
import WebsocketError from "../../../../components/ErrorComponent/WebsocketError";
import { useAsyncError } from "../../../../lib/AsyncError";
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

  const [socketError, setSocketError] = useState<Error | null>(null);
  const throwError = useAsyncError();

  useEffect(() => {
    const url: URL = new URL("/room/" + roomId, getApiUrl());

    const socketInstance = SocketIo.getInstance().getSocket(url.pathname);
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
    <ErrorBoundary fallback={<RoomErrorBoundary />}>
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
    </ErrorBoundary>
  );
}
