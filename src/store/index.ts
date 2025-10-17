import { configureStore } from '@reduxjs/toolkit';
import workflowReducer from '../features/workflow/workflowSlice.ts';
import authReducer from '../features/auth/authSlice.ts';
import canvasReducer from '../features/canvas/canvasSlice.ts';
import executionReducer from '../features/execution/executionSlice.ts';

export const store = configureStore({
  reducer: {
    workflow: workflowReducer,
    auth: authReducer,
    canvas: canvasReducer,
    execution: executionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;