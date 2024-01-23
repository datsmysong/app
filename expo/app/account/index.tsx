import { Link } from "expo-router";
import { ScrollView } from "react-native";

import Separator from "../../components/Separator";
import SettingsOptions from "../../components/profile/SettingsOptions";

export default function Account() {
  return (
    <ScrollView>
      <Link href="/account/personal-info">
        <SettingsOptions icon="home" title="Informations personnelles" />
      </Link>
      <Separator />
      <Link href="/account/security">
        <SettingsOptions icon="lock" title="Sécurité" />
      </Link>
      <Separator />
      <Link href="/manage-account/notifications">
        <SettingsOptions icon="notifications" title="Notifications" />
      </Link>
      <Separator />
      <Link href="/manage-account/integrations">
        <SettingsOptions icon="language" title="Intégrations" />
      </Link>
      <Separator />
      <Link href="/manage-account/help">
        <SettingsOptions icon="help" title="Assistance" />
      </Link>
      <Separator />
      <Link href="/manage-account/logout">
        <SettingsOptions icon="logout" title="Se déconnecter" color="red" />
      </Link>
    </ScrollView>
  );
}
