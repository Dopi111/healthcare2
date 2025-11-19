/**
 * Patient Service - PostgreSQL API
 * Quản lý bệnh nhân thông qua PostgreSQL database
 */

import api from './api.js';

class PatientService {
  /**
   * Lấy tất cả bệnh nhân
   */
  static async getAllPatients() {
    try {
      const response = await api.get('/patients-new');
      return response.data.data;
    } catch (error) {
      console.error('Error getting all patients:', error);
      throw error;
    }
  }

  /**
   * Lấy bệnh nhân theo ID
   */
  static async getPatientById(id) {
    try {
      const response = await api.get(`/patients-new/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting patient by ID:', error);
      throw error;
    }
  }

  /**
   * Lấy bệnh nhân theo mã bệnh nhân
   */
  static async getPatientByPatientId(patientId) {
    try {
      const response = await api.get(`/patients-new/code/${patientId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting patient by code:', error);
      throw error;
    }
  }

  /**
   * Thêm bệnh nhân mới
   */
  static async addPatient(patientData) {
    try {
      const response = await api.post('/patients-new', patientData);
      return response.data.data;
    } catch (error) {
      console.error('Error adding patient:', error);
      throw error;
    }
  }

  /**
   * Cập nhật bệnh nhân
   */
  static async updatePatient(id, patientData) {
    try {
      const response = await api.put(`/patients-new/${id}`, patientData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating patient:', error);
      throw error;
    }
  }

  /**
   * Xóa bệnh nhân
   */
  static async deletePatient(id) {
    try {
      const response = await api.delete(`/patients-new/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting patient:', error);
      throw error;
    }
  }

  /**
   * Tìm kiếm bệnh nhân
   */
  static async searchPatients(query) {
    try {
      const response = await api.get(`/patients-new/search?query=${query}`);
      return response.data.data;
    } catch (error) {
      console.error('Error searching patients:', error);
      throw error;
    }
  }

  /**
   * Lấy bệnh nhân theo trạng thái
   */
  static async getPatientsByStatus(status) {
    try {
      const response = await api.get(`/patients-new/status/${status}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting patients by status:', error);
      throw error;
    }
  }

  /**
   * Lấy bệnh nhân theo bác sĩ
   */
  static async getPatientsByDoctor(doctorName) {
    try {
      const response = await api.get(`/patients-new/doctor/${encodeURIComponent(doctorName)}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting patients by doctor:', error);
      throw error;
    }
  }

  /**
   * Export patients to JSON (for backup)
   */
  static async exportPatients() {
    try {
      const patients = await this.getAllPatients();
      const dataStr = JSON.stringify(patients, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `patients_${new Date().toISOString()}.json`;
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting patients:', error);
      throw error;
    }
  }

  // Compatibility methods (để không break existing code)
  static initializePatients() {
    return this.getAllPatients();
  }

  static resetToDefault() {
    console.warn('resetToDefault() is not supported with PostgreSQL backend');
    return [];
  }
}

export default PatientService;
