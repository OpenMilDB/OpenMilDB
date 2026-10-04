import { app, BrowserWindow } from 'electron';
import * as path from 'path';

// Memory pointer tracking the open window to stop Vite HMR from spawning duplicates
let mainWindow: BrowserWindow | null = null;

function createWindow() {
  // If an application window instance already exists in memory scope, focus it and abort
  if (mainWindow) {
    mainWindow.focus();
    return;
  }

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#121212', // Stops bright white screen flickers during initial boot frames
    webPreferences: {
      // Securely links your root preload script
      preload: path.join(app.getAppPath(), 'electron', 'preload.js'),
      nodeIntegration: false,    // Turned off for standard security sandbox alignment
      contextIsolation: true     // Essential for rendering window.electron safely
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    // FIX: Explicitly forces the frame to request the numerical IPv4 track directly
    mainWindow.loadURL('http://127.0.0.1:3000');

    // If the Vite dev server isn't warm yet, retry every 500ms instead of showing a blank screen
    mainWindow.webContents.on('did-fail-load', () => {
      setTimeout(() => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.loadURL('http://127.0.0.1:3000');
        }
      }, 500);
    });
  } else {
    mainWindow.loadFile(path.join(import.meta.dirname, '../dist/index.html'));
  }

  // Opens the browser debugger layout split pane natively on launch
  mainWindow.webContents.openDevTools();

  // Clear memory tracking references when the container window shuts down
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Electron engine launch hook setup orchestration
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
