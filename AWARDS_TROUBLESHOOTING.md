# Awards Screen Troubleshooting

## Issue: Can't Click "Next" on Awards Screen

### Quick Fix Steps

1. **Hard Refresh Browser**
   - Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - This clears cache and reloads the page

2. **Check Browser Console**
   - Press `F12` to open Developer Tools
   - Click "Console" tab
   - Look for any red error messages
   - Share any errors you see

3. **Make Sure You Select Yes or No**
   - Click on either the "Yes" or "No" radio button
   - You should see the button highlight in black
   - Then click "Next"

4. **Clear Browser Cache**
   - Close the browser completely
   - Delete browser cache (Ctrl+Shift+Delete)
   - Reopen http://localhost:3001
   - Try again

---

## What Should Happen

### Step 1: Select Yes or No
```
Have you received any awards or decorations?
[Yes]  [No]
```
- Click one of the buttons
- It should highlight with a black border

### Step 2: If You Click "Yes"
```
Select your awards (check all that apply):
☐ Army Achievement Medal (AAM)
☐ Army Commendation Medal (ARCOM)
... (more awards)

Other awards or decorations (optional):
[Text area]
```
- Optionally select awards
- Optionally enter other awards
- Click "Next"

### Step 3: If You Click "No"
- The award selection disappears
- Just click "Next" to continue

---

## Common Issues & Solutions

### Issue: Radio buttons don't highlight
**Solution:**
- Try clicking directly on the "Yes" or "No" text
- Or click on the radio button circle itself
- Hard refresh the page (Ctrl+Shift+R)

### Issue: "Next" button is grayed out
**Solution:**
- Make sure you've selected "Yes" or "No"
- The button should be black when ready
- If still grayed out, hard refresh

### Issue: Form won't submit
**Solution:**
1. Open browser console (F12)
2. Look for error messages
3. Try these steps:
   - Select "No" (simpler option)
   - Click "Next"
   - If that works, the issue is with "Yes" selection
   - If that doesn't work, there's a form issue

### Issue: Page refreshes but doesn't advance
**Solution:**
- Check console for errors
- Try selecting "No" instead of "Yes"
- If "No" works but "Yes" doesn't, the awards selection has an issue

---

## Debug Steps

### Step 1: Check Console
```
F12 → Console tab → Look for red errors
```

### Step 2: Test Simple Selection
```
1. Click "No"
2. Click "Next"
3. If this works, the form works
4. If this doesn't work, there's a form issue
```

### Step 3: Test Award Selection
```
1. Click "Yes"
2. Don't select any awards
3. Click "Next"
4. If this works, award selection works
5. If this doesn't work, there's an issue with "Yes" selection
```

---

## What I Fixed

✅ Made sure `hasAwards` has a default value of `false`  
✅ Added proper form validation with Zod defaults  
✅ Improved radio button styling and selection  
✅ Added console logging for debugging  

---

## If Still Stuck

1. **Open browser console** (F12)
2. **Take a screenshot** of any error messages
3. **Try selecting "No"** - this should always work
4. **Check if you can advance** from "No" selection
5. **Report what happens**

---

## Quick Test

Try this exact sequence:

1. Reach Awards screen
2. Click the "No" radio button (should highlight black)
3. Click "Next" button (should be black/clickable)
4. Should advance to Summary screen

If this works → The form works, just need to select an option  
If this doesn't work → There's a form issue, check console

---

**Status:** Code updated and compiled ✅

Try refreshing your browser and testing again!
