// Native
import { join } from "path";
import { format } from "url";

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent, globalShortcut } from "electron";
import isDev from "electron-is-dev";
import prepareNext from "electron-next";

// Prepare the renderer once the app is ready
app.on("ready", async () => {
  await prepareNext("./renderer");

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      preload: join(__dirname, "preload.js"),
    },
  });

  const url = isDev
    ? "http://localhost:8000/"
    : format({
        pathname: join(__dirname, "../renderer/out/index.html"),
        protocol: "file:",
        slashes: true,
      });

  mainWindow.loadURL(url);
});

// Quit the app once all windows are closed
app.on("window-all-closed", app.quit);

app.on("browser-window-focus", () => {
  for(const key in ['CommandOrControl+R','CommandOrControl+Shift+R', 'F5']) {
    globalShortcut.register(key, () => {})
  }
})
app.on("browser-window-blur", () => {
  for(const key in ['CommandOrControl+R','CommandOrControl+Shift+R', 'F5']) {
    globalShortcut.unregister(key)
  }
})

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on("message", (event: IpcMainEvent, message: any) => {
  console.log(message);
  setTimeout(() => event.sender.send("message", "hi from electron"), 500);
});
