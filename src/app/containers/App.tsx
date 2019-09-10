import * as React from "react";
import {Provider} from "mobx-react";
import store from "../stores";
import Router from "./Router";

interface IProps {
}

interface IState {
}

export default class App extends React.Component<IProps, IState> {
	private store: any;

	constructor(props: IProps, state: IState) {
		super(props, state);
		this.store = store;
	}

	public render() {
		return (
			<Provider {...this.store}>
				<Router {...this.props}/>
			</Provider>
		);
	}
}
