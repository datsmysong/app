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

    add_queue(queue: Queue) {
        this.data.set(queue.uuid, queue);
    }

    remove_queue_by_uuid(uuid: string) {
        this.data.delete(uuid)
    }

    remove_queue(queue: Queue) {
        this.data.delete(queue.uuid)
    }

    get_queue(active_room_id: string): Queue | null {
        return this.data.get(active_room_id) ?? null
    }
}