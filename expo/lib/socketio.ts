import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "commons/socket.io-types";
import { Manager, Socket } from "socket.io-client";

import { getApiUrl } from "./apiUrl";

export default class SocketIo {
  private static singleton: SocketIo;
  private readonly iomanager: Manager<
    ServerToClientEvents,
    ClientToServerEvents
  >;

  private constructor() {
    this.iomanager = new Manager<ServerToClientEvents, ClientToServerEvents>(
      new URL(getApiUrl())
    );
  }

  static getInstance(): SocketIo {
    if (this.singleton === undefined) {
      this.singleton = new SocketIo();
    }
    return this.singleton;
  }

  getSocket(
    namespace: string,
    host = false
  ): Socket<ServerToClientEvents, ClientToServerEvents> {
    return this.iomanager.socket(namespace, {
      auth: {
        host,
      },
    });
  }
}
