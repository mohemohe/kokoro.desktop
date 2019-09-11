import EventEmitter from "eventemitter3";
import KokoroIo from "kokoro-io/dist/src/lib/kokoro.io";

(window as any).global = window;
let _client: KokoroIo;

export enum Events {
	OnSDKReady = "ON_SDK_READY",
}

export class Aikatsu {
	public static postDevice = global.kokoro.io.postDevice;
}

class Pripara extends EventEmitter {
	public get client() {
		return _client;
	}

	public get initialized() {
		return _client != null;
	}

	public initializeClient(accessToken: string) {
		_client = new global.kokoro.io({
			accessToken,
		});
		this.emit(Events.OnSDKReady);
	}
}

const pripara = new Pripara();
export {pripara as default};
