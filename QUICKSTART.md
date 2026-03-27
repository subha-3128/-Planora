# 🚀 Quick Start Guide

## ✅ What You Have

A **production-ready Progressive Web App (PWA)** with:
- ✨ Modern, clean UI with dark mode
- 📅 7-day timetable management
- ✓ Task tracking with progress tracking
- 📱 Mobile responsive design
- ⚡ Offline support via Service Worker
- 💾 Local storage for data persistence
- 🎨 Beautiful animations and transitions

---

## 🏃 Run Locally (Choose One Method)

### **Method 1: Python (Easiest if already installed)**

```bash
cd "/Users/subhajitbepari/Desktop/time table"
python3 -m http.server 8000
```

Then open: **http://localhost:8000**

---

### **Method 2: Node.js/npm**

```bash
# Install http-server (one-time)
npm install -g http-server

# Run from your project directory
cd "/Users/subhajitbepari/Desktop/time table"
http-server
```

Then open: **http://localhost:8080** (or the URL shown in terminal)

---

### **Method 3: Using a Simple Server Script**

Create a file `server.sh` in your project folder:

```bash
#!/bin/bash
cd "/Users/subhajitbepari/Desktop/time table"
python3 -m http.server 8000
```

Make it executable:
```bash
chmod +x server.sh
./server.sh
```

---

### **Method 4: macOS - Direct Open (Limited Features)**

Simply double-click `index.html` to open in the default browser.
*(Some Service Worker features won't work this way)*

---

## 📱 Install as PWA

### **Mobile (iOS)**
1. Open the app in Safari
2. Tap **Share** → **Add to Home Screen**
3. Name it "WeekFlow"

### **Mobile (Android)**
1. Open the app in Chrome
2. Tap **⋮** (menu) → **Install app**
3. Confirm installation

### **Desktop (Chrome/Edge)**
1. Open the app in Chrome or Edge
2. Click the **install icon** (⬇️) in the top right
3. Confirm

---

## 🎯 Key Features to Try

### 1. **Complete Tasks**
   - Click any task to mark it complete
   - Watch the progress bar update in real-time
   - Progress saved automatically

### 2. **Dark Mode**
   - Click the 🌙 button in top right
   - Preference saved automatically

### 3. **Reset Week**
   - Click the **↺ Reset Week** button
   - Clears all completed tasks

### 4. **View Stats**
   - See weekly progress percentage
   - Track total tasks completed
   - View current streak

---

## 💾 Data Storage

All your data is stored **locally** in your browser:
- ✅ Completed tasks
- 🌙 Theme preference (dark/light)
- 📊 Streak information

**NO data sent to servers | NO tracking | 100% private**

---

## ⚙️ Customization

### Change Your Timetable
Edit `js/data.js`:
```javascript
const TIMETABLE_DATA = [
    {
        id: 1,
        name: "Your Day Name",
        tasks: [
            { time: "9:00", activity: "Your Activity", icon: "🎯" },
            // Add more tasks...
        ]
    }
];
```

### Change Colors
In `js/data.js`, modify the `color` property:
- `from-green-400 to-green-600` (Day 1)
- `from-blue-400 to-blue-600` (Day 2)
- etc.

### Change App Name
Edit `manifest.json`:
```json
{
  "name": "My Timetable",
  "short_name": "MyWeek"
}
```

---

## 🌐 Deploy Online

### **Netlify (Recommended - Free Tier)**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd "/Users/subhajitbepari/Desktop/time table"
netlify deploy --prod --dir=.
```

### **Vercel (Free Tier)**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd "/Users/subhajitbepari/Desktop/time table"
vercel --prod
```

### **GitHub Pages (Free)**

1. Create a GitHub account
2. Create new repository named `time-table`
3. Upload all files
4. Enable GitHub Pages in Settings
5. Access at: `https://yourusername.github.io/time-table`

---

## 🔧 Troubleshooting

### App won't load?
- Check you're using a modern browser (Chrome, Firefox, Safari, Edge)
- Make sure your server is running and accessible
- Check browser console for errors (F12)

### Tasks not saving?
- Ensure you're not in private/incognito mode
- Check if localStorage is enabled in browser settings
- Try clearing browser cache

### Service Worker not working?
- App must be served over HTTP/HTTPS (not direct file)
- Check browser console for registration messages
- Service Workers only work in secure contexts

### Dark mode not persisting?
- Enable localStorage in browser settings
- Try clearing cache and refresh

---

## 📊 Browser Compatibility

| Browser | Desktop | Mobile | Notes |
|---------|---------|--------|-------|
| Chrome  | ✅ Full | ✅ Full | Best support |
| Firefox | ✅ Full | ✅ Full | Full PWA support |
| Safari  | ✅ Good | ✅ Good | Partial PWA |
| Edge    | ✅ Full | ✅ Full | Chromium-based |

---

## 🎨 File Structure

```
time-table/
├── index.html           # Main page
├── manifest.json        # PWA app manifest
├── README.md            # Full documentation
├── QUICKSTART.md        # This file
├── css/
│   └── style.css        # Custom styles & animations
├── js/
│   ├── app.js           # Main app logic
│   ├── data.js          # Timetable data
│   └── sw.js            # Service Worker (offline)
└── icons/               # PWA icons folder
```

---

## 💡 Pro Tips

1. **Keyboard Navigation**: Tab through tasks, press Space/Enter to toggle
2. **Mobile**: App is optimized for touch - use swipe and tap
3. **Offline**: Once loaded, works completely offline!
4. **Clear Data**: Open DevTools → Application → Storage → Clear All

---

## 🚀 Next Steps

1. ✅ Run locally using one method above
2. ✅ Try marking tasks complete
3. ✅ Install as PWA on your device
4. ✅ Customize the timetable to your schedule
5. ✅ Deploy online if desired

---

**Enjoy your productivity journey! 🎯**

Questions? Check the full [README.md](./README.md) for more details.
