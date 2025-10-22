# VPS Deployment Guide - WWE Championship Store

Complete guide to deploy the WWE Championship Store on Hostinger Ubuntu VPS using File Manager.

## Prerequisites

- ✅ Hostinger VPS with Ubuntu (18.04+ recommended)
- ✅ Access to File Manager in Hostinger Control Panel
- ✅ Node.js 18+ installed on VPS
- ✅ Stripe & PayPal API keys ready

## Step 1: Check Node.js Installation

First, verify Node.js is installed via Hostinger's terminal:

1. Go to Hostinger Control Panel → VPS → Terminal
2. Run: `node --version`
3. If not installed, ask Hostinger support to install Node.js 18+

## Step 2: Build the Project Locally

Before uploading, build the project on your local machine:

```bash
npm run build
```

This creates:

- `dist/spa/` - React frontend build
- `dist/server/node-build.mjs` - Express server build

## Step 3: Prepare Files for Upload

Create a folder containing only deployment files:

```
wwe-store/
├── dist/
│   ├── spa/                    # Frontend build
│   └── server/
│       └── node-build.mjs      # Server
├── package.json                # Production dependencies only
├── .env                        # Environment variables (CREATE THIS)
├── start.sh                    # Start script (provided below)
└── README.md                   # Documentation
```

## Step 4: Create Production package.json

Keep only production dependencies. Replace your `package.json` with:

```json
{
  "name": "wwe-championship-store",
  "version": "1.0.0",
  "description": "WWE Championship Belts E-commerce Store",
  "main": "dist/server/node-build.mjs",
  "type": "module",
  "scripts": {
    "start": "node dist/server/node-build.mjs",
    "prod": "NODE_ENV=production node dist/server/node-build.mjs"
  },
  "dependencies": {
    "@paypal/checkout-server-sdk": "^1.0.3",
    "cors": "^2.8.5",
    "dotenv": "^17.2.1",
    "express": "^5.1.0",
    "stripe": "^19.1.0"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "author": "BURNITDOWNYT",
  "license": "MIT"
}
```

## Step 5: Create Environment File

Create a `.env` file in the root with your credentials:

```env
NODE_ENV=production
PORT=3000
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_ACTUAL_SECRET
PAYPAL_CLIENT_ID=YOUR_ACTUAL_ID
PAYPAL_CLIENT_SECRET=YOUR_ACTUAL_SECRET
```

⚠️ **Never commit `.env` to git!** Keep it secret.

## Step 6: Create Start Script

Create `start.sh`:

```bash
#!/bin/bash
set -e

echo "🚀 Starting WWE Championship Store..."
export NODE_ENV=production

# Install production dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install --production
fi

# Start the server
echo "🎯 Server starting on port 3000..."
node dist/server/node-build.mjs
```

Make it executable (after uploading):

```bash
chmod +x start.sh
```

## Step 7: Upload via Hostinger File Manager

### Using File Manager (GUI):

1. **Go to**: Hostinger Control Panel → File Manager
2. **Navigate to**: `/home/yourusername/public_html` (or your app directory)
3. **Upload files** in this order:
   - First: `package.json`
   - Second: `.env` (keep this private!)
   - Third: `dist/` folder (entire folder with spa + server)
   - Fourth: `start.sh`

### Folder structure after upload:

```
public_html/
├── dist/
│   ├── spa/
│   └── server/
│       └── node-build.mjs
├── package.json
├── .env
├── start.sh
└── node_modules/         (created after npm install)
```

## Step 8: Install Dependencies on VPS

1. Go to Hostinger Terminal
2. Navigate to your app: `cd /home/yourusername/public_html`
3. Install production dependencies:

```bash
npm install --production
```

This only installs: express, stripe, cors, dotenv, paypal SDK

## Step 9: Test the Server

Run a test:

```bash
node dist/server/node-build.mjs
```

You should see:

```
🚀 Fusion Starter server running on port 3000
📱 Frontend: http://localhost:3000
🔧 API: http://localhost:3000/api
```

If it works, press `Ctrl+C` to stop.

## Step 10: Setup Web Server (nginx/Apache)

### For nginx (Recommended):

Create/edit `/etc/nginx/sites-available/default`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    client_max_body_size 10M;

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
    }
}
```

Then reload: `sudo systemctl reload nginx`

### For Apache:

Enable proxy modules:

```bash
sudo a2enmod proxy
sudo a2enmod proxy_http
```

Edit `/etc/apache2/sites-available/000-default.conf`:

```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    ServerAlias www.yourdomain.com

    ProxyRequests Off
    ProxyPreserveHost On

    <Location />
        ProxyPass http://localhost:3000/
        ProxyPassReverse http://localhost:3000/
    </Location>
</VirtualHost>
```

Then restart: `sudo systemctl reload apache2`

## Step 11: Run with PM2 (Recommended for Production)

PM2 auto-restarts your app if it crashes.

### Install PM2:

```bash
sudo npm install -g pm2
```

### Create PM2 config file (`ecosystem.config.js`):

```javascript
module.exports = {
  apps: [
    {
      name: "wwe-store",
      script: "dist/server/node-build.mjs",
      instances: 1,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "logs/err.log",
      out_file: "logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};
```

### Start with PM2:

```bash
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

This ensures your app restarts automatically after VPS reboot.

## Step 12: SSL Certificate (HTTPS)

### Using Let's Encrypt (Free):

```bash
sudo apt-get install certbot python3-certbot-nginx

# For nginx:
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# For apache:
sudo certbot --apache -d yourdomain.com -d www.yourdomain.com
```

Auto-renewal setup:

```bash
sudo systemctl enable certbot.timer
```

## Step 13: Point Domain to VPS

Update DNS records in your domain registrar:

```
A Record:
Name: @
Points to: YOUR_VPS_IP_ADDRESS

A Record:
Name: www
Points to: YOUR_VPS_IP_ADDRESS
```

Allow 24-48 hours for DNS propagation.

## Troubleshooting

### App won't start

```bash
# Check logs
pm2 logs wwe-store

# Or run directly to see errors
node dist/server/node-build.mjs
```

### Port 3000 already in use

```bash
lsof -i :3000
kill -9 <PID>
```

### Static files not loading

- Ensure `dist/spa/` folder exists
- Check file permissions: `chmod -R 755 dist/`

### API endpoints return 404

- Verify routes are registered in `server/index.ts`
- Check that `server/routes/*.ts` files exist

### Environment variables not loading

- Verify `.env` file exists in app root
- Check file permissions: `chmod 600 .env`
- Restart app: `pm2 restart wwe-store`

## Monitoring

### Check app status:

```bash
pm2 status
```

### View logs:

```bash
pm2 logs wwe-store
```

### Monitor resources:

```bash
pm2 monit
```

## Backup & Recovery

### Backup database/files regularly:

```bash
tar -czf backup.tar.gz dist/ package.json .env
```

### Restore:

```bash
tar -xzf backup.tar.gz
npm install --production
pm2 restart wwe-store
```

## Support

For Hostinger-specific issues:

- Contact Hostinger Support (they can help install Node.js)
- Check Hostinger Knowledge Base

For application issues:

- Review server logs: `pm2 logs`
- Verify environment variables: `cat .env`
- Test API endpoints: `curl http://localhost:3000/api/ping`

---

**Deployment Complete!** 🎉

Your WWE Championship Store should now be live at `https://yourdomain.com`
