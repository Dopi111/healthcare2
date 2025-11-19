/**
 * Test Result Service - PostgreSQL API
 * Quản lý kết quả xét nghiệm thông qua PostgreSQL database
 */

import api from './api.js';

class TestResultService {
  static async getAllTestResults() {
    try {
      const response = await api.get('/test-results-new');
      return response.data.data;
    } catch (error) {
      console.error('Error getting all test results:', error);
      throw error;
    }
  }

  static async getTestResultById(id) {
    try {
      const response = await api.get(`/test-results-new/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting test result by ID:', error);
      throw error;
    }
  }

  static async getTestResultByTestId(testId) {
    try {
      const response = await api.get(`/test-results-new/code/${testId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting test result by test ID:', error);
      throw error;
    }
  }

  static async addTestResult(testData) {
    try {
      const response = await api.post('/test-results-new', testData);
      return response.data.data;
    } catch (error) {
      console.error('Error adding test result:', error);
      throw error;
    }
  }

  static async updateTestResult(id, testData) {
    try {
      const response = await api.put(`/test-results-new/${id}`, testData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating test result:', error);
      throw error;
    }
  }

  static async deleteTestResult(id) {
    try {
      const response = await api.delete(`/test-results-new/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting test result:', error);
      throw error;
    }
  }

  static async searchTestResults(query) {
    try {
      const response = await api.get(`/test-results-new/search?query=${query}`);
      return response.data.data;
    } catch (error) {
      console.error('Error searching test results:', error);
      throw error;
    }
  }

  static async getTestResultsByPatient(patientId) {
    try {
      const response = await api.get(`/test-results-new/patient/${patientId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting test results by patient:', error);
      throw error;
    }
  }

  static async getTestResultsByStatus(status) {
    try {
      const response = await api.get(`/test-results-new/status/${status}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting test results by status:', error);
      throw error;
    }
  }

  static async getTestResultsByDoctor(doctorName) {
    try {
      const response = await api.get(`/test-results-new/doctor/${encodeURIComponent(doctorName)}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting test results by doctor:', error);
      throw error;
    }
  }

  static async exportTestResults() {
    try {
      const tests = await this.getAllTestResults();
      const dataStr = JSON.stringify(tests, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `test_results_${new Date().toISOString()}.json`;
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting test results:', error);
      throw error;
    }
  }

  // Compatibility methods
  static initializeTestResults() {
    return this.getAllTestResults();
  }

  static resetToDefault() {
    console.warn('resetToDefault() is not supported with PostgreSQL backend');
    return [];
  }
}

export default TestResultService;
