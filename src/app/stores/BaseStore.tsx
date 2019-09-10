import {action, observable} from "mobx";
import stores from "./index";

export enum State {
	IDLE,
	RUNNING,
	DONE,
	ERROR,
}

export enum Mode {
	NONE,
	GET,
	SEARCH,
	CREATE,
	UPDATE,
	DELETE,
	ACTIVATE,
	LOGIN,
	LOGOUT,
	IMPORT,
}

export interface IPagitane {
	current: number;
	perPage: number;
	recordsOnPage: number;
	totalPages: number;
	totalRecords: number;
}

export default class BaseStore {
	@observable
	public state: State;
	@observable
	public mode: Mode;

	constructor() {
		this.state = State.IDLE;
		this.mode = Mode.NONE;
	}

	protected get authStatus() {
		return stores.AuthStore.authStatus;
	}

	@action.bound
	public setState(state: State) {
		this.state = state;
	}

	@action.bound
	public resetState() {
		this.state = State.IDLE;
	}

	@action.bound
	public setMode(mode: Mode) {
		this.mode = mode;
	}

	@action.bound
	public resetMode() {
		this.mode = Mode.NONE;
	}
}
