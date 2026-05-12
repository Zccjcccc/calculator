const { app, BrowserWindow } = require('electron');
const path = require('path');

const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 380,
    height: 620,
    resizable: false,
    autoHideMenuBar: true,
    title: 'Calculator',
  });

  if (isDev) {
    win.loadURL('http://localhost:5173/');
  } else {
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  // Prevent title change from the page
  win.on('page-title-updated', (e) => e.preventDefault());
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
