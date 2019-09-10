import * as React from "react";
import {style} from "typestyle";
import {inject, observer} from "mobx-react";
import {Route, Router as ReactRouter, Switch} from "react-router";
import {createHashHistory} from "history";
import MobxReactRouter, {RouterStore, syncHistoryWithStore} from "mobx-react-router";
import {SyncedRouter} from "../components/SyncedRouter";
import {Sidebar} from "./Sidebar";
import Timeline from "./Timeline";
import Null from "./Null";
import AuthStore from "../stores/AuthStore";

interface IProps {
	RouterStore?: RouterStore;
	AuthStore?: AuthStore;
}

interface IState {
}

const styles = {
	root: style({
		height: "100vh",
		minHeight: "100vh",
		maxHeight: "100vh",
		display: "flex",
	}),
	contents: style({
		display: "flex",
		flex: 1,
		flexDirection: "column" as "column",
		minHeight: "100%",
		width: "100%",
		maxWidth: "100%",
		overflow: "auto",
	}),
	logout: style({
		display: "flex",
		alignItems: "flex-end",
	}),
};

@inject("RouterStore", "AuthStore")
@observer
export default class Router extends React.Component<IProps, IState> {
	private history: MobxReactRouter.SynchronizedHistory;

	constructor(props: IProps, state: IState) {
		super(props, state);

		const history = createHashHistory();
		this.history = syncHistoryWithStore(history, this.props.RouterStore!);
	}

	public async componentDidMount() {
		this.props.AuthStore!.restoreLogin();
	}

	public render() {
		return (
			<ReactRouter history={this.history}>
				<div className={styles.root}>
					<Sidebar/>
					<div className={styles.contents}>
						<SyncedRouter history={this.props.RouterStore!.history}>
							<Switch>
								<Route path={"/"} component={Null} exact={true}/>
								<Route path={"/channels/:id"} component={Timeline} exact={true}/>
							</Switch>
						</SyncedRouter>
					</div>
				</div>
			</ReactRouter>
		);
	}
}
