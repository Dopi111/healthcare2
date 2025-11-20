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
      // Core Management
      { name: 'Employees', description: 'Quản lý nhân viên' },
      { name: 'Account', description: 'Quản lý tài khoản' },
      { name: 'Department', description: 'Danh sách phòng ban' },
      { name: 'Position', description: 'Danh sách chức vụ' },

      // User Management
      { name: 'User Auth', description: 'Đăng nhập/Đăng ký người dùng' },
      { name: 'User Profile', description: 'Hồ sơ người dùng' },
      { name: 'Patients', description: 'Thông tin bệnh nhân (từ infor_users)' },

      // Medical Management
      { name: 'Appointments', description: 'Quản lý lịch hẹn' },
      { name: 'Lab Results', description: 'Kết quả xét nghiệm (user)' },

      // Database-backed APIs (PostgreSQL)
      { name: 'Patients New', description: 'Quản lý hồ sơ bệnh nhân (PostgreSQL)' },
      { name: 'Laboratory Tests', description: 'Quản lý xét nghiệm (PostgreSQL)' },
      { name: 'Test Results New', description: 'Kết quả xét nghiệm (PostgreSQL)' },
      { name: 'Expenses New', description: 'Quản lý chi phí (PostgreSQL)' },
      { name: 'Funds New', description: 'Quản lý quỹ tài chính (PostgreSQL)' },
      { name: 'Revenue New', description: 'Quản lý doanh thu (PostgreSQL)' },
      { name: 'Insurance New', description: 'Quản lý bảo hiểm (PostgreSQL)' }
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
