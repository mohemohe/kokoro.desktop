import * as React from "react";
import { Link } from "react-router-dom";
import { inject, observer } from "mobx-react";
import {style} from "typestyle";
import ChannelStore from "../stores/ChannelStore";
import {FiHash, FiLock, FiMail} from "react-icons/fi";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import MessageStore from "../stores/MessageStore";

const styles = {
	root: style({
		width: 220,
		maxWidth: 220,
		minWidth: 220,
		overflowY: "hidden",
		display: "flex",
		flexDirection: "column",
		zIndex: 200,
		background: "#1d1d1d",
		color: "#fafaff",
	}),
	sidebarHeader: style({
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		height: 48,
	}),
	channelsHeader: style({
		padding: "2px 1rem",
		color: "#898989",
		fontWeight: "bold",
	}),
	channels: style({
		flex: 1,
		display: "flex",
	}),
	channel: style({
		display: "flex",
		padding: "3px 0.5em 3px 1em",
		textDecoration: "none",
		color: "#898989",
		$nest: {
			"&:hover": {
				background: "#075566",
			},
		},
	}),
	activeChannel: style({
		background: "#0ba8ca !important",
		color: "#fafaff",
	}),
	channelName: style({
		overflow: "hidden",
		whiteSpace: "nowrap",
		textOverflow: "ellipsis",
		fontSize: 15,
	}),
	icon: style({
		display: "inline",
		marginRight: "0.2em",
	}),
};

interface IProps extends React.ClassAttributes<{}> {
	ChannelStore?: ChannelStore;
	MessageStore?: MessageStore;
}

interface IState extends React.ComponentState {
	collapse: any;
	selected: string;
}

@inject("ChannelStore", "MessageStore")
@observer
export class Sidebar extends React.Component<IProps, IState> {
	public componentDidMount() {
		this.props.ChannelStore!.fetchChannels();
	}

	public render() {
		return (
			<div className={styles.root}>
				<div className={styles.sidebarHeader}>
					kokoro.desktop
				</div>
				<div className={styles.channels}>
					<OverlayScrollbarsComponent options={{className: "os-theme-light", scrollbars: {autoHide: "leave", autoHideDelay: 300}}}>
						<div>
							<div className={styles.channelsHeader}>
								Channels
							</div>
							{
								this.props.ChannelStore!.memberships.map((membership) => {
									const classNames = [styles.channel];
									if (membership.channel.id === this.props.MessageStore!.lastId) {
										classNames.push(styles.activeChannel);
									}

									let icon;
									if (membership.channel.kind.includes("public")) {
										icon = <FiHash/>;
									} else if (membership.channel.kind.includes("private")) {
										icon = <FiLock/>;
									} else if (membership.channel.kind.includes("direct")) {
										icon = <FiMail/>;
									}

									return (
										<Link to={`/channels/${membership.channel.id}`} className={classNames.join(" ")} key={membership.channel.id}>
											<div className={styles.channelName}>
												<div className={styles.icon}>
													{icon}
												</div>
												{membership.channel.channel_name}
											</div>
										</Link>
									)
								})
							}
						</div>
					</OverlayScrollbarsComponent>
				</div>
			</div>
		);
	}
}
