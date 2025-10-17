export const NODE_TYPES = {
  MANUAL_TRIGGER: 'manualTrigger',
  HTTP_REQUEST: 'httpRequest',
  CONDITION: 'condition',
  TRANSFORM: 'transform',
  DELAY: 'delay',
  WEBHOOK_OUTPUT: 'webhookOutput',
};

export const NODE_CATEGORIES = {
  TRIGGERS: 'triggers',
  ACTIONS: 'actions',
  LOGIC: 'logic',
  OUTPUTS: 'outputs',
};

export const NODE_DEFINITIONS = [
  {
    id: NODE_TYPES.MANUAL_TRIGGER,
    label: 'Manual Trigger',
    category: NODE_CATEGORIES.TRIGGERS,
    icon: 'play',
    description: 'Start workflow manually',
    color: 'green',
    hasInput: false,
    hasOutput: true,
    outputSchema: ['timestamp', 'userId'],
  },
  {
    id: NODE_TYPES.HTTP_REQUEST,
    label: 'HTTP Request',
    category: NODE_CATEGORIES.ACTIONS,
    icon: 'globe',
    description: 'Make HTTP API calls',
    color: 'blue',
    hasInput: true,
    hasOutput: true,
    outputSchema: ['status', 'data', 'headers'],
  },
  {
    id: NODE_TYPES.CONDITION,
    label: 'Condition',
    category: NODE_CATEGORIES.LOGIC,
    icon: 'branch',
    description: 'Branch workflow based on conditions',
    color: 'orange',
    hasInput: true,
    hasOutput: true,
    outputSchema: ['result', 'matched'],
  },
  {
    id: NODE_TYPES.TRANSFORM,
    label: 'Transform Data',
    category: NODE_CATEGORIES.ACTIONS,
    icon: 'transform',
    description: 'Transform and manipulate data',
    color: 'purple',
    hasInput: true,
    hasOutput: true,
    outputSchema: ['transformedData'],
  },
  {
    id: NODE_TYPES.DELAY,
    label: 'Delay',
    category: NODE_CATEGORIES.LOGIC,
    icon: 'clock',
    description: 'Wait for a specified duration',
    color: 'gray',
    hasInput: true,
    hasOutput: true,
    outputSchema: ['delayedAt'],
  },
  {
    id: NODE_TYPES.WEBHOOK_OUTPUT,
    label: 'Webhook Output',
    category: NODE_CATEGORIES.OUTPUTS,
    icon: 'send',
    description: 'Send data via webhook',
    color: 'red',
    hasInput: true,
    hasOutput: false,
    outputSchema: [],
  },
];

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  WORKFLOWS: {
    LIST: '/workflows',
    CREATE: '/workflows',
    GET: (id: string) => `/workflows/${id}`,
    UPDATE: (id: string) => `/workflows/${id}`,
    DELETE: (id: string) => `/workflows/${id}`,
    EXECUTE: (id: string) => `/workflows/${id}/execute`,
  },
  EXECUTIONS: {
    LIST: '/executions',
    GET: (id: string) => `/executions/${id}`,
    CANCEL: (id: string) => `/executions/${id}/cancel`,
  },
};

export const SOCKET_EVENTS = {
  EXECUTION_UPDATE: 'execution:update',
  EXECUTION_COMPLETE: 'execution:complete',
  EXECUTION_ERROR: 'execution:error',
  SUBSCRIBE_EXECUTION: 'subscribe:execution',
  UNSUBSCRIBE_EXECUTION: 'unsubscribe:execution',
};

export const WORKFLOW_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
};

export const EXECUTION_STATUS = {
  PENDING: 'pending',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
};