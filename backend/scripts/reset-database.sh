#!/bin/bash

# ============================================
# RESET DATABASE SCRIPT
# Tự động xóa và tạo lại database healthcare
# ============================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}    HEALTHCARE DATABASE RESET SCRIPT${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Confirm action
echo -e "${YELLOW}⚠️  WARNING: This will DELETE all data in the 'healthcare' database!${NC}"
read -p "Are you sure you want to continue? (yes/no): " -r
echo ""
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]
then
    echo -e "${RED}❌ Operation cancelled${NC}"
    exit 1
fi

# Step 1: Drop database
echo -e "${YELLOW}🗑️  Step 1: Dropping existing database...${NC}"
psql -U postgres -c "DROP DATABASE IF EXISTS healthcare;" 2>&1 | grep -v "NOTICE" || true
echo -e "${GREEN}✅ Database dropped${NC}"
echo ""

# Step 2: Create new database
echo -e "${YELLOW}🆕 Step 2: Creating new database...${NC}"
psql -U postgres -c "CREATE DATABASE healthcare;"
echo -e "${GREEN}✅ Database created${NC}"
echo ""

# Step 3: Run schema migration
echo -e "${YELLOW}📊 Step 3: Running schema migration...${NC}"
psql -U postgres -d healthcare -f src/migrations/001_init_schema.sql | grep "NOTICE" || true
echo -e "${GREEN}✅ Schema migration completed${NC}"
echo ""

# Step 4: Insert sample data
echo -e "${YELLOW}📝 Step 4: Inserting sample data...${NC}"
psql -U postgres -d healthcare -f src/migrations/002_insert_sample_data.sql | grep "NOTICE" || true
echo -e "${GREEN}✅ Sample data inserted${NC}"
echo ""

# Step 5: Verify
echo -e "${YELLOW}🔍 Step 5: Verifying database...${NC}"
psql -U postgres -d healthcare -c "
SELECT 'Patients' as type, COUNT(*) as count FROM infor_users WHERE role_user = 'users'
UNION ALL
SELECT 'Employees', COUNT(*) FROM infor_users WHERE role_user = 'employee'
UNION ALL
SELECT 'Departments', COUNT(*) FROM list_department
UNION ALL
SELECT 'Positions', COUNT(*) FROM list_position;
"
echo ""

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}    ✅ DATABASE RESET COMPLETE!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "Next steps:"
echo -e "1. ${BLUE}cd backend${NC}"
echo -e "2. ${BLUE}npm start${NC}"
echo -e "3. Open browser: ${BLUE}http://localhost:5001${NC}"
echo ""
