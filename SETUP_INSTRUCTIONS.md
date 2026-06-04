# Setup Instructions - DVM JAPAN UI

## Step 1: Install Node.js

1. Visit: https://nodejs.org/
2. Download the LTS (Long Term Support) version
3. Run the installer and follow the setup wizard
4. Restart your computer after installation

## Step 2: Verify Installation

Open PowerShell or Command Prompt and run:
```bash
node --version
npm --version
```

You should see version numbers (e.g., v20.10.0 and 10.2.3)

## Step 3: Install Project Dependencies

Navigate to the project folder and run:
```bash
npm install
```

This will install all required packages (Next.js, React, Tailwind CSS, etc.)

## Step 4: Start Development Server

Run:
```bash
npm run dev
```

You should see:
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
```

## Step 5: View in Browser

Open your browser and go to:
**http://localhost:3000**

You'll see the DVM JAPAN website live!

## Troubleshooting

### If Node.js is not recognized:
- Make sure Node.js is installed
- Restart your computer
- Check if Node.js is in your system PATH

### If npm install fails:
- Make sure you have internet connection
- Try running PowerShell as Administrator
- Clear npm cache: `npm cache clean --force`

### If port 3000 is busy:
- Close other applications using port 3000
- Or use a different port: `npm run dev -- -p 3001`

## Quick Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## What You'll See

Once running, you can navigate to:
- Home: http://localhost:3000
- Inventory: http://localhost:3000/inventory
- Admin: http://localhost:3000/admin
- All other pages are accessible through navigation
