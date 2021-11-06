const path = require("path");
const { app, ipcMain } = require("electron");
const log = require("electron-log");

const Store = require("./src/Store");
const MainWindow = require("./src/MainWindow");
const AppTray = require("./src/AppTray");
const AppMenu = require("./src/AppMenu");

process.env.NODE_ENV = "production";

let mainWindow;
let tray;

const isDev = process.env.NODE_ENV !== "production";
const isMac = process.platform === "darwin";

const appIcon = path.join(__dirname, "assets", "icons", "icon.png");
const trayIcon = path.join(__dirname, "assets", "icons", "tray_icon.png");

const store = new Store({
  configName: "user-settings",
  defaults: {
    settings: {
      CPU_THRESHOLD: 80,
      ALERT_FREQUENCY: 5,
    },
  },
});

app.whenReady().then(() => {
  mainWindow = new MainWindow(
    path.join(__dirname, "src", "UI", "index.html"),
    appIcon,
    isDev
  );

  mainWindow.webContents.on("dom-ready", () => {
    mainWindow.webContents.send("settings:get", store.get("settings"));
  });

  new AppMenu(mainWindow, app, isMac, isDev);

  mainWindow.on("close", (e) => {
    if (!app.isQuitting) {
      e.preventDefault();
      mainWindow.hide();
    }

    return true;
  });

  tray = new AppTray(mainWindow, app, trayIcon);

  mainWindow.on("closed", () => (mainWindow = null));
});

ipcMain.on("settings:set", (e, data) => {
  store.set("settings", data);
  mainWindow.webContents.send("settings:get", store.get("settings"));
});

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
