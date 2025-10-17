import { z } from 'zod';

// Basic validation schemas
export const emailSchema = z.string().email('Must be a valid email address');
export const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');
export const urlSchema = z.string().url('Must be a valid URL');

// Auth schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Workflow schemas
export const workflowSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
});

// Node validation schemas
export const httpRequestSchema = z.object({
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], {
    message: 'HTTP method is required',
  }),
  url: urlSchema,
  headers: z.array(z.object({
    key: z.string().min(1, 'Header key is required'),
    value: z.string().min(1, 'Header value is required'),
  })).optional(),
  body: z.string().optional(),
  auth: z.object({
    type: z.enum(['none', 'bearer', 'apikey', 'basic']),
    token: z.string().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
  }),
  timeout: z.number().min(1000).max(300000).optional(), // 1 second to 5 minutes
});

export const conditionSchema = z.object({
  leftOperand: z.string().min(1, 'Left operand is required'),
  operator: z.enum([
    'equals',
    'notEquals',
    'contains',
    'notContains',
    'greaterThan',
    'greaterThanOrEqual',
    'lessThan',
    'lessThanOrEqual',
    'startsWith',
    'endsWith',
    'isEmpty',
    'isNotEmpty'
  ], {
    message: 'Operator is required',
  }),
  rightOperand: z.string().optional(),
});

export const transformSchema = z.object({
  transformType: z.enum(['javascript', 'jsonPath', 'template'], {
    message: 'Transform type is required',
  }),
  code: z.string().min(1, 'Transform code is required'),
  inputMapping: z.record(z.string(), z.string()).optional(),
  outputMapping: z.record(z.string(), z.string()).optional(),
});

export const delaySchema = z.object({
  delayType: z.enum(['fixed', 'dynamic'], {
    message: 'Delay type is required',
  }),
  duration: z.number().min(1, 'Duration must be at least 1 second').optional(),
  durationExpression: z.string().optional(),
  unit: z.enum(['seconds', 'minutes', 'hours', 'days']).optional(),
}).refine((data) => {
  if (data.delayType === 'fixed') {
    return data.duration !== undefined && data.unit !== undefined;
  }
  if (data.delayType === 'dynamic') {
    return data.durationExpression !== undefined;
  }
  return true;
}, {
  message: 'Duration or duration expression is required based on delay type',
});

export const webhookOutputSchema = z.object({
  url: urlSchema,
  method: z.enum(['POST', 'PUT', 'PATCH']),
  headers: z.array(z.object({
    key: z.string().min(1, 'Header key is required'),
    value: z.string().min(1, 'Header value is required'),
  })).optional(),
  bodyTemplate: z.string().optional(),
  auth: z.object({
    type: z.enum(['none', 'bearer', 'apikey', 'basic']),
    token: z.string().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
  }),
  retryPolicy: z.object({
    enabled: z.boolean(),
    maxRetries: z.number().min(0).max(10),
    retryDelay: z.number().min(1000).max(60000), // 1 second to 1 minute
  }).optional(),
});

export const manualTriggerSchema = z.object({
  inputSchema: z.array(z.object({
    name: z.string().min(1, 'Field name is required'),
    type: z.enum(['string', 'number', 'boolean', 'object', 'array']),
    required: z.boolean(),
    description: z.string().optional(),
    defaultValue: z.string().optional(),
  })).optional(),
});

// Node configuration schema union
export const nodeConfigSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('manualTrigger'), config: manualTriggerSchema }),
  z.object({ type: z.literal('httpRequest'), config: httpRequestSchema }),
  z.object({ type: z.literal('condition'), config: conditionSchema }),
  z.object({ type: z.literal('transform'), config: transformSchema }),
  z.object({ type: z.literal('delay'), config: delaySchema }),
  z.object({ type: z.literal('webhookOutput'), config: webhookOutputSchema }),
]);

// Generic node schema
export const nodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  data: z.object({
    label: z.string(),
    type: z.string(),
    config: z.record(z.string(), z.any()),
  }),
});

// Edge schema
export const edgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().optional(),
  targetHandle: z.string().optional(),
});

// Full workflow validation schema
export const fullWorkflowSchema = workflowSchema.extend({
  nodes: z.array(nodeSchema),
  edges: z.array(edgeSchema),
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type WorkflowFormData = z.infer<typeof workflowSchema>;
export type HttpRequestFormData = z.infer<typeof httpRequestSchema>;
export type ConditionFormData = z.infer<typeof conditionSchema>;
export type TransformFormData = z.infer<typeof transformSchema>;
export type DelayFormData = z.infer<typeof delaySchema>;
export type WebhookOutputFormData = z.infer<typeof webhookOutputSchema>;
export type ManualTriggerFormData = z.infer<typeof manualTriggerSchema>;
export type NodeFormData = z.infer<typeof nodeSchema>;
export type EdgeFormData = z.infer<typeof edgeSchema>;
export type FullWorkflowFormData = z.infer<typeof fullWorkflowSchema>;