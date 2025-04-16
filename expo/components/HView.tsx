import { ViewProps, View } from "./Themed";

// Horizontal View
export default function HView(props: ViewProps) {
  const { style, ...others } = props;
  return <View style={[style, { flexDirection: "row" }]} {...others} />;
}
