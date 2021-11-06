const { Menu } = require("electron");

class AppMenu extends Menu {
  constructor(mainWindow, app, isMac, isDev) {
    super();

    this.mainWindow = mainWindow;
    this.app = app;
    this.isMac = isMac;
    this.isDev = isDev;
    this.menu = Menu.buildFromTemplate([
      ...(this.isMac ? [{ role: "appMenu" }] : []),
      {
        label: "File",
        submenu: [
          {
            label: "Close",
            click: () => {
              this.mainWindow.hide();
            },
            accelerator: "CommandOrControl+W",
          },
          {
            label: "Quit",
            click: () => {
              this.app.isQuitting = true;
              this.app.quit();
            },
            accelerator: "CommandOrControl+Q",
          },
        ],
      },
      {
        label: "View",
        submenu: [
          {
            label: "Toggle Navigation",
            click: () => this.mainWindow.webContents.send("nav:toggle"),
            accelerator: "CommandOrControl+Shift+N",
          },
        ],
      },
      ...(this.isDev
        ? [
            {
              label: "Developer",
              submenu: [
                { role: "reload" },
                { role: "forcereload" },
                { type: "separator" },
                { role: "toggledevtools" },
              ],
            },
          ]
        : []),
    ]);

    Menu.setApplicationMenu(this.menu);
  }
}

module.exports = AppMenu;
