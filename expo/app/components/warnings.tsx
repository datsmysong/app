import { ScrollView } from "react-native";

import { Text } from "../../components/Themed";
import Warning, { WarningProps } from "../../components/Warning";

const propOptions: Partial<Record<keyof WarningProps, any[]>> = {
  variant: ["success", "warning", "error"],
  label: ["Attention"],
  children: [<Text>ça fbitis consequuntur ad quia ut itaque modi.</Text>],
};

function generateCombinations(
  options: Record<string, any[]>,
  prefix: Partial<WarningProps> = {}
): Partial<WarningProps>[] {
  const keys = Object.keys(options);
  if (!keys.length) return [prefix];
  const key = keys[0];
  const restOptions = { ...options };
  delete restOptions[key];
  return options[key].flatMap((option) => {
    return generateCombinations(restOptions, { ...prefix, [key]: option });
  });
}

const buttonProps = generateCombinations(propOptions);

export default function ButtonsMania() {
  return (
    <ScrollView
      style={{
        gap: 100,
        flex: 1,
        flexDirection: "column",
      }}
    >
      <Text>Index</Text>
      {buttonProps.map((props, index) => (
        <Warning key={index} {...props} label={props.label ?? ""} />
      ))}
    </ScrollView>
  );
}
