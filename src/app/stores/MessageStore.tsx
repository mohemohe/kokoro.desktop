import {action, observable} from "mobx";
import {IMessageEntity} from "kokoro-io/dist/src/lib/IPuripara";
import {EventType, IActionCableMessage} from "kokoro-io/dist/src/lib/ActionCable";
import Pripara, {Events} from "../infrastructures/kokoro.io";
import BaseStore, {Mode, State} from "./BaseStore";
import stores from "./index";

export default class MessageStore extends BaseStore {
	@observable
	public messages: { [index: string]: IMessageEntity[] };

	@observable
	public inputs: { [index: string]: string };

	private shouldReload: boolean;

	constructor() {
		super();

		this.messages = {};
		this.inputs = {};
		this.shouldReload = false;

		if (Pripara.initialized) {
			this.trackMessage();
		}
		Pripara.on(Events.OnSDKReady, () => {
			this.trackMessage();
			Pripara.client.Stream.on(EventType.Disconnect, () => this.shouldReload = true);
			Pripara.client.Stream.on(EventType.Connect, () => {
				if (this.shouldReload) {
					this.shouldReload = false;

					const id = stores.ChannelStore.activeId;
					const messages = this.messages[id] || [];
					this.reFetchMessage(id, messages.length);
				}
			});
		});
	}

	@action
	public async fetchMessage(id: string) {
		this.inputs[id] = this.inputs[id] || "";

		this.setMode(Mode.GET);
		this.setState(State.RUNNING);

		if (Pripara.initialized) {
			await this._fetchMessage(id);
		} else {
			const deferFetch = (id: string) => {
				this._fetchMessage(id);
				Pripara.off(Events.OnSDKReady, deferFetch);
			};
			Pripara.on(Events.OnSDKReady, () => deferFetch(id));
		}
	}

	@action
	public async fetchMoreMessage(id: string, beforeId: number) {
		this.setMode(Mode.GET);
		this.setState(State.RUNNING);

		if (Pripara.initialized) {
			await this._fetchMessage(id, beforeId);
		} else {
			const deferFetch = (id: string, beforeId: number) => {
				this._fetchMessage(id, beforeId);
				Pripara.off(Events.OnSDKReady, deferFetch);
			};
			Pripara.on(Events.OnSDKReady, () => deferFetch(id, beforeId));
		}
	}

	@action
	private async _fetchMessage(id: string, beforeId?: number) {
		let messages = await Pripara.client.Api.Channels.getChannelMessages(id, 30, beforeId);
		if (!messages) {
			this.setState(State.ERROR);
			return;
		}
		console.log("messages:", messages);
		messages = messages.reverse();
		console.log("messages:", messages);
		console.log("channel:", id, "beforeId:", beforeId, "messages:", messages);
		if (beforeId) {
			this.messages[id] = [...messages, ...this.messages[id]];
		} else {
			this.messages[id] = messages;
		}
		this.messages = {...this.messages};
		this.setState(State.DONE);
	}

	@action
	private async reFetchMessage(id: string, limit: number) {
		let messages = await Pripara.client.Api.Channels.getChannelMessages(id, limit);
		if (!messages) {
			this.setState(State.ERROR);
			return;
		}
		console.log("messages:", messages);
		messages = messages.reverse();
		console.log("messages:", messages);
		console.log("channel:", id, "messages:", messages);
		this.messages[id] = messages;
		this.messages = {...this.messages};
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
		console.log("MessageStore", "onMessage:", message);

		if (this.messages[data.channel.id]) {
			const index = this.messages[data.channel.id].findIndex((message) => message.id === data.id);
			if (index !== -1) {
				this.messages[data.channel.id][index] = data;
			} else {
				this.messages[data.channel.id].push(data);
			}
		} else {
			// NOTE: 初回ロードに任せる
			// this.messages[data.channel.id] = [data];
		}
		console.log("MessageStore", "nextMessages:", this.messages);
		this.messages = {...this.messages};
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
