import Queue from "./Queue";

export default class MusicStorage {
    private readonly data: Map<string, Queue>;
    private static singleton: MusicStorage;

    private constructor() {
        this.data = new Map();
    }

    static getMusicStorage(): MusicStorage {
        if (this.singleton === undefined) {
            this.singleton = new MusicStorage();
        }
        return this.singleton;
    }

    addQueue(queue: Queue) {
        this.data.set(queue.uuid, queue);
    }

    removeQueueByUuid(uuid: string) {
        this.data.delete(uuid)
    }

    removeQueue(queue: Queue) {
        this.data.delete(queue.uuid)
    }

    getQueue(activeRoomId: string): Queue | null {
        return this.data.get(activeRoomId) ?? null
    }
}