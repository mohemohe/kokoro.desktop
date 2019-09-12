import {action, observable} from "mobx";
import {IMessageEntity} from "kokoro-io/dist/src/lib/IPuripara";
import Pripara, {Events} from "../infrastructures/kokoro.io";
import BaseStore, {Mode, State} from "./BaseStore";
import {IActionCableMessage} from "kokoro-io/dist/src/lib/ActionCable";

export default class MessageStore extends BaseStore {
	@observable
	public messages: { [index: string]: IMessageEntity[] };
	@observable
	public inputs: { [index: string]: string };

	constructor() {
		super();

		this.messages = {};
		this.inputs = {};

		if (Pripara.initialized) {
			this.trackMessage();
		}
		Pripara.on(Events.OnSDKReady, () => this.trackMessage());
	}

	@action
	public async fetchMessage(id: string) {
		this.inputs[id] = this.inputs[id] || "";

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
		Pripara.client.Stream.on(Pripara.client.Stream.Event.Chat, (message: IActionCableMessage<IMessageEntity>) => this.onMessage(message));
		Pripara.client.Stream.on(Pripara.client.Stream.Event.Event, (event: any) => console.log("event:", event));
		Pripara.client.Stream.on(Pripara.client.Stream.Event.Connect, async () => {
			const memberships = await Pripara.client.Api.Memberships.getMemberships();
			const channels = Pripara.client.Helper.membershipsToChannelIds(memberships);
			Pripara.client.Helper.subscribeChatChannelByChannelIds(Pripara.client.Stream, channels);
		});
		Pripara.client.Stream.connect(true);
	}

	@action
	private async onMessage(message: IActionCableMessage<IMessageEntity>) {
		const {data} = message;
		if (!data) {
			return;
		}
		if (this.messages[data.channel.id]) {
			const index = this.messages[data.channel.id].findIndex((message) => message.id === data.id);
			if (index !== -1) {
				this.messages[data.channel.id][index] = data;
			} else {
				this.messages[data.channel.id].unshift(data);
			}
		} else {
			this.messages[data.channel.id] = [data];
		}
	}

	@action
	public async onInputMessage(id: string, message: string) {
		this.inputs[id] = message;
	}

	@action
	public async sendMessage(id: string) {
		try {
			await Pripara.client.Api.Channels.postChannelMessage(id, {
				message: this.inputs[id]
			});
			this.inputs[id] = "";
		} catch (e) {
			console.error("message send error:", e);
		}
	}
}
