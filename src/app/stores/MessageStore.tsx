import {action, observable} from "mobx";
import {IMessageEntity} from "kokoro-io/dist/src/lib/IPuripara";
import Pripara, {Events} from "../infrastructures/kokoro.io";
import BaseStore, {Mode, State} from "./BaseStore";

export default class MessageStore extends BaseStore {
	constructor() {
		super();

		this.messages = {};
		this.lastId = "";

		if (Pripara.initialized) {
			this.trackMessage();
		}
		Pripara.on(Events.OnSDKReady, () => this.trackMessage());
	}

	@observable
	public messages: {[index: string]: IMessageEntity[]};

	@observable
	public lastId: string;

	@action
	public async fetchMessage(id: string) {
		this.lastId = id;

		this.setMode(Mode.GET);
		this.setState(State.RUNNING);

		if (Pripara.initialized) {
			this._fetchMessage(id);
		} else {
			const deferFetch = (id: string) => {
				this._fetchMessage(id);
				Pripara.off(Events.OnSDKReady, deferFetch);
			};
			Pripara.on(Events.OnSDKReady, () => deferFetch(id));
		}
	}

	@action
	private async _fetchMessage(id: string) {
		const messages = await Pripara.client.Api.Channels.getChannelMessages(id, 20);
		if (!messages) {
			this.setState(State.ERROR);
			return;
		}
		console.log("channel:", id, "messages:", messages);
		this.messages[id] = messages;
		this.setState(State.DONE);
	}

	@action
	private async trackMessage() {
		Pripara.client.Stream.on("Chat", (message: IMessageEntity) => this.onMessage(message));
		Pripara.client.Stream.connect(true);
	}

	@action
	private async onMessage(message: IMessageEntity) {
		console.log("message:", message);
	}
}
