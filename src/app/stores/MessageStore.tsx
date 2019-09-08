import {action, observable} from "mobx";
import {IMessageEntity} from "kokoro-io/dist/src/lib/IPuripara";
import Pripara, {Events} from "../infrastructures/kokoro.io";
import BaseStore, {Mode, State} from "./BaseStore";
import {IMembershipEntity} from "kokoro-io/src/lib/IPuripara";
import {IActionCableMessage} from "kokoro-io/dist/src/lib/ActionCable";

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
		Pripara.client.Stream.on("chat" as "Chat", (message: IActionCableMessage) => this.onMessage(message));
		Pripara.client.Stream.on("event" as "Event", (event: any) => console.log("event:", event));
		Pripara.client.Stream.on("connect" as "Connect", async () => {
			const memberships = await Pripara.client.Api.Memberships.getMemberships();
			const channels = memberships.map((membership: IMembershipEntity) => {
				return membership.channel.id;
			});
			Pripara.client.Stream.send("message", {
				action: "subscribe",
				channels,
			});
		});
		Pripara.client.Stream.connect(true);
	}

	@action
	private async onMessage(message: IActionCableMessage) {
		const data = message.data as IMessageEntity;
		if (this.messages[data.channel.id]) {
			this.messages[data.channel.id].unshift(data);
		} else {
			this.messages[data.channel.id] = [data];
		}
	}
}
