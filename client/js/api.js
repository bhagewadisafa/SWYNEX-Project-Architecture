/**
 * CampusDesk - Centralized API Service Wrapper
 * Handles network requests, headers, and authentication tokens
 */

const API_BASE = '/api';

const api = {
  /**
   * Helper to execute HTTP requests
   */
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('campusdesk_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    };

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error(`[API Error] ${endpoint}:`, error.message);
      throw error;
    }
  },

  // Auth APIs
  login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  getProfile() {
    return this.request('/auth/profile');
  },

  // Service Request APIs
  getRequests(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/requests${query ? `?${query}` : ''}`);
  },

  getRequestById(id) {
    return this.request(`/requests/${id}`);
  },

  createRequest(requestData) {
    return this.request('/requests', {
      method: 'POST',
      body: JSON.stringify(requestData)
    });
  },

  updateRequestStatus(id, status, adminRemarks) {
    return this.request(`/requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, adminRemarks })
    });
  },

  deleteRequest(id) {
    return this.request(`/requests/${id}`, {
      method: 'DELETE'
    });
  },

  getStats() {
    return this.request('/requests/stats');
  }
};
