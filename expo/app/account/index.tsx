import { ScrollView } from "react-native";

import Separator from "../../components/Separator";
import SettingsOptions from "../../components/profile/SettingsOptions";
import { supabase } from "../../lib/supabase";

export default function Account() {
  return (
    <ScrollView>
      <SettingsOptions
        icon="home"
        title="Informations personnelles"
        href="/account/personal-info"
      />
      <Separator />
      <SettingsOptions icon="lock" title="Sécurité" href="/account/security" />
      <Separator />
      <SettingsOptions
        icon="notifications"
        title="Notifications"
        href="/manage-account/notifications"
      />
      <Separator />
      <SettingsOptions
        icon="language"
        title="Intégrations"
        href="/manage-account/integrations"
      />
      <Separator />
      <SettingsOptions
        icon="help"
        title="Assistance"
        href="/manage-account/help"
      />
      <Separator />
      <SettingsOptions
        onPress={() => supabase.auth.signOut()}
        icon="logout"
        title="Se déconnecter"
        color="red"
      />
    </ScrollView>
  );
}
