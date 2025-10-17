/**
 * Format date to a readable string
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date: string | Date): string => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Generate a unique ID
 * @returns {string} Unique identifier
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(func: T, wait: number) => {
  let timeout: number | undefined;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Deep clone an object
 * @param {any} obj - Object to clone
 * @returns {any} Cloned object
 */
export const deepClone = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map((item: any) => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Get status color for Chakra UI
 * @param {string} status - Status string
 * @returns {string} Color scheme
 */
export const getStatusColor = (status: string): string => {
  const statusColors = {
    draft: 'gray',
    published: 'green',
    archived: 'orange',
    pending: 'yellow',
    running: 'blue',
    completed: 'green',
    failed: 'red',
    cancelled: 'gray',
  };
  return (statusColors as any)[status] || 'gray';
};

/**
 * Convert bytes to human readable format
 * @param {number} bytes - Bytes to convert
 * @returns {string} Human readable size
 */
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Parse template variables from string
 * @param {string} template - Template string with {{variable}} syntax
 * @returns {string[]} Array of variable names
 */
export const parseTemplateVariables = (template: string): string[] => {
  if (!template) return [];
  const regex = /\{\{([^}]+)\}\}/g;
  const variables = [];
  let match;
  while ((match = regex.exec(template)) !== null) {
    variables.push(match[1].trim());
  }
  return variables;
};

/**
 * Replace template variables in string
 * @param {string} template - Template string
 * @param {Object} variables - Variable values
 * @returns {string} String with variables replaced
 */
export const replaceTemplateVariables = (template: string, variables: any = {}): string => {
  if (!template) return '';
  return template.replace(/\{\{([^}]+)\}\}/g, (match: string, variable: string) => {
    const path = variable.trim().split('.');
    let value = variables;
    for (const key of path) {
      value = (value as any)?.[key];
      if (value === undefined) break;
    }
    return value !== undefined ? String(value) : match;
  });
};