import {Socket} from "socket.io";
import Queue from "../Queue";
import MusicStorage from "../MusicStorage";

export default function QueueIO(socket: Socket/*, next: (err?: ExtendedError) => void*/) {
  let namespace = socket.nsp;
  /*regex uuid [0-9a-f]{8}-([0-9a-f]{4}){3}-[0-9a-f]{12}*/
  let pattern = /^\/queue\/(.*)$/
  console.log(namespace.name)

  // if (!pattern.test(namespace.name)) {
  //     //next()
  //     socket.disconnect()
  //     return
  // }

  // remove first element which contains the whole tested string, then get the first group (surround with parenthesis)

  let rawUrlMatchGroups = pattern.exec(namespace.name);
  if (rawUrlMatchGroups === null) {
    socket.disconnect()
    return
  }
  let activeRoomId = rawUrlMatchGroups.slice(1)[0] as string

  let queue = MusicStorage.getMusicStorage().getQueue(activeRoomId)
  if (queue === null) {
    socket.disconnect()
    return;
  }

  socket.emit("socketio-client"/*"playlist"*/, Queue.toJSON(queue));

  socket.onAny(async (event: string, urlRaw: string/*, callback: (arg0: any) => void*/) => {
    switch (event) {
      case "add":
        await queue?.add(urlRaw)
        break;
      case "remove":
        queue?.remove(urlRaw)
        break;
    }

    // TODO replace by callback and remove emit here : "Acknowledgements" CANCELED
    // TODO replace "socketio-client" by "playlist"

    // TODO ferbach : actionReducer pattern
    socket.nsp.emit("socketio-client"/*"playlist"*/, Queue.toJSON(queue));
    // callback(Queue.toJSON(queue))
  })
}