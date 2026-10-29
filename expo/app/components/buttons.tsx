import { ScrollView } from "react-native";

import { Text } from "../../components/Themed";
import Button, { ButtonProps } from "../../components/ui/Button";

const propOptions: Partial<Record<keyof ButtonProps, any[]>> = {
  type: ["filled", "outline"],
  size: ["small", "normal"],
  block: [true, false],
  icon: ["home", null],
  prependIcon: ["home", null],
  appendIcon: ["home", null],
  color: ["primary", "success", "danger"],
  loading: [false, true],
};

function generateCombinations(
  options: Record<string, any[]>,
  prefix: Partial<ButtonProps> = {}
): Partial<ButtonProps>[] {
  const keys = Object.keys(options);
  if (!keys.length) return [prefix];
  const key = keys[0];
  const restOptions = { ...options };
  delete restOptions[key];
  return options[key].flatMap((option) => {
    // Prevent combination of icon with prependIcon or appendIcon
    if (
      (key === "icon" &&
        option !== null &&
        (prefix.prependIcon || prefix.appendIcon)) ||
      ((key === "prependIcon" || key === "appendIcon") &&
        option !== null &&
        prefix.icon)
    ) {
      return [];
    }
    return generateCombinations(restOptions, { ...prefix, [key]: option });
  });
}

const buttonProps = generateCombinations(propOptions);

export default function ButtonsMania() {
  return (
    <ScrollView>
      <Text>Index</Text>
      {buttonProps.map((props, index) => (
        <Button key={index} {...props}>
          Button {index + 1}
        </Button>
      ))}
    </ScrollView>
  );
}
