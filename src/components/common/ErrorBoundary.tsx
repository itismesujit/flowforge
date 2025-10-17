import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Center, Text, Button, Stack, Box, Code } from '@chakra-ui/react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary - Catches JavaScript errors anywhere in the child component tree
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <Center minH="100vh" p={8}>
          <Stack gap={6} maxW="600px" textAlign="center">
            <Text fontSize="2xl" fontWeight="bold" color="red.500">
              Something went wrong
            </Text>
            
            <Text color="gray.600">
              An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
            </Text>

            <Stack gap={3} direction={{ base: 'column', md: 'row' }} justify="center">
              <Button onClick={this.handleReset} colorPalette="blue">
                Try Again
              </Button>
              <Button onClick={this.handleReload} variant="outline">
                Reload Page
              </Button>
            </Stack>

            {/* Show error details in development */}
            {import.meta.env.DEV && this.state.error && (
              <Box
                mt={8}
                p={4}
                bg="gray.100"
                borderRadius="md"
                textAlign="left"
                maxH="300px"
                overflow="auto"
              >
                <Text fontWeight="bold" mb={2}>
                  Error Details:
                </Text>
                <Code display="block" whiteSpace="pre-wrap" fontSize="sm">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </Code>
              </Box>
            )}
          </Stack>
        </Center>
      );
    }

    return this.props.children;
  }
}

/**
 * withErrorBoundary - HOC to wrap components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}