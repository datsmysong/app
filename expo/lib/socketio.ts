import { Manager, Socket } from "socket.io-client";

// https://docs.expo.dev/guides/environment-variables/
const ENDPOINT = process.env.EXPO_PUBLIC_API_ENDPOINT ?? "";
if (!ENDPOINT) {
  throw new Error("le endpoint de communication socket.io n'est pas défini");
}

export default class SocketIo {
  private static singleton: SocketIo;
  private readonly iomanager: Manager;

  private constructor() {
    this.iomanager = new Manager(new URL(ENDPOINT));
  }

  static getInstance(): SocketIo {
    if (this.singleton === undefined) {
      this.singleton = new SocketIo();
    }
    return this.singleton;
  }

  getSocket(namespace: string): Socket {
    return this.iomanager.socket(namespace);
  }
}
