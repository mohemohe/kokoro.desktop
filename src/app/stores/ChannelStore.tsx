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
		this.activeId = "";

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
			this.memberships = memberships;
			console.log("memberships:", memberships);
			this.setState(State.DONE);
		} else {
			this.setState(State.ERROR);
		}
	}

	@action
	public setActiveChannel(id: string) {
		this.activeId = id;
	}

	@computed
	public get activeChannel(): IMembershipEntity | undefined {
		return this.memberships.find((memberships) => memberships.channel.id === this.activeId);
	}
}
