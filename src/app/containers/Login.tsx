import * as React from "react";
import store from "../stores";
import {inject, observer} from "mobx-react";
import Form, { Field } from "@atlaskit/form";
import Button from "@atlaskit/button";
import TextField from "@atlaskit/textfield";
import SVG from "react-svg-inline";
import Icon from "../assets/kokoroio_icon_white.svg";
import AuthStore from "../stores/AuthStore";
import ChannelStore from "../stores/ChannelStore";
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
	login: style({
		width: "66vw",
		minWidth: "320px",
		maxWidth: "640px",
	}),
	loginButton: style({
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: "1rem",
		color: "#ff5854",
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
				<SVG svg={Icon}/>
			</div>
		)
	}

	private login() {
		return (
			<div className={styles.login}>
				<Form onSubmit={(formData: {email: string, password: string}) => {
					const {email, password} = formData;
					this.props.AuthStore!.login("https://kokoro.io", email, password);
				}}>
					{
						// @ts-ignore
						({formProps}) => (
						<form {...formProps}>
							<Field name="email" defaultValue="" label="メールアドレス" isRequired>
								{
									// @ts-ignore
									({ fieldProps }) => <TextField {...fieldProps} type={"email"} />
								}
							</Field>
							<Field name="password" defaultValue="" label="パスワード" isRequired>
								{
									// @ts-ignore
									({ fieldProps }) => <TextField {...fieldProps} type={"password"} />
								}
							</Field>
							<div className={styles.loginButton}>
								<div>ログインに失敗しました</div>
								<Button type="submit" appearance="primary">
									ログイン
								</Button>
							</div>
						</form>
					)}
				</Form>
			</div>
		);
	}

	public render() {
		if (this.props.ChannelStore!.state === State.DONE) {
			return (
				<div/>
			)
		}

		let component;
		if (this.props.AuthStore!.state === State.ERROR) {
			component = this.login();
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
