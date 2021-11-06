const { Tray, Menu } = require("electron");

class AppTray extends Tray {
  constructor(mainWindow, app, icon) {
    super(icon);

    this.mainWindow = mainWindow;
    this.app = app;

    this.setContextMenu(this.contextMenu);

    this.on("click", this.onClick);
  }

  contextMenu = Menu.buildFromTemplate([
    ...(process.platform === "linux"
      ? [
          {
            label: "Show",
            click: () =>
              this.mainWindow.isVisible() === true
                ? this.mainWindow.hide()
                : this.mainWindow.show(),
          },
        ]
      : []),
    {
      label: "Quit",
      click: () => {
        this.app.isQuitting = true;
        this.app.quit();
      },
    },
  ]);

  onClick = () => {
    if (this.mainWindow.isVisible() === true) {
      this.mainWindow.hide();
    } else {
      this.mainWindow.show();
    }
  };
}

module.exports = AppTray;
