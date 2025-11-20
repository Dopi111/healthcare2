/**
 * Revenue Service - PostgreSQL API
 * Quản lý doanh thu thông qua PostgreSQL database
 */

import api from './api.js';

class RevenueService {
  static async getAllRevenue() {
    try {
      const response = await api.get('/revenue-new');
      return response.data.data;
    } catch (error) {
      console.error('Error getting all revenue:', error);
      throw error;
    }
  }

  static async getRevenueById(id) {
    try {
      const response = await api.get(`/revenue-new/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting revenue by ID:', error);
      throw error;
    }
  }

  static async getRevenueByMonth(month) {
    try {
      const response = await api.get(`/revenue-new/month/${month}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting revenue by month:', error);
      throw error;
    }
  }

  static async addRevenue(revenueData) {
    try {
      const response = await api.post('/revenue-new', revenueData);
      return response.data.data;
    } catch (error) {
      console.error('Error adding revenue:', error);
      throw error;
    }
  }

  static async updateRevenue(id, revenueData) {
    try {
      const response = await api.put(`/revenue-new/${id}`, revenueData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating revenue:', error);
      throw error;
    }
  }

  static async deleteRevenue(id) {
    try {
      const response = await api.delete(`/revenue-new/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting revenue:', error);
      throw error;
    }
  }

  static async getStatistics() {
    try {
      const response = await api.get('/revenue-new/statistics');
      return response.data.data;
    } catch (error) {
      console.error('Error getting revenue statistics:', error);
      throw error;
    }
  }

  static async getMonthlyComparison(months = 6) {
    try {
      const response = await api.get(`/revenue-new/monthly-comparison?months=${months}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting monthly comparison:', error);
      throw error;
    }
  }

  static async exportRevenue() {
    try {
      const revenue = await this.getAllRevenue();
      const dataStr = JSON.stringify(revenue, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `revenue_${new Date().toISOString()}.json`;
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting revenue:', error);
      throw error;
    }
  }

  // Compatibility methods
  static initializeRevenue() {
    return this.getAllRevenue();
  }

  static resetToDefault() {
    console.warn('resetToDefault() is not supported with PostgreSQL backend');
    return [];
  }
}

export default RevenueService;
