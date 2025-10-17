import { useState } from 'react';
import {
  Box,
  Button,
  Input,
  VStack,
  HStack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { FaPlus, FaTrash } from 'react-icons/fa6';
import type { HttpRequestFormData } from '../../utils/validators';

interface HttpRequestFormProps {
  onSubmit: (data: HttpRequestFormData) => void;
  defaultValues?: Partial<HttpRequestFormData>;
  isLoading?: boolean;
}

/**
 * HttpRequestForm - Simple form component for configuring HTTP request nodes
 */
const HttpRequestForm = ({ 
  onSubmit, 
  defaultValues = {
    method: 'GET',
    url: '',
    auth: { type: 'none' },
    headers: [],
  }, 
  isLoading = false 
}: HttpRequestFormProps) => {
  const [formData, setFormData] = useState<HttpRequestFormData>({
    method: defaultValues.method || 'GET',
    url: defaultValues.url || '',
    body: defaultValues.body || '',
    headers: defaultValues.headers || [],
    auth: defaultValues.auth || { type: 'none' },
    timeout: defaultValues.timeout || 30000,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.url) {
      newErrors.url = 'URL is required';
    } else {
      try {
        new URL(formData.url);
      } catch {
        newErrors.url = 'Invalid URL format';
      }
    }

    if (formData.timeout && (formData.timeout < 1000 || formData.timeout > 300000)) {
      newErrors.timeout = 'Timeout must be between 1000ms and 300000ms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const addHeader = () => {
    setFormData(prev => ({
      ...prev,
      headers: [...(prev.headers || []), { key: '', value: '' }]
    }));
  };

  const removeHeader = (index: number) => {
    setFormData(prev => ({
      ...prev,
      headers: (prev.headers || []).filter((_, i) => i !== index)
    }));
  };

  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      headers: (prev.headers || []).map((header, i) => 
        i === index ? { ...header, [field]: value } : header
      )
    }));
  };

  const showBodyField = ['POST', 'PUT', 'PATCH'].includes(formData.method);

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack gap={4} align="stretch">
        {/* HTTP Method */}
        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={2}>HTTP Method</Text>
          <select
            value={formData.method}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              method: e.target.value as any 
            }))}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
          </select>
        </Box>

        {/* URL */}
        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={2}>URL *</Text>
          <Input
            value={formData.url}
            onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
            placeholder="https://api.example.com/endpoint"
            borderColor={errors.url ? 'red.300' : undefined}
          />
          {errors.url && (
            <Text color="red.500" fontSize="sm" mt={1}>{errors.url}</Text>
          )}
        </Box>

        {/* Request Body (for POST, PUT, PATCH) */}
        {showBodyField && (
          <Box>
            <Text fontSize="sm" fontWeight="medium" mb={2}>Request Body</Text>
            <Textarea
              value={formData.body || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
              placeholder="JSON body or template variables..."
              rows={4}
            />
          </Box>
        )}

        {/* Headers */}
        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={2}>Headers</Text>
          <VStack gap={2} align="stretch">
            {(formData.headers || []).map((header, index) => (
              <HStack key={index} gap={2}>
                <Input
                  value={header.key}
                  onChange={(e) => updateHeader(index, 'key', e.target.value)}
                  placeholder="Header name"
                  flex={1}
                />
                <Input
                  value={header.value}
                  onChange={(e) => updateHeader(index, 'value', e.target.value)}
                  placeholder="Header value"
                  flex={1}
                />
                <Button
                  onClick={() => removeHeader(index)}
                  size="sm"
                  colorPalette="red"
                  variant="ghost"
                >
                  <FaTrash size={12} />
                </Button>
              </HStack>
            ))}
            <Button
              onClick={addHeader}
              size="sm"
              variant="outline"
            >
              <FaPlus size={12} style={{ marginRight: '8px' }} />
              Add Header
            </Button>
          </VStack>
        </Box>

        {/* Authentication */}
        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={2}>Authentication</Text>
          <VStack gap={3} align="stretch">
            <select
              value={formData.auth.type}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                auth: { ...prev.auth, type: e.target.value as any } 
              }))}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            >
              <option value="none">None</option>
              <option value="bearer">Bearer Token</option>
              <option value="apikey">API Key</option>
              <option value="basic">Basic Auth</option>
            </select>

            {formData.auth.type === 'bearer' && (
              <Box>
                <Text fontSize="sm" mb={2}>Bearer Token</Text>
                <Input
                  value={formData.auth.token || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    auth: { ...prev.auth, token: e.target.value } 
                  }))}
                  placeholder="Token value or template variable"
                  type="password"
                />
              </Box>
            )}

            {formData.auth.type === 'apikey' && (
              <Box>
                <Text fontSize="sm" mb={2}>API Key</Text>
                <Input
                  value={formData.auth.token || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    auth: { ...prev.auth, token: e.target.value } 
                  }))}
                  placeholder="API key value or template variable"
                  type="password"
                />
              </Box>
            )}

            {formData.auth.type === 'basic' && (
              <HStack gap={2}>
                <Box flex={1}>
                  <Text fontSize="sm" mb={2}>Username</Text>
                  <Input
                    value={formData.auth.username || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      auth: { ...prev.auth, username: e.target.value } 
                    }))}
                    placeholder="Username"
                  />
                </Box>
                <Box flex={1}>
                  <Text fontSize="sm" mb={2}>Password</Text>
                  <Input
                    value={formData.auth.password || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      auth: { ...prev.auth, password: e.target.value } 
                    }))}
                    placeholder="Password"
                    type="password"
                  />
                </Box>
              </HStack>
            )}
          </VStack>
        </Box>

        {/* Timeout */}
        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={2}>Timeout (milliseconds)</Text>
          <Input
            type="number"
            value={formData.timeout || 30000}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              timeout: parseInt(e.target.value) || undefined 
            }))}
            placeholder="30000"
            min={1000}
            max={300000}
            borderColor={errors.timeout ? 'red.300' : undefined}
          />
          <Text fontSize="sm" color="gray.500" mt={1}>
            Default: 30 seconds (30000ms). Min: 1 second, Max: 5 minutes
          </Text>
          {errors.timeout && (
            <Text color="red.500" fontSize="sm" mt={1}>{errors.timeout}</Text>
          )}
        </Box>

        {/* Submit Button */}
        <HStack justify="flex-end" pt={4}>
          <Button
            type="submit"
            colorPalette="blue"
            loading={isLoading}
          >
            Save Configuration
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default HttpRequestForm;