import { ActiveRoom, Room } from "./types";
import useApiBaseUrl from "./useApiBaseUrl";
import useSupabaseUser from "./useSupabaseUser";

export default function useRoom(roomId: string): Room | ActiveRoom {
  const BASE_URL = useApiBaseUrl();
  const user = undefined; /* useSupabaseUser() */

  /* const room = fetch(BASE_URL + `/rooms/${roomId}`, {
    headers: {
      
    }
  }); */

  const room: ActiveRoom = {
    id: "98745f-98745f-98745f-98745f",
    name: "crazyguys",
    configuration: {
      voteSkipping: true,
      voteSkippingNeededPercentage: 60,
      maxMusicCountInQueuePerParticipant: 5,
      maxMusicDuration: 600,
    },
    createdAt: new Date(),
    hostUserProfileId: "98745f-98745f-98745f-98751f",
    participants: [
      {
        nickname: "toto",
        id: "98745f-98745f-98745f-98748f",
      },
      {
        accountId: "98745f-98745f-98745f-98749f",
        avatar: null,
        id: "98745f-98745f-98745f-98751f",
        nickname: "Hugo",
        username: "hugo",
      },
    ],
    queue: [],
    streamingService: {
      serviceId: "c99631a2-f06c-4076-80c2-13428944c3a8",
      serviceName: "SoundCloud",
    }
  };

  return room;
}
