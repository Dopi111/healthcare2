#!/bin/bash

# Database Recovery Script
# Recreates all tables and restores default data

set -e

echo "=========================================="
echo "🔧 DATABASE RECOVERY - STARTING..."
echo "=========================================="
echo ""

# Database config
PG_USER="${PG_USER:-postgres}"
PG_DATABASE="${PG_DATABASE:-healthcare_db}"
PG_HOST="${PG_HOST:-localhost}"
PG_PORT="${PG_PORT:-5432}"

echo "📊 Database Configuration:"
echo "  Host: $PG_HOST"
echo "  Port: $PG_PORT"
echo "  Database: $PG_DATABASE"
echo "  User: $PG_USER"
echo ""

# Check current tables
echo "📋 Checking current database state..."
CURRENT_TABLES=$(psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d "$PG_DATABASE" -t -c "SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public';" 2>/dev/null || echo "0")
echo "  Current tables: $CURRENT_TABLES"
echo ""

# Run clean migration
echo "🚀 Running clean migration (creates all tables)..."
echo "  File: src/migrations/000_clean_migration.sql"
echo ""

if psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d "$PG_DATABASE" -f src/migrations/000_clean_migration.sql; then
    echo ""
    echo "✅ Migration completed successfully!"
else
    echo ""
    echo "❌ Migration failed!"
    exit 1
fi

# Verify tables
echo ""
echo "📊 Verifying database state..."
NEW_TABLES=$(psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d "$PG_DATABASE" -t -c "SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public';" 2>/dev/null || echo "0")
echo "  Total tables: $NEW_TABLES"
echo ""

# List all tables
echo "📋 Tables created:"
psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d "$PG_DATABASE" -c "\dt" 2>/dev/null || true
echo ""

# Show sample data
echo "📊 Sample data counts:"
psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d "$PG_DATABASE" << 'EOF'
SELECT 'Departments' as table_name, COUNT(*) as count FROM list_department
UNION ALL
SELECT 'Positions', COUNT(*) FROM list_position
UNION ALL
SELECT 'Accounts', COUNT(*) FROM accounts
UNION ALL
SELECT 'Users', COUNT(*) FROM infor_users
UNION ALL
SELECT 'Employees', COUNT(*) FROM infor_employee;
EOF

echo ""
echo "=========================================="
echo "✅ DATABASE RECOVERY COMPLETED!"
echo "=========================================="
echo ""
echo "Default login accounts:"
echo "  Admin: admin / admin123"
echo "  Doctor: doctor01 / doctor123"
echo "  Nurse: nurse01 / nurse123"
echo ""
echo "Next steps:"
echo "  1. Restart your backend server: npm run dev"
echo "  2. Refresh your frontend browser"
echo "  3. Login with default credentials above"
echo ""
