import {action, observable} from "mobx";
import {IMembershipEntity} from "kokoro-io/dist/src/lib/IPuripara";
import Pripara, {Events} from "../infrastructures/kokoro.io";
import BaseStore, {Mode, State} from "./BaseStore";

export default class ChannelStore extends BaseStore {
	constructor() {
		super();

		this.memberships = [];

		Pripara.on(Events.OnSDKReady, () => this._fetchChannels());
	}

	@observable
	public memberships: IMembershipEntity[];

	@action
	public async fetchChannels() {
		this.setMode(Mode.LOGIN);
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
}
