/**
 * Expense Service - PostgreSQL API
 * Quản lý chi phí thông qua PostgreSQL database
 */

import api from './api.js';

class ExpenseService {
  static async getAllExpenses() {
    try {
      const response = await api.get('/expenses-new');
      return response.data.data;
    } catch (error) {
      console.error('Error getting all expenses:', error);
      throw error;
    }
  }

  static async getExpenseById(id) {
    try {
      const response = await api.get(`/expenses-new/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting expense by ID:', error);
      throw error;
    }
  }

  static async addExpense(expenseData) {
    try {
      const response = await api.post('/expenses-new', expenseData);
      return response.data.data;
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  }

  static async updateExpense(id, expenseData) {
    try {
      const response = await api.put(`/expenses-new/${id}`, expenseData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  }

  static async deleteExpense(id) {
    try {
      const response = await api.delete(`/expenses-new/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  }

  static async getStatistics() {
    try {
      const response = await api.get('/expenses-new/statistics');
      return response.data.data;
    } catch (error) {
      console.error('Error getting expense statistics:', error);
      throw error;
    }
  }

  static async exportExpenses() {
    try {
      const expenses = await this.getAllExpenses();
      const dataStr = JSON.stringify(expenses, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `expenses_${new Date().toISOString()}.json`;
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting expenses:', error);
      throw error;
    }
  }

  // Compatibility methods
  static initializeExpenses() {
    return this.getAllExpenses();
  }

  static resetToDefault() {
    console.warn('resetToDefault() is not supported with PostgreSQL backend');
    return [];
  }
}

export default ExpenseService;
