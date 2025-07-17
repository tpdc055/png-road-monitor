-- PNG Road Construction Monitor - Production Database Setup
-- Run this script to set up the production database with proper users and permissions

-- Create database and users
CREATE DATABASE png_road_monitor_prod;
CREATE DATABASE png_road_monitor_shadow;

-- Create application user
CREATE USER png_road_app WITH PASSWORD 'CHANGE_THIS_PASSWORD';

-- Create backup user
CREATE USER png_road_backup WITH PASSWORD 'CHANGE_THIS_PASSWORD';

-- Create monitoring user
CREATE USER png_road_monitor WITH PASSWORD 'CHANGE_THIS_PASSWORD';

-- Connect to the main database
\c png_road_monitor_prod;

-- Grant permissions to application user
GRANT CONNECT ON DATABASE png_road_monitor_prod TO png_road_app;
GRANT USAGE ON SCHEMA public TO png_road_app;
GRANT CREATE ON SCHEMA public TO png_road_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO png_road_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO png_road_app;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO png_road_app;

-- Grant permissions to backup user
GRANT CONNECT ON DATABASE png_road_monitor_prod TO png_road_backup;
GRANT USAGE ON SCHEMA public TO png_road_backup;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO png_road_backup;

-- Grant permissions to monitoring user
GRANT CONNECT ON DATABASE png_road_monitor_prod TO png_road_monitor;
GRANT USAGE ON SCHEMA public TO png_road_monitor;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO png_road_monitor;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO png_road_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO png_road_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON FUNCTIONS TO png_road_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO png_road_backup;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO png_road_monitor;

-- Connect to shadow database and set up similar permissions
\c png_road_monitor_shadow;
GRANT CONNECT ON DATABASE png_road_monitor_shadow TO png_road_app;
GRANT USAGE ON SCHEMA public TO png_road_app;
GRANT CREATE ON SCHEMA public TO png_road_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO png_road_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO png_road_app;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO png_road_app;

-- Performance optimizations
\c png_road_monitor_prod;

-- Set up connection pooling parameters
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
ALTER SYSTEM SET random_page_cost = 1.1;
ALTER SYSTEM SET effective_io_concurrency = 200;

-- Enable logging for monitoring
ALTER SYSTEM SET log_destination = 'stderr';
ALTER SYSTEM SET logging_collector = on;
ALTER SYSTEM SET log_directory = 'pg_log';
ALTER SYSTEM SET log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log';
ALTER SYSTEM SET log_rotation_age = '1d';
ALTER SYSTEM SET log_rotation_size = '100MB';
ALTER SYSTEM SET log_min_duration_statement = 1000;
ALTER SYSTEM SET log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h ';
ALTER SYSTEM SET log_checkpoints = on;
ALTER SYSTEM SET log_connections = on;
ALTER SYSTEM SET log_disconnections = on;
ALTER SYSTEM SET log_lock_waits = on;

-- Reload configuration
SELECT pg_reload_conf();

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Create indexes for performance (these will be added after Prisma migration)
-- Note: Prisma will handle the schema creation, these are additional optimizations

-- Maintenance functions
CREATE OR REPLACE FUNCTION maintenance_cleanup()
RETURNS void AS $$
BEGIN
    -- Vacuum analyze all tables
    VACUUM ANALYZE;

    -- Update table statistics
    ANALYZE;

    -- Log cleanup completion
    RAISE NOTICE 'Maintenance cleanup completed at %', NOW();
END;
$$ LANGUAGE plpgsql;
