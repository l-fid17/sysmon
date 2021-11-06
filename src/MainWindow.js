const { BrowserWindow } = require("electron");

class MainWindow extends BrowserWindow {
  constructor(file, icon, isDev) {
    super({
      title: "SysMon",
      width: isDev ? 700 : 355,
      height: 500,
      show: true,
      icon: icon,
      resizable: isDev,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    this.loadFile(file);

    if (isDev) {
      this.webContents.openDevTools();
    }
  }
}

module.exports = MainWindow;
