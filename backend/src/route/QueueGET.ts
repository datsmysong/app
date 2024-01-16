import {FastifyReply, FastifyRequest} from "fastify";
import Queue from "../Queue";
import MusicStorage from "../MusicStorage";

interface QueryParams {
  id: string
}

export default async function QueueGET(req: FastifyRequest, reply: FastifyReply) {
  const {id: activeRoomId} = req.params as QueryParams;

  // TODO DEBUG
  let musicStorage = MusicStorage.getMusicStorage();
  console.log(MusicStorage.getMusicStorage())

  // TODO MOCK
  let mock;
  if (activeRoomId === "mock") {
    mock = Queue.newQueue(musicStorage);

    await mock.add("https://open.spotify.com/intl-fr/track/4OUTQBwLBaTIUcgdI5PPt7?si=3aac1a9bcf3d4eac");
    await mock.add("https://open.spotify.com/intl-fr/track/5b8HD1dJDuPawgS5FjSC2q?si=1c2499f5cb334ca9");

    await mock.add("https://open.spotify.com/intl-fr/track/42CJLS5WkK6jckfYvJ8ULb?si=22b524f4d60643ce");
  }

  let queue = mock === undefined ? musicStorage.getQueue(activeRoomId) : mock
  if (queue === null) {
    reply.code(404);
  }
  return reply.send(Queue.toJSON(queue));
}