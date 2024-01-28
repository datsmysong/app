import { Manager, Socket } from "socket.io-client";

import { getApiUrl } from "./apiUrl";

export default class SocketIo {
  private static singleton: SocketIo;
  private readonly iomanager: Manager;

  private constructor() {
    this.iomanager = new Manager(new URL(getApiUrl()));
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
