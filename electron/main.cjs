const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
let mainWindow = null;

function writeStartupLog(message) {
  try {
    const logDir = app.getPath('userData');
    fs.mkdirSync(logDir, { recursive: true });
    fs.appendFileSync(
      path.join(logDir, 'startup.log'),
      `[${new Date().toISOString()}] ${message}\n`,
      'utf8',
    );
  } catch (error) {
    console.error('Failed to write startup log:', error);
  }
}

function getResourcePath(...segments) {
  return app.isPackaged
    ? path.join(process.resourcesPath, ...segments)
    : path.join(__dirname, '..', ...segments);
}

async function startApp() {
  writeStartupLog(`startApp invoked (packaged=${app.isPackaged})`);

  const staticDir = app.isPackaged
    ? getResourcePath('client-dist')
    : getResourcePath('client', 'dist');

  const serverPath = app.isPackaged
    ? getResourcePath('server-dist', 'index.cjs')
    : getResourcePath('server', 'bundle', 'index.cjs');

  writeStartupLog(`staticDir=${staticDir}`);
  writeStartupLog(`serverPath=${serverPath}`);

  delete require.cache[require.resolve(serverPath)];
  const { startServer } = require(serverPath);
  writeStartupLog('server bundle loaded');
  const { port } = await startServer(staticDir);
  writeStartupLog(`server started on port ${port}`);

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
  const appUrl = `http://127.0.0.1:${port}`;
  writeStartupLog(`loading ${appUrl}`);
  mainWindow.loadURL(appUrl);
  mainWindow.webContents.on('did-finish-load', () => {
    writeStartupLog('renderer finished loading');
  });
  mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL) => {
    writeStartupLog(`renderer failed to load ${validatedURL} (${errorCode} ${errorDescription})`);
  });
  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(startApp).catch(async (error) => {
  console.error('Failed to start Maps Lead Gen:', error);
  writeStartupLog(`app.whenReady/startApp failed: ${error instanceof Error ? error.stack || error.message : String(error)}`);

  await dialog.showMessageBox({
    type: 'error',
    title: 'Maps Lead Gen failed to start',
    message: 'The desktop app could not start.',
    detail: error instanceof Error ? error.stack || error.message : String(error),
  });

  app.quit();
});

process.on('uncaughtException', async (error) => {
  console.error('Uncaught exception in Maps Lead Gen:', error);
  writeStartupLog(`uncaughtException: ${error instanceof Error ? error.stack || error.message : String(error)}`);

  await dialog.showMessageBox({
    type: 'error',
    title: 'Maps Lead Gen crashed',
    message: 'An unexpected error occurred while starting the app.',
    detail: error instanceof Error ? error.stack || error.message : String(error),
  });

  app.quit();
});

process.on('unhandledRejection', async (reason) => {
  console.error('Unhandled rejection in Maps Lead Gen:', reason);
  writeStartupLog(`unhandledRejection: ${reason instanceof Error ? reason.stack || reason.message : String(reason)}`);

  await dialog.showMessageBox({
    type: 'error',
    title: 'Maps Lead Gen failed to start',
    message: 'An unexpected startup error occurred.',
    detail: reason instanceof Error ? reason.stack || reason.message : String(reason),
  });

  app.quit();
});

app.on('window-all-closed', () => app.quit());
