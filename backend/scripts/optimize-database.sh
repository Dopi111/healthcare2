#!/bin/bash

# ============================================
# Database Optimization Script
# Applies performance optimizations to the database
# ============================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}Healthcare Database Optimization${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo -e "${GREEN}✓${NC} Loaded environment variables from .env"
else
    echo -e "${YELLOW}⚠${NC}  .env file not found, using default values"
fi

# Set default values if not in .env
PG_USER=${PG_USER:-postgres}
PG_DATABASE=${PG_DATABASE:-healthcare_db}
PG_HOST=${PG_HOST:-localhost}
PG_PORT=${PG_PORT:-5432}

echo ""
echo -e "${BLUE}Database Configuration:${NC}"
echo -e "  Host: ${PG_HOST}"
echo -e "  Port: ${PG_PORT}"
echo -e "  Database: ${PG_DATABASE}"
echo -e "  User: ${PG_USER}"
echo ""

# Check if PostgreSQL is running
echo -e "${BLUE}Checking PostgreSQL connection...${NC}"
if pg_isready -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} PostgreSQL is running"
else
    echo -e "${RED}✗${NC} Cannot connect to PostgreSQL"
    echo -e "${YELLOW}Please ensure PostgreSQL is running and credentials are correct${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Step 1: Applying performance migration...${NC}"
if psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d "$PG_DATABASE" -f src/migrations/010_performance_optimization.sql; then
    echo -e "${GREEN}✓${NC} Performance migration applied successfully"
else
    echo -e "${RED}✗${NC} Failed to apply performance migration"
    exit 1
fi

echo ""
echo -e "${BLUE}Step 2: Analyzing tables...${NC}"
psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d "$PG_DATABASE" << EOF
ANALYZE infor_users;
ANALYZE infor_employee;
ANALYZE patients;
ANALYZE appointments;
ANALYZE expenses;
ANALYZE funds;
ANALYZE insurance_claims;
ANALYZE revenue;
ANALYZE laboratory_tests;
ANALYZE test_results;
ANALYZE lab_results;
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Tables analyzed successfully"
else
    echo -e "${RED}✗${NC} Failed to analyze tables"
    exit 1
fi

echo ""
echo -e "${BLUE}Step 3: Refreshing materialized views...${NC}"
psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d "$PG_DATABASE" -c "SELECT refresh_all_statistics();" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Materialized views refreshed"
else
    echo -e "${YELLOW}⚠${NC}  Materialized views not yet created (this is OK on first run)"
fi

echo ""
echo -e "${BLUE}Step 4: Verifying optimization...${NC}"

# Count indexes
INDEX_COUNT=$(psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d "$PG_DATABASE" -t -c "SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public';")
echo -e "  Total indexes: ${GREEN}${INDEX_COUNT}${NC}"

# Count materialized views
VIEW_COUNT=$(psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d "$PG_DATABASE" -t -c "SELECT COUNT(*) FROM pg_matviews WHERE schemaname = 'public';")
echo -e "  Materialized views: ${GREEN}${VIEW_COUNT}${NC}"

# Show table sizes
echo ""
echo -e "${BLUE}Database table sizes:${NC}"
psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d "$PG_DATABASE" << EOF
SELECT
  tablename,
  pg_size_pretty(pg_total_relation_size('public.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size('public.'||tablename) DESC
LIMIT 10;
EOF

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}✓ Database optimization completed!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo -e "  1. Restart your Node.js server"
echo -e "  2. Test API performance"
echo -e "  3. Set up daily cron job for statistics refresh:"
echo -e "     ${YELLOW}0 3 * * * psql -U $PG_USER -d $PG_DATABASE -c 'SELECT refresh_all_statistics();'${NC}"
echo -e "  4. Read PERFORMANCE_OPTIMIZATION.md for more details"
echo ""
