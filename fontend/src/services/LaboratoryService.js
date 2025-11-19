/**
 * Laboratory Service - PostgreSQL API
 * Quản lý xét nghiệm thông qua PostgreSQL database
 */

import api from './api.js';

class LaboratoryService {
  static async getAllTests() {
    try {
      const response = await api.get('/laboratory-tests');
      return response.data.data;
    } catch (error) {
      console.error('Error getting all laboratory tests:', error);
      throw error;
    }
  }

  static async getTestById(id) {
    try {
      const response = await api.get(`/laboratory-tests/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting laboratory test by ID:', error);
      throw error;
    }
  }

  static async getTestByTestId(testId) {
    try {
      const response = await api.get(`/laboratory-tests/code/${testId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting laboratory test by test ID:', error);
      throw error;
    }
  }

  static async addTest(testData) {
    try {
      const response = await api.post('/laboratory-tests', testData);
      return response.data.data;
    } catch (error) {
      console.error('Error adding laboratory test:', error);
      throw error;
    }
  }

  static async updateTest(id, testData) {
    try {
      const response = await api.put(`/laboratory-tests/${id}`, testData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating laboratory test:', error);
      throw error;
    }
  }

  static async deleteTest(id) {
    try {
      const response = await api.delete(`/laboratory-tests/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting laboratory test:', error);
      throw error;
    }
  }

  static async searchTests(query) {
    try {
      const response = await api.get(`/laboratory-tests/search?query=${query}`);
      return response.data.data;
    } catch (error) {
      console.error('Error searching laboratory tests:', error);
      throw error;
    }
  }

  static async getTestsByStatus(status) {
    try {
      const response = await api.get(`/laboratory-tests/status/${status}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting laboratory tests by status:', error);
      throw error;
    }
  }

  static async getTestsByPatient(patientId) {
    try {
      const tests = await this.getAllTests();
      return tests.filter(t => t.patient_id === patientId);
    } catch (error) {
      console.error('Error getting laboratory tests by patient:', error);
      throw error;
    }
  }

  static async getTestsByDateRange(startDate, endDate) {
    try {
      const tests = await this.getAllTests();
      return tests.filter(t => {
        const testDate = new Date(t.received_date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return testDate >= start && testDate <= end;
      });
    } catch (error) {
      console.error('Error getting laboratory tests by date range:', error);
      throw error;
    }
  }

  static async getTestsByTechnician(technician) {
    try {
      const tests = await this.getAllTests();
      return tests.filter(t => t.technician === technician);
    } catch (error) {
      console.error('Error getting laboratory tests by technician:', error);
      throw error;
    }
  }

  static async getPendingTests() {
    return this.getTestsByStatus('Chờ xử lý');
  }

  static async getInProgressTests() {
    return this.getTestsByStatus('Đang xét nghiệm');
  }

  static async getCompletedTests() {
    return this.getTestsByStatus('Hoàn thành');
  }

  static async updateTestStatus(id, status, additionalData = {}) {
    try {
      const updateData = {
        status,
        ...additionalData
      };

      // If changing to completed, add timestamp
      if (status === 'Hoàn thành' && !additionalData.completed_date) {
        const now = new Date();
        updateData.completed_date = now.toISOString().split('T')[0];
        updateData.completed_time = now.toTimeString().slice(0, 5);
      }

      return this.updateTest(id, updateData);
    } catch (error) {
      console.error('Error updating laboratory test status:', error);
      throw error;
    }
  }

  static async getStatistics() {
    try {
      const response = await api.get('/laboratory-tests/statistics');
      return response.data.data;
    } catch (error) {
      console.error('Error getting laboratory test statistics:', error);
      throw error;
    }
  }

  static async exportTests() {
    try {
      const tests = await this.getAllTests();
      const dataStr = JSON.stringify(tests, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `laboratory_tests_${new Date().toISOString()}.json`;
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting laboratory tests:', error);
      throw error;
    }
  }

  // Compatibility methods
  static initializeTests() {
    return this.getAllTests();
  }

  static resetToDefault() {
    console.warn('resetToDefault() is not supported with PostgreSQL backend');
    return [];
  }
}

export default LaboratoryService;
