import * as React from "react";
import store from "../stores";
import {inject, observer} from "mobx-react";
import AuthStore from "../stores/AuthStore";
import ChannelStore from "../stores/ChannelStore";
import Icon from "../assets/kokoroio_icon_white.svg";
import {style} from "typestyle";
import {State} from "../stores/BaseStore";

interface IProps {
	AuthStore?: AuthStore;
	ChannelStore?: ChannelStore;
}

interface IState {
}

const styles = {
	root: style({
		position: "fixed",
		left: 0,
		top: 0,
		width: "100vw",
		height: "100vh",
		zIndex: 1000,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		background: "#1d1d1d",
	}),
	loading: style({
		animation: "loading-spin 1.5s ease-in-out infinite",
	}),
};

@inject("AuthStore", "ChannelStore")
@observer
export default class Login extends React.Component<IProps, IState> {
	private store: any;

	constructor(props: IProps, state: IState) {
		super(props, state);
		this.store = store;
	}

	public componentDidMount() {
		this.props.AuthStore!.restoreLogin();
	}

	private loading() {
		return (
			<div className={styles.loading}>
				<Icon/>
			</div>
		)
	}

	public render() {
		if (this.props.ChannelStore!.state === State.DONE) {
			return (
				<div/>
			)
		}

		let component;
		if (this.props.AuthStore!.state === State.ERROR) {
			component = (
				<div/>
			);
		} else {
			component = this.loading();
		}

		return (
			<div className={styles.root}>
				{component}
			</div>
		);
	}
}
