// Native
import { join } from "path";
import { format } from "url";

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent } from "electron";
import isDev from "electron-is-dev";
import prepareNext from "electron-next";
import {PythonShell, PythonShellError, Options} from 'python-shell';

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
ipcMain.on("check_graduation", (event: IpcMainEvent, message: any) => {
  console.log(message);
  const options: Options = {
    mode: 'text',
    pythonOptions: ['-u'], // get print results in real-time
    encoding: "utf8",
    cwd: './electron-src/graduation_requirements',
    args: [message[0], message[1], message[2]]
  };

  PythonShell.run('determine_and_recommendation.py', options, function (err: PythonShellError | undefined, output?: any[] | undefined) {
    if (err) {
      console.log("E: ", err);
      output = ["Error"];
    }
    // results is an array consisting of messages collected during execution
    console.log('results: %j', output);
    setTimeout(() => event.sender.send("check_graduation", output), 500);
  });
});
