const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { pathToFileURL } = require('url');

let mainWindow = null;

function getResourcePath(...segments) {
  return app.isPackaged
    ? path.join(process.resourcesPath, ...segments)
    : path.join(__dirname, '..', ...segments);
}

async function startApp() {
  const staticDir = app.isPackaged
    ? getResourcePath('client-dist')
    : getResourcePath('client', 'dist');

  const serverPath = app.isPackaged
    ? getResourcePath('server-dist', 'index.js')
    : getResourcePath('server', 'dist', 'index.js');

  const { startServer } = await import(pathToFileURL(serverPath).href);
  const { port } = await startServer(staticDir);

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    title: 'Maps Lead Gen',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  Menu.setApplicationMenu(null);
  mainWindow.loadURL(`http://127.0.0.1:${port}`);
  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(startApp);
app.on('window-all-closed', () => app.quit());
