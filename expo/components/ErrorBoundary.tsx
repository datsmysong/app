import React from "react";

import { RootErrorBoundary } from "./ErrorComponent/RootError";

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
      // default ErrorBoundary fallback
      return <RootErrorBoundary />;
    } else {
      return this.props.children;
    }
  }
}

export default ErrorBoundary;
