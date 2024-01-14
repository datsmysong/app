import {Manager, Socket} from "socket.io-client";

export const ENDPOINT: string = "http://localhost:3000"

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
    };
}