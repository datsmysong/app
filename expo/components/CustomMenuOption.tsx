import { MenuOption } from "react-native-popup-menu";

import { Text } from "./Themed";

export type CustomMenuOptionProps = {
  children: React.ReactNode;
  onSelect: () => void;
  icon: React.ReactElement;
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
      {icon}
      <Text style={textStyle}>{children}</Text>
    </MenuOption>
  );
};

export default CustomMenuOption;
