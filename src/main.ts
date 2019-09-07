import path from "path";
import { app, BrowserWindow } from "electron";

app.on("ready", () => {
	const window = new BrowserWindow({
		webPreferences: {
			allowRunningInsecureContent: false,
			nodeIntegration: false,
			preload: path.join(__dirname, "preload.js"),
			sandbox: false,
		},
	});
	window.loadFile(path.join(__dirname, "index.html"));
});
