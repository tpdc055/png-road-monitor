# PNG Road Construction Monitor - Production Setup Guide

This guide provides comprehensive instructions for deploying the PNG Road Construction Monitor system in a production environment.

## 📋 Table of Contents

1. [System Requirements](#system-requirements)
2. [Environment Setup](#environment-setup)
3. [Database Configuration](#database-configuration)
4. [Application Deployment](#application-deployment)
5. [Monitoring Setup](#monitoring-setup)
6. [Security Configuration](#security-configuration)
7. [Backup and Recovery](#backup-and-recovery)
8. [Performance Optimization](#performance-optimization)
9. [Troubleshooting](#troubleshooting)

## 🏗️ System Requirements

### Hardware Requirements

**Minimum Production Environment:**
- **CPU**: 4 cores (2.5GHz+)
- **RAM**: 8GB
- **Storage**: 100GB SSD
- **Network**: 1Gbps connection

**Recommended Production Environment:**
- **CPU**: 8 cores (3.0GHz+)
- **RAM**: 16GB
- **Storage**: 500GB SSD with backup storage
- **Network**: 1Gbps+ connection with redundancy

### Software Requirements

- **Operating System**: Ubuntu 22.04 LTS or RHEL 8+
- **Node.js**: v18+ (managed via Bun)
- **Bun**: Latest stable version
- **PostgreSQL**: v14+ with PostGIS extension
- **Redis**: v6+ (for caching and sessions)
- **Nginx**: v1.20+ (reverse proxy)
- **Docker**: v20+ (for monitoring stack)
- **SSL Certificate**: Valid SSL certificate for HTTPS

## 🌍 Environment Setup

### 1. Server Preparation

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y curl wget git unzip nginx postgresql postgresql-contrib redis-server

# Install Bun
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc
```

### 2. Environment Configuration

Copy the appropriate environment template:

```bash
# For production
cp .env.production.template .env.production

# For staging
cp .env.staging.template .env.staging
```

Edit the environment file with your specific configuration:

```bash
# Edit production environment
nano .env.production
```

**Critical Configuration Items:**

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Secure random string (use `openssl rand -base64 32`)
- `NEXTAUTH_URL`: Your production domain
- `GOOGLE_MAPS_API_KEY`: For GPS functionality
- Email and notification settings
- Security and CORS settings

## 🗄️ Database Configuration

### 1. PostgreSQL Setup

```bash
# Switch to postgres user
sudo su - postgres

# Create production database
createdb png_road_monitor_prod
createdb png_road_monitor_shadow

# Run production setup script
psql -f scripts/database/setup-production.sql
```

### 2. Database Migration

```bash
# Generate Prisma client
bunx prisma generate

# Run migrations
bunx prisma migrate deploy

# Seed initial data (optional)
bunx prisma db seed
```

### 3. PostGIS Extension

```bash
# Enable PostGIS for GPS functionality
sudo su - postgres
psql png_road_monitor_prod -c "CREATE EXTENSION IF NOT EXISTS postgis;"
```

## 🚀 Application Deployment

### 1. Application Build

```bash
# Install dependencies
bun install --frozen-lockfile

# Build application
bun run build

# Test the build
bun run start
```

### 2. Process Management (PM2)

```bash
# Install PM2 globally
npm install -g pm2

# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'png-road-monitor',
    script: 'bun',
    args: 'run start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/png-road-monitor/error.log',
    out_file: '/var/log/png-road-monitor/out.log',
    log_file: '/var/log/png-road-monitor/combined.log',
    time: true
  }]
}
EOF

# Start application
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### 3. Nginx Configuration

```bash
# Create Nginx configuration
sudo tee /etc/nginx/sites-available/png-road-monitor << 'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;

    client_max_body_size 100M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    location /uploads {
        alias /var/uploads/png-road-monitor;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/png-road-monitor /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 📊 Monitoring Setup

### 1. Deploy Monitoring Stack

```bash
# Navigate to monitoring directory
cd monitoring

# Start monitoring services
docker-compose -f docker-compose.monitoring.yml up -d
```

### 2. Configure Grafana

1. Access Grafana at `http://your-server:3001`
2. Login with admin/admin123 (change password immediately)
3. Import PNG Road Monitor dashboards from `monitoring/grafana/dashboards/`

### 3. Set Up Alerts

Configure alerts in Grafana for:
- Application downtime
- Database connection issues
- High memory/CPU usage
- Failed backup operations
- GPS tracking failures

## 🔒 Security Configuration

### 1. Firewall Setup

```bash
# Configure UFW firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 2. SSL Certificate

```bash
# Install Certbot for Let's Encrypt
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 3. Security Headers

Add to Nginx configuration:

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

## 💾 Backup and Recovery

### 1. Automated Backups

```bash
# Make backup script executable
chmod +x scripts/database/backup.sh

# Add to crontab for daily backups at 2 AM
echo "0 2 * * * /path/to/png-road-monitor/scripts/database/backup.sh" | sudo crontab -
```

### 2. File System Backups

```bash
# Create file backup script
sudo tee /usr/local/bin/png-road-monitor-file-backup.sh << 'EOF'
#!/bin/bash
tar czf /var/backups/png-road-monitor-files-$(date +%Y%m%d).tar.gz \
    /var/uploads/png-road-monitor \
    /home/deploy/png-road-monitor/.env.production \
    /etc/nginx/sites-available/png-road-monitor
EOF

chmod +x /usr/local/bin/png-road-monitor-file-backup.sh

# Add to crontab
echo "0 3 * * * /usr/local/bin/png-road-monitor-file-backup.sh" | sudo crontab -
```

### 3. Disaster Recovery

For disaster recovery, use the restore script:

```bash
# Restore from backup
./scripts/database/restore.sh --latest
```

## ⚡ Performance Optimization

### 1. Database Optimization

```sql
-- Run these queries to optimize PostgreSQL
VACUUM ANALYZE;
REINDEX DATABASE png_road_monitor_prod;

-- Monitor slow queries
SELECT query, mean_time, calls
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### 2. Application Optimization

- Enable gzip compression in Nginx
- Set up Redis for session storage
- Configure CDN for static assets
- Enable Next.js ISR for dynamic content

### 3. Monitoring Performance

- Monitor response times via Grafana
- Set up alerts for slow queries
- Track memory usage and optimize accordingly

## 🔧 Troubleshooting

### Common Issues

**Application won't start:**
```bash
# Check logs
pm2 logs png-road-monitor

# Check environment variables
pm2 env 0

# Restart application
pm2 restart png-road-monitor
```

**Database connection issues:**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connections
sudo su - postgres
psql -c "SELECT * FROM pg_stat_activity;"
```

**GPS tracking not working:**
```bash
# Verify Google Maps API key
curl "https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"

# Check browser console for errors
# Ensure HTTPS is enabled (required for GPS)
```

**File uploads failing:**
```bash
# Check upload directory permissions
ls -la /var/uploads/png-road-monitor

# Ensure correct ownership
sudo chown -R www-data:www-data /var/uploads/png-road-monitor
```

### Log Files

- **Application**: `/var/log/png-road-monitor/`
- **Nginx**: `/var/log/nginx/`
- **PostgreSQL**: `/var/log/postgresql/`
- **Backup**: `/var/backups/png-road-monitor/backup.log`

### Performance Monitoring

```bash
# Check system resources
htop
iostat -x 1
free -h

# Check database performance
sudo su - postgres
psql png_road_monitor_prod -c "SELECT * FROM pg_stat_user_tables;"
```

## 📞 Support and Maintenance

### Regular Maintenance Tasks

1. **Weekly**: Review logs and monitoring alerts
2. **Monthly**: Update system packages and review performance
3. **Quarterly**: Review and test disaster recovery procedures
4. **Annually**: Review and update security configurations

### Support Contacts

- **Technical Issues**: Create GitHub issue
- **Security Concerns**: Contact system administrator immediately
- **PNG Government Integration**: Contact PNG Department of Works

### Documentation

- [Field Worker Guide](./FIELD_WORKER_GUIDE.md)
- [PNG Government Integration](./PNG_GOVERNMENT_INTEGRATION.md)
- [API Documentation](./docs/api.md)

---

**Last Updated**: July 2025
**Version**: 1.0.0
**Maintained By**: PNG Road Construction Monitor Team
