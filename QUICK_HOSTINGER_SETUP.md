# Quick Hostinger VPS Setup (5 Minutes)

## Prerequisites Checklist

- [ ] Node.js 18+ installed on VPS (ask Hostinger support if not)
- [ ] Stripe API keys ready
- [ ] PayPal API keys ready
- [ ] Your VPS IP address
- [ ] Your domain name

## Build Locally (Do This First!)

On your **local machine**:

```bash
npm run build
```

This creates a `dist/` folder with everything needed for production.

## Upload to Hostinger File Manager

1. Go to Hostinger Control Panel → File Manager
2. Navigate to `/home/yourusername/public_html/`
3. Upload these items:
   - `dist/` folder (the entire folder)
   - `package.json` (from root)
   - `start.sh` file

## Create .env File on VPS

In Hostinger File Manager:

1. Create a new file called `.env` in your app directory
2. Add your credentials:

```env
NODE_ENV=production
PORT=3000
STRIPE_SECRET_KEY=sk_test_YOUR_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET
PAYPAL_CLIENT_ID=YOUR_ID
PAYPAL_CLIENT_SECRET=YOUR_SECRET
```

## Install & Run on VPS

1. Open Hostinger Terminal
2. Navigate: `cd public_html`
3. Install dependencies:

```bash
npm install --production
```

4. Test the server:

```bash
node dist/server/node-build.mjs
```

You should see:

```
🚀 Fusion Starter server running on port 3000
```

Press `Ctrl+C` to stop.

## Setup Auto-Start with PM2 (Recommended)

1. Install PM2 globally:

```bash
sudo npm install -g pm2
```

2. Start your app with PM2:

```bash
pm2 start dist/server/node-build.mjs --name "wwe-store"
```

3. Auto-restart on reboot:

```bash
pm2 startup
pm2 save
```

4. Check status anytime:

```bash
pm2 status
```

## Connect Your Domain

1. Get your VPS IP address (from Hostinger control panel)
2. Update DNS records at your domain registrar:
   - A record: `@` → your VPS IP
   - A record: `www` → your VPS IP
3. Wait 24 hours for DNS to propagate

## Setup SSL (HTTPS)

In Hostinger Terminal:

```bash
sudo apt-get install certbot

# For the domain
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com
```

## Verify It's Working

1. Visit: `http://yourvpsip:3000` (should show your store)
2. Click a product to add to cart
3. Go to checkout - should NOT show white screen anymore
4. Try a test payment with Stripe test card: `4242 4242 4242 4242`

## Troubleshooting

| Issue                    | Solution                                     |
| ------------------------ | -------------------------------------------- |
| 404 errors               | Ensure `dist/` folder is uploaded correctly  |
| API endpoints fail       | Check `.env` file has correct API keys       |
| Port 3000 not responding | Check PM2 logs: `pm2 logs wwe-store`         |
| Node.js not found        | Ask Hostinger support to install Node.js 18+ |

## File Structure on VPS

After everything is set up:

```
/home/yourusername/public_html/
├── dist/
│   ├── spa/                    # Frontend files
│   └── server/
│       └── node-build.mjs      # Server app
├── node_modules/               # Dependencies (auto-created)
├── package.json
├── .env                        # Your secrets (KEEP PRIVATE!)
├── start.sh
└── (other optional files)
```

## Need Help?

1. **App won't start**: Run `pm2 logs wwe-store` to see errors
2. **API not working**: Verify `.env` values and restart: `pm2 restart wwe-store`
3. **Domain not resolving**: Wait longer or contact your domain registrar
4. **SSL issues**: Contact Hostinger support, they can help

---

**That's it!** Your app should now be live. 🎉

Full details available in `VPS_DEPLOYMENT_GUIDE.md`
