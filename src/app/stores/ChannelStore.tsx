import {action, observable, computed} from "mobx";
import {IMembershipEntity} from "kokoro-io/dist/src/lib/IPuripara";
import Pripara, {Events} from "../infrastructures/kokoro.io";
import BaseStore, {Mode, State} from "./BaseStore";

export default class ChannelStore extends BaseStore {
	@observable
	public memberships: IMembershipEntity[];
	@observable
	public activeId: string;

	constructor() {
		super();

		this.memberships = [];
		this.activeId = localStorage.activeChannelId || "";

		Pripara.on(Events.OnSDKReady, () => this._fetchChannels());
	}

	@action
	public async fetchChannels() {
		this.setMode(Mode.GET);
		this.setState(State.RUNNING);

		if (Pripara.initialized) {
			this._fetchChannels();
		}
	}

	@action
	private async _fetchChannels() {
		const memberships = await Pripara.client.Api.Memberships.getMemberships();
		if (memberships) {
			this.memberships = memberships.sort((a, b) => a.channel.channel_name.toLowerCase() < b.channel.channel_name.toLowerCase() ? -1 : 1);
			console.log("memberships:", memberships);
			this.setState(State.DONE);
		} else {
			this.setState(State.ERROR);
		}
	}

	@action
	public setActiveChannel(id: string, retry: number = 0) {
		this.activeId = id;
		localStorage.activeChannelId = id;

		// FIXME:
		window.requestAnimationFrame(() => {
			const target = document.getElementById(`sidebar-channel-${id}`);
			console.log("setActiveChannel", id, target);
			if (target) {
				(target as any).scrollIntoViewIfNeeded(true);
			} else if (retry < 600) {
				this.setActiveChannel(id, ++retry);
			}
		});
	}

	@computed
	public get activeChannel(): IMembershipEntity | undefined {
		console.log("activeChannel changed:", this.activeId);
		return this.memberships.find((memberships) => memberships.channel.id === this.activeId);
	}
}
