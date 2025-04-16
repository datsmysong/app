import BellRinging from "phosphor-react-native/src/icons/BellRinging";
import Cube from "phosphor-react-native/src/icons/Cube";
import DoorOpen from "phosphor-react-native/src/icons/DoorOpen";
import Home from "phosphor-react-native/src/icons/HouseLine";
import Lifebuoy from "phosphor-react-native/src/icons/Lifebuoy";
import Lock from "phosphor-react-native/src/icons/Lock";
import { ScrollView } from "react-native";

import Separator from "../../../../components/Separator";
import SettingsOptions from "../../../../components/profile/SettingsOptions";
import { supabase } from "../../../../lib/supabase";

export default function Account() {
  return (
    <ScrollView>
      <SettingsOptions
        icon={<Home />}
        title="Informations personnelles"
        href="/(tabs)/profile/account/edit"
      />
      <Separator />
      <SettingsOptions
        icon={<Lock />}
        title="Sécurité"
        href="/(tabs)/profile/account/security"
      />
      <Separator />
      <SettingsOptions
        icon={<BellRinging />}
        title="Notifications"
        href="/(tabs)/profile/account/notifications"
      />
      <Separator />
      <SettingsOptions
        icon={<Cube />}
        title="Intégrations"
        href="/(tabs)/profile/account/integration"
      />
      <Separator />
      <SettingsOptions
        icon={<Lifebuoy />}
        title="Assistance"
        href="/(tabs)/profile/account/help"
      />
      <Separator />
      <SettingsOptions
        onPress={() => supabase.auth.signOut()}
        icon={<DoorOpen />}
        title="Se déconnecter"
        color="red"
      />
      <Separator />
    </ScrollView>
  );
}
