import {action, computed, observable} from "mobx";
import {IProfileEntity} from "kokoro-io/dist/src/lib/IPuripara";
import Pripara, {Aikatsu} from "../infrastructures/kokoro.io";
import BaseStore, {Mode, State} from "./BaseStore";

export enum AuthStatus {
	Unauthorized = 0,
	Authorized = 1,
}

export default class AuthStore extends BaseStore {
	@observable
	// @ts-ignore
	public authStatus: AuthStatus;

	@observable
	public userInfo: IProfileEntity;

	constructor() {
		super();

		this.authStatus = AuthStatus.Unauthorized;
		this.userInfo = {} as IProfileEntity;
	}

	@computed
	public get name() {
		if (this.userInfo && this.userInfo.display_name) {
			return this.userInfo.display_name;
		} else {
			return "";
		}
	}

	@computed
	public get avatar() {
		if (this.userInfo && this.userInfo.avatar) {
			return this.userInfo.avatar;
		} else {
			// REF: https://qiita.com/CloudRemix/items/92e68a048a0da93ed240
			return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=";
		}
	}

	@action
	public async login(baseUrl: string, username: string, password: string) {
		this.setMode(Mode.LOGIN);
		this.setState(State.RUNNING);

		try {
			const authResult = await Aikatsu.postDevice(baseUrl, username, password, {
				name: "kokoro.desktop",
				device_identifier: await global.machineId(),
				kind: "chrome",
			});
			localStorage.token = authResult.access_token.token;
			this.restoreLogin();
		} catch (e) {
			console.log("login error:", e);
			this.setState(State.ERROR);
		}
	}

	@action
	public async restoreLogin() {
		this.setMode(Mode.LOGIN);
		this.setState(State.RUNNING);

		const token = localStorage.token || "";
		if (token === "") {
			this.setState(State.ERROR);
			return;
		}

		Pripara.initializeClient(token);
		await this.checkAuth();

		if (this.authStatus === AuthStatus.Authorized) {
			this.setState(State.DONE);
		} else {
			this.setState(State.ERROR);
		}
	}

	@action
	public logout() {
		localStorage.removeItem("token");
		this.authStatus = AuthStatus.Unauthorized;
		this.userInfo = {} as IProfileEntity;
	}

	@action
	public async checkAuth() {
		try {
			const me = await Pripara.client.Api.Profiles.getMyProfile();
			// NOTE: 何が返ってくるのか覚えてないけどこんなもんでええじゃろ
			if (!me || !me.id || me.id === "") {
				throw new Error("invalid account");
			}
			this.userInfo = me;
			this.authStatus = AuthStatus.Authorized;
		} catch (e) {
			this.logout();
		}
	}
}
