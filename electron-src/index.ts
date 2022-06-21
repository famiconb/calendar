// Native
import { join } from "path";
import { format } from "url";

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent } from "electron";
import isDev from "electron-is-dev";
import prepareNext from "electron-next";
import {PythonShell, Options} from 'python-shell';

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

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on("python message", (event: IpcMainEvent, message: any) => {
  console.log(message);
  const options: Options = {
    mode: 'text',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: './',
    args: ['value1', 'value2', 'value3']
  };
  
  PythonShell.run('test.py', options, function (err, results) {
    if (err) console.log("E: ", err);
    // results is an array consisting of messages collected during execution
    console.log('results: %j', results);
    setTimeout(() => event.sender.send("python message", results), 500);
  });
  setTimeout(() => event.sender.send("python message", "hi from electron"), 500);
});
