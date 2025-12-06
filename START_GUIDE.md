# Quick Start Guide - Cadence

## Option 1: Fast Start (Recommended)

**Double-click:** `start-fast.bat`

This immediately starts the dev server without checking for dependencies (fastest option if you've already installed them once).

**Time:** ~5-10 seconds to start

---

## Option 2: Full Start (First Time)

**Double-click:** `start.bat`

This checks if dependencies are installed, installs them if needed, then starts the dev server.

**Time:** ~30-60 seconds (first time), ~5-10 seconds (subsequent times)

---

## Manual Start (If Batch Files Don't Work)

Open PowerShell or Command Prompt in the Cadence folder and run:

```bash
npm run dev
```

---

## What Happens After Starting

1. **Dev server starts** on `http://localhost:3001`
2. **Browser opens automatically** (usually)
3. **Hot reload enabled** - Changes save automatically
4. **Console shows** - Compilation status and any errors

---

## Accessing the App

- **Home:** http://localhost:3001
- **Onboarding:** http://localhost:3001/onboarding
- **Dashboard:** http://localhost:3001/dashboard

---

## Stopping the Server

Press `Ctrl+C` in the terminal/command prompt

---

## Troubleshooting

### "npm: The term 'npm' is not recognized"
- Install Node.js from https://nodejs.org/
- Restart your computer
- Try again

### "Port 3001 is already in use"
- Another instance is running
- Close other terminals running `npm run dev`
- Or kill the process: `npx kill-port 3001`

### "Module not found" errors
- Run `npm install` manually
- Delete `node_modules` folder
- Run `npm install` again

### Changes not showing up
- Hard refresh browser: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
- Check browser console for errors: `F12`

---

## Key Files

- `start.bat` - Full start with dependency check
- `start-fast.bat` - Fast start (dependencies must be installed)
- `package.json` - Project dependencies
- `next.config.js` - Next.js configuration

---

## First Time Setup

1. **Double-click `start.bat`** - Installs dependencies and starts server
2. **Wait for compilation** - Takes 30-60 seconds
3. **Browser opens** - Go to http://localhost:3001
4. **Start onboarding** - Click "Get Started"

---

## Subsequent Starts

1. **Double-click `start-fast.bat`** - Starts immediately (~5-10 seconds)
2. **Browser opens** - http://localhost:3001
3. **Ready to use!**

---

## Tips

- Keep the terminal/command prompt window open while developing
- Don't close it until you're done working
- You can minimize it but leave it running
- Changes auto-save and hot-reload

---

**Status:** Ready to start! 🚀
