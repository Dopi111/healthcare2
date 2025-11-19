/**
 * Fund Service - PostgreSQL API
 * Quản lý quỹ tài chính thông qua PostgreSQL database
 */

import api from './api.js';

class FundService {
  static async getAllFunds() {
    try {
      const response = await api.get('/funds-new');
      return response.data.data;
    } catch (error) {
      console.error('Error getting all funds:', error);
      throw error;
    }
  }

  static async getFundById(id) {
    try {
      const response = await api.get(`/funds-new/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting fund by ID:', error);
      throw error;
    }
  }

  static async addFund(fundData) {
    try {
      const response = await api.post('/funds-new', fundData);
      return response.data.data;
    } catch (error) {
      console.error('Error adding fund:', error);
      throw error;
    }
  }

  static async updateFund(id, fundData) {
    try {
      const response = await api.put(`/funds-new/${id}`, fundData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating fund:', error);
      throw error;
    }
  }

  static async deleteFund(id) {
    try {
      const response = await api.delete(`/funds-new/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting fund:', error);
      throw error;
    }
  }

  static async getStatistics() {
    try {
      const response = await api.get('/funds-new/statistics');
      return response.data.data;
    } catch (error) {
      console.error('Error getting fund statistics:', error);
      throw error;
    }
  }

  static async searchFunds(query) {
    try {
      const funds = await this.getAllFunds();
      const q = query.toLowerCase();
      return funds.filter(f =>
        f.transaction_code?.toLowerCase().includes(q) ||
        f.category?.toLowerCase().includes(q) ||
        f.description?.toLowerCase().includes(q)
      );
    } catch (error) {
      console.error('Error searching funds:', error);
      throw error;
    }
  }

  static async getFundsByType(type) {
    try {
      const funds = await this.getAllFunds();
      return funds.filter(f => f.type === type);
    } catch (error) {
      console.error('Error getting funds by type:', error);
      throw error;
    }
  }

  static async getFundsByCategory(category) {
    try {
      const funds = await this.getAllFunds();
      return funds.filter(f => f.category === category);
    } catch (error) {
      console.error('Error getting funds by category:', error);
      throw error;
    }
  }

  static async getFundsByDateRange(startDate, endDate) {
    try {
      const funds = await this.getAllFunds();
      return funds.filter(f => {
        const fundDate = new Date(f.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return fundDate >= start && fundDate <= end;
      });
    } catch (error) {
      console.error('Error getting funds by date range:', error);
      throw error;
    }
  }

  static async getMonthlyTrend(months = 6) {
    try {
      const funds = await this.getAllFunds();
      const monthlyData = {};

      funds.forEach(f => {
        const month = f.date.substring(0, 7); // YYYY-MM
        if (!monthlyData[month]) {
          monthlyData[month] = { income: 0, expense: 0 };
        }
        if (f.type === 'Thu') {
          monthlyData[month].income += parseFloat(f.amount);
        } else {
          monthlyData[month].expense += parseFloat(f.amount);
        }
      });

      return Object.entries(monthlyData)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .slice(-months)
        .map(([month, data]) => ({
          month,
          income: data.income,
          expense: data.expense,
          net: data.income - data.expense
        }));
    } catch (error) {
      console.error('Error getting monthly trend:', error);
      throw error;
    }
  }

  static async exportFunds() {
    try {
      const funds = await this.getAllFunds();
      const dataStr = JSON.stringify(funds, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `funds_${new Date().toISOString()}.json`;
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting funds:', error);
      throw error;
    }
  }

  // Compatibility methods
  static initializeFunds() {
    return this.getAllFunds();
  }

  static resetToDefault() {
    console.warn('resetToDefault() is not supported with PostgreSQL backend');
    return [];
  }
}

export default FundService;
