import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Healthcare Management API',
      version: '1.0.0',
      description: 'REST API cho Hệ thống Quản lý Bệnh viện - Demo cho Giáo viên',
      contact: {
        name: 'Healthcare Team',
        email: 'support@healthcare.vn'
      }
    },
    servers: [
      {
        url: 'http://localhost:5001',
        description: 'Development server'
      }
    ],
    tags: [
      { name: 'Laboratory', description: 'Quản lý xét nghiệm' },
      { name: 'Fund', description: 'Quản lý quỹ' },
      { name: 'Revenue', description: 'Doanh thu khám chữa bệnh' },
      { name: 'Insurance', description: 'Thanh toán bảo hiểm' },
      { name: 'Expense', description: 'Chi phí hoạt động' },
      { name: 'Patient', description: 'Quản lý bệnh nhân' },
      { name: 'Schedule', description: 'Lịch làm việc' },
      { name: 'Account', description: 'Quản lý tài khoản' },
      { name: 'Department', description: 'Danh sách phòng ban' },
      { name: 'Position', description: 'Danh sách chức vụ' }
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            error: { type: 'string' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js'] // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
