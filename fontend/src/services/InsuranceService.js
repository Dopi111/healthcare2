/**
 * Insurance Service - PostgreSQL API
 * Quản lý bảo hiểm thông qua PostgreSQL database
 */

import api from './api.js';

class InsuranceService {
  static async getAllInsurance() {
    try {
      const response = await api.get('/insurance-new');
      return response.data.data;
    } catch (error) {
      console.error('Error getting all insurance:', error);
      throw error;
    }
  }

  static async getInsuranceById(id) {
    try {
      const response = await api.get(`/insurance-new/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting insurance by ID:', error);
      throw error;
    }
  }

  static async addInsurance(insuranceData) {
    try {
      const response = await api.post('/insurance-new', insuranceData);
      return response.data.data;
    } catch (error) {
      console.error('Error adding insurance:', error);
      throw error;
    }
  }

  static async updateInsurance(id, insuranceData) {
    try {
      const response = await api.put(`/insurance-new/${id}`, insuranceData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating insurance:', error);
      throw error;
    }
  }

  static async deleteInsurance(id) {
    try {
      const response = await api.delete(`/insurance-new/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting insurance:', error);
      throw error;
    }
  }

  static async getStatistics() {
    try {
      const response = await api.get('/insurance-new/statistics');
      return response.data.data;
    } catch (error) {
      console.error('Error getting insurance statistics:', error);
      throw error;
    }
  }

  static async exportInsurance() {
    try {
      const insurance = await this.getAllInsurance();
      const dataStr = JSON.stringify(insurance, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `insurance_${new Date().toISOString()}.json`;
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting insurance:', error);
      throw error;
    }
  }

  // Compatibility methods
  static initializeInsurance() {
    return this.getAllInsurance();
  }

  static resetToDefault() {
    console.warn('resetToDefault() is not supported with PostgreSQL backend');
    return [];
  }
}

export default InsuranceService;
