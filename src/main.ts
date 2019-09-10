import path from "path";
import {app, BrowserWindow} from "electron";

app.on("ready", () => {
	const window = new BrowserWindow({
		height: 800,
		useContentSize: true,
		webPreferences: {
			allowRunningInsecureContent: false,
			nodeIntegration: false,
			preload: path.join(__dirname, "preload.js"),
			sandbox: false,
		},
		width: 1200,
	});
	window.loadFile(path.join(__dirname, "index.html"));
});
