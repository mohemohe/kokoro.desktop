import * as React from "react";
import { Provider } from "mobx-react";
import store from "../stores";
import Router from "./Router";

interface IProps {
}

interface IState {
}

export default class Timeline extends React.Component<IProps, IState> {
	constructor(props: IProps, state: IState) {
		super(props, state);
		this.store = store;
	}

	private store: any;

	public render() {
		return (
			<div>うんこ</div>
		);
	}
}
