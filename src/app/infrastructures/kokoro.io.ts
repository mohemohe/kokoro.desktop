import EventEmitter from "eventemitter3";
import KokoroIo from "kokoro-io/dist/src/lib/kokoro.io";

let _client: KokoroIo;

export enum Events {
	OnSDKReady = "ON_SDK_READY",
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
			autoReconnect: true,
		});
		this.emit(Events.OnSDKReady);
	}
}

const pripara = new Pripara();
export {pripara as default};
