import {FastifyReply, FastifyRequest} from "fastify";

interface QueryParams {
    id: string
}

// c'est une Map qui regroupe pour chaque salle d'écoute active (id), une liste de lien spotify
const MUSIC_STORAGE: Map<string, string[]> = new Map()

export default function QueueGET(req: FastifyRequest, reply: FastifyReply) {
    const {id: active_room_id} = req.query as QueryParams;

    let tracks = MUSIC_STORAGE.get(active_room_id)
    if (Array.isArray(tracks)) {
        reply.send({current_active_room: active_room_id, tracks: tracks})
    } else {
        reply.code(404).send({"error": "the given id is not active room"})
    }

    // MUSIC_STORAGE.set(id, tracks)


    // supabase
    //     .from("active_rooms")
    //     .select("*")
    //     .eq("id", id)
    //     .then(res => {
    //         reply.send(res.data)
    //     })
}