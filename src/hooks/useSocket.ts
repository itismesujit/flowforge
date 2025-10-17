import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketState {
  socket: Socket | null;
  connected: boolean;
  connecting: boolean;
  error: string | null;
}

/**
 * useSocket - Custom hook for managing Socket.io connection
 */
export const useSocket = () => {
  const [state, setState] = useState<SocketState>({
    socket: null,
    connected: false,
    connecting: false,
    error: null,
  });

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');

    if (!token) {
      setState(prev => ({ 
        ...prev, 
        error: 'No authentication token found' 
      }));
      return;
    }

    setState(prev => ({ ...prev, connecting: true, error: null }));

    const socketInstance = io(socketUrl, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
      timeout: 5000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
      setState(prev => ({ 
        ...prev, 
        connected: true, 
        connecting: false, 
        error: null 
      }));
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setState(prev => ({ 
        ...prev, 
        connected: false, 
        connecting: false 
      }));
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setState(prev => ({ 
        ...prev, 
        connected: false, 
        connecting: false, 
        error: error.message 
      }));
    });

    socketInstance.on('error', (error) => {
      console.error('Socket error:', error);
      setState(prev => ({ 
        ...prev, 
        error: error.message || 'Unknown socket error' 
      }));
    });

    setState(prev => ({ ...prev, socket: socketInstance }));

    return () => {
      console.log('Cleaning up socket connection');
      socketInstance.disconnect();
    };
  }, []); // Empty dependency array means this runs once on mount

  const reconnect = useCallback(() => {
    if (state.socket && !state.connected) {
      setState(prev => ({ ...prev, connecting: true, error: null }));
      state.socket.connect();
    }
  }, [state.socket, state.connected]);

  return { 
    socket: state.socket, 
    connected: state.connected,
    connecting: state.connecting,
    error: state.error,
    reconnect,
  };
};