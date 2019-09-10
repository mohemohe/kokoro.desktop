import * as React from "react";
import store from "../stores";

interface IProps {
}

interface IState {
}

export default class Null extends React.Component<IProps, IState> {
	private store: any;

	constructor(props: IProps, state: IState) {
		super(props, state);
		this.store = store;
	}

	public render() {
		return (
			<div>NULL</div>
		);
	}
}
