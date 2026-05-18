import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.response.use(
  res => res,
  err => Promise.reject(err),
)

export async function fetchWaitlistData() {
  const response = await apiClient.post('', { baseURL: import.meta.env.VITE_API_URL })
  return response.data
}

/**
 * Normalizes both the example API format and the actual gonoise format into
 * a consistent shape the dashboard expects.
 *
 * Actual API fields: { id, original_email, email_hash, email_cipher, status, created_at, updated_at }
 * Example API fields: { email, createdAt, source, country, device }
 */
export function transformApiData(rawItems) {
  return rawItems.map((item, i) => ({
    id:        item.id          || `item-${i}`,
    email:     item.original_email || item.email || '',
    createdAt: item.created_at  || item.createdAt || new Date().toISOString(),
    source:    item.source      || null,
    country:   item.country     || null,
    device:    item.device      || null,
    status:    item.status      || '1',
  }))
}

export default apiClient
