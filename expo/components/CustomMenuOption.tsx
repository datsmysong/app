import { MaterialIcons } from "@expo/vector-icons";
import { MenuOption } from "react-native-popup-menu";

import { Text } from "./Themed";

export type CustomMenuOptionProps = {
  children: React.ReactNode;
  onSelect: () => void;
  icon: {
    name: keyof typeof MaterialIcons.glyphMap;
    size: number;
    color: string;
  };
  textStyle: object;
};

const CustomMenuOption: React.FC<CustomMenuOptionProps> = ({
  children,
  onSelect,
  icon,
  textStyle,
}) => {
  return (
    <MenuOption onSelect={onSelect}>
      <MaterialIcons name={icon.name} size={icon.size} color={icon.color} />
      <Text style={textStyle}>{children}</Text>
    </MenuOption>
  );
};

export default CustomMenuOption;
