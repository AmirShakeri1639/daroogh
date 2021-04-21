import { api } from 'config/default.json';

export const getBaseUrl = (): string => {
  return (
    window.location.host.startsWith('tabadol') 
    ? api.baseUrl
    : api.baseUrlBeta
  )
}
