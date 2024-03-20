import React from "react";
import { Text, View } from "react-native";
import FontAwesome from "react-native-vector-icons/Ionicons";

import Button from "./Button";

type ErrorBoundaryProps = {
  fallback?: JSX.Element;
  children: React.ReactNode;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, any> {
  state = {
    error: false,
  };

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { error: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // deal with errorInfo if needed
    console.error("Error catch : ", error, errorInfo);
  }

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <View
          style={{
            backgroundColor: "white",
          }}
        >
          <Text style={{ width: "100%" }}>
            <FontAwesome name="ios-information-circle-outline" size={60} />
          </Text>
          <Text style={{ fontSize: 32 }}>Oops, Something Went Wrong</Text>
          <Text
            style={{
              marginVertical: 10,
              lineHeight: 23,
              fontWeight: "500",
            }}
          >
            The app ran into a problem and could not continue. We apologise for
            any inconvenience this has caused! Press the button below to restart
            the app and sign back in. Please contact us if this issue persists.
          </Text>
          <Button href="/">Back to home</Button>
        </View>
      );
    } else {
      return this.props.children;
    }
  }
}

export default ErrorBoundary;
