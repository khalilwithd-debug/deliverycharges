# WWE Championship Belts E-commerce Deployment Guide

## Overview
This is a complete WWE championship belts e-commerce application with cart functionality, voucher system, and bill generation.

## Features
- ✅ Product catalog with 12 WWE championship belts
- ✅ Shopping cart with quantity management
- ✅ Voucher system (WRESTLE10 for 10% off)
- ✅ Checkout form with customer details and shipping address
- ✅ Bill generation that opens in new tab for screenshot
- ✅ Responsive design with Framer Motion animations
- ✅ Local storage for cart persistence

## Tech Stack
- **Frontend**: React 18 + TypeScript + TailwindCSS + Framer Motion
- **Backend**: Express.js
- **Build Tool**: Vite
- **Package Manager**: pnpm

## Quick Deployment to VPS

### Option 1: Upload Built Files
1. Run `pnpm build` to create production files
2. Upload the entire `dist/` folder to your VPS
3. Install Node.js on your VPS
4. Run `npm install --production` 
5. Start with `node dist/server/node-build.mjs`

### Option 2: Full Source Upload
1. Upload entire project folder to VPS
2. Install Node.js and pnpm on VPS
3. Run `pnpm install`
4. Run `pnpm build`
5. Start with `pnpm start`

### Option 3: Use PM2 for Production
```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start dist/server/node-build.mjs --name "wwe-store"

# Save PM2 configuration
pm2 save
pm2 startup
```

## Environment Setup
Create a `.env` file in the root directory:
```
NODE_ENV=production
PORT=3000
```

## Domain Configuration
If using a custom domain, update your web server (nginx/apache) to proxy to the Node.js application:

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Product Management
To add/edit products, modify `shared/products.ts`:
- Update the `PRODUCTS` array with new belt information
- Add product images to the `public/` folder
- Update image paths in the product data

## Voucher Codes
Current voucher codes are defined in `shared/products.ts`:
- **WRESTLE10**: 10% discount

To add new vouchers, add them to the `VOUCHERS` array.

## Important Notes
- **No Payment Processing**: This system generates bills for manual payment processing
- **Screenshot Instructions**: Bills include instructions for customers to take screenshots
- **Local Storage**: Cart data persists in browser local storage
- **No User Accounts**: No signup/login required

## File Structure for VPS Upload
```
wwe-store/
├── dist/                 # Built production files
├── package.json         # Dependencies
├── node_modules/        # (install with pnpm install)
├── .env                 # Environment variables
└── README.md           # This file
```

## Troubleshooting
1. **Port Issues**: Change port in `.env` file if 3000 is occupied
2. **Build Errors**: Ensure Node.js version 18+ is installed
3. **Memory Issues**: Increase server memory if build fails
4. **Static Files**: Ensure `dist/spa/` folder contains all assets

## Support
For technical support or customization:
- Check the console for any JavaScript errors
- Verify all files are uploaded correctly
- Ensure Node.js dependencies are installed
