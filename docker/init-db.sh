#!/bin/bash
set -e

# Create the employee database (auth database is created by default via POSTGRES_DB)
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    SELECT 'CREATE DATABASE peopleai_employee'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'peopleai_employee')\gexec
EOSQL

echo "Database peopleai_employee created successfully (or already exists)"
