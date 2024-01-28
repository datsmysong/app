import { User } from "@supabase/supabase-js";
import { UserProfile } from "commons/database-types-utils";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

import Alert from "../../components/Alert";
import Button from "../../components/Button";
import { supabase } from "../../lib/supabase";
import useSupabaseUser from "../../lib/useSupabaseUser";

export default function JoinPage() {
  const { roomCode } = useLocalSearchParams();
  const isInsideApplication = Platform.OS !== "web";

  const [user, setUser] = useState<User | null>();
  const [userProfile, setUserProfile] = useState<UserProfile>();
  const [isParticipant, setIsParticipant] = useState<boolean>();
  const [roomId, setRoomId] = useState<string>("");
  const currentPageLink = Linking.useURL();

  /**
   * This effect fetches the user and the room id based on the room code given in the route
   * during the first render of the page.
   */
  useEffect(() => {
    const fetchUser = async () => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const user = await useSupabaseUser();
      setUser(user);
    };
    const fetchRoomId = async () => {
      const { data } = await supabase
        .from("rooms")
        .select("id")
        .eq("code", roomCode)
        .eq("is_active", true)
        .single();

      if (!data) {
        Alert.alert("Aucune salle d'écoute n'a été trouvée avec ce code.");
        return;
      }
      setRoomId(data.id);
    };

    fetchUser();
    fetchRoomId();
  }, []);

  /**
   * This effect fetches the user profile based on the user id.
   */
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const { data: userProfile, error } = await supabase
        .from("user_profile")
        .select("*")
        .eq("account_id", user.id)
        .single();
      if (error) {
        Alert.alert(
          "Une erreur est survenue lors de la récupération du profil"
        );
        return;
      }
      setUserProfile(userProfile);
    };

    fetchData();
  }, [user]);

  /**
   * This effect fetches the participant based on the user profile and the room id.
   */
  useEffect(() => {
    if (!userProfile || !roomId) return;

    const fetchParticipant = async () => {
      const { data } = await supabase
        .from("room_users")
        .select("*")
        .eq("profile_id", userProfile.user_profile_id)
        .eq("room_id", roomId);

      setIsParticipant((data?.length ?? 0) > 0);
    };

    fetchParticipant();
  }, [userProfile, roomId]);

  /**
   * This automatically joins the user to the room if he is on mobile and not a participant.
   * When this page is opened inside the app, we don't want to show the choice to join the room.
   * We instead join the room automatically and redirect the user to the room page.
   */
  useEffect(() => {
    if (isParticipant === undefined) return;
    if (!userProfile || !isInsideApplication || !roomId) return;

    if (!isParticipant) {
      joinRoom().then((r) => {
        if (r?.error) {
          console.log(r?.error);
          return Alert.alert("Impossible de rejoindre la salle d'écoute");
        }
      });
    }
    router.replace(`rooms/${roomId}`);
  }, [userProfile, isInsideApplication, roomId, isParticipant]);

  /**
   * Joins a room by inserting the user's profile into the room_users table.
   * If the user is already a participant, it will act like he joined the room.
   */
  const joinRoom = async () => {
    if (!userProfile) return { error: "Unauthorized" };
    if (!roomId) return { error: "Unknown room" };

    if (isParticipant) return { error: null };
    console.log("user", userProfile);

    const { error: roomUsersError } = await supabase.from("room_users").insert({
      room_id: roomId,
      profile_id: userProfile.user_profile_id,
    });

    return { error: roomUsersError };
  };

  /**
   * Returns the app link based on the current environment and room code.
   * On production, the app link is a deep link to the app (datsmysong://)
   * On development, the app link is a deep link to the Expo Go app (exp://)
   * Currently, this doesn't support native development builds.
   * @returns The app link.
   */
  function getAppLink(): string {
    const production = process.env.NODE_ENV === "production";
    if (production) {
      return `datsmysong://join/${roomCode}`;
    } else {
      if (!currentPageLink) return "";

      const host = currentPageLink.split("/").slice(2, 3).join("/");
      return `exp://${host}/--/join/${roomCode}`;
    }
  }

  /**
   * Handles the action when the user continues on the website.
   * If the user is already a participant, it replaces the current route with the room route.
   * Otherwise, it joins the room and replaces the current route with the room route.
   */
  async function handleContinueOnWebsite() {
    if (isParticipant) return router.replace(`rooms/${roomId}`);

    const { error } = await joinRoom();
    if (error)
      return Alert.alert("Impossible de rejoindre la salle d'écoute: " + error);

    router.replace(`rooms/${roomId}`);
  }

  function handleAnonymousJoin() {
    return Alert.alert("Fonctionnalité non implémentée");
  }

  return (
    <View style={styles.choiceContainer}>
      {roomCode && (
        <>
          {isInsideApplication && (
            <Text style={styles.title}>Redirection en cours...</Text>
          )}
          {!isInsideApplication && (
            <>
              {isParticipant && (
                <>
                  <Text style={styles.title}>
                    Vous avez déjà rejoint la salle d'écoute "{roomCode}" !
                  </Text>
                  <Text style={styles.title}>
                    Comment souhaitez-vous continuer ?
                  </Text>
                </>
              )}
              {!isParticipant && (
                <Text style={styles.title}>
                  Vous êtes sur le point de rejoindre la salle d'écoute "
                  {roomCode}"
                </Text>
              )}

              <View style={styles.buttonContainer}>
                <Button block type="filled" href={getAppLink()}>
                  Ouvrir dans l'application
                </Button>
                {!userProfile && (
                  <Button block type="outline" onPress={handleAnonymousJoin}>
                    Continuer en tant qu'invité
                  </Button>
                )}
                {userProfile && (
                  <Button
                    block
                    type="outline"
                    onPress={handleContinueOnWebsite}
                  >
                    Continuer sur le site
                  </Button>
                )}
              </View>
            </>
          )}
        </>
      )}
      {!roomCode && (
        <Text style={styles.title}>
          Aucun code de salle d'écoute n'a été retourné
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  choiceContainer: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 24,
    gap: 10,
  },
  buttonContainer: {
    gap: 8,
  },
  title: {
    marginBottom: 20,
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
});
