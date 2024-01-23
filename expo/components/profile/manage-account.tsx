import { ScrollView } from "react-native";

import SettingsOptions from "./SettingsOptions";
import Separator from "../Separator";

export default function ManageAccount() {
  return (
    <ScrollView>
      <SettingsOptions
        icon="home"
        title="Informations personnelles"
        linkhref="/manage-account"
      />
      <Separator />
      <SettingsOptions
        icon="lock"
        title="Sécurité"
        linkhref="/manage-account/security"
      />
      <Separator />
      <SettingsOptions
        icon="notifications"
        title="Notifications"
        linkhref="/manage-account/notifications"
      />
      <Separator />
      <SettingsOptions
        icon="language"
        title="Intégrations"
        linkhref="/manage-account/integrations"
      />
      <Separator />
      <SettingsOptions
        icon="help"
        title="Assistance"
        linkhref="/manage-account/help"
      />
      <Separator />
      <SettingsOptions
        icon="logout"
        title="Se déconnecter"
        linkhref="/manage-account/logout"
        color="red"
      />
    </ScrollView>
  );
}
