import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { Center, Spinner, Text, Stack } from '@chakra-ui/react';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;  
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  } | null;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  fallback?: React.ReactNode;
}

/**
 * ProtectedRoute - Wrapper component for handling authentication and authorization
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  fallback,
}) => {
  const { isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth
  ) as AuthState;

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Center minH="100vh">
        <Stack gap={4} alignItems="center">
          <Spinner size="lg" color="blue.500" />
          <Text color="gray.600">Checking authentication...</Text>
        </Stack>
      </Center>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <Center minH="100vh">
        <Stack gap={4} alignItems="center">
          <Text fontSize="xl" color="red.500">
            Authentication Required
          </Text>
          <Text color="gray.600">
            Please log in to access this page.
          </Text>
        </Stack>
      </Center>
    );
  }

  // If authentication is not required but user is authenticated
  // (for login/register pages)
  if (!requireAuth && isAuthenticated) {
    return (
      <Center minH="100vh">
        <Stack gap={4} alignItems="center">
          <Text fontSize="xl" color="blue.500">
            Already Logged In
          </Text>
          <Text color="gray.600">
            You are already authenticated.
          </Text>
        </Stack>
      </Center>
    );
  }

  // Render children if all checks pass
  return <>{children}</>;
};

/**
 * AdminRoute - Protected route that requires admin privileges
 */
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, user } = useAppSelector(
    (state) => state.auth
  ) as AuthState;

  if (!isAuthenticated) {
    return (
      <ProtectedRoute requireAuth={true}>
        {children}
      </ProtectedRoute>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <Center minH="50vh">
        <Stack gap={4} alignItems="center">
          <Text fontSize="xl" color="red.500">
            Access Denied
          </Text>
          <Text color="gray.600">
            You don't have permission to access this page.
          </Text>
        </Stack>
      </Center>
    );
  }

  return <>{children}</>;
};

/**
 * GuestRoute - Route that only allows non-authenticated users
 */
export const GuestRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ProtectedRoute requireAuth={false}>
      {children}
    </ProtectedRoute>
  );
};