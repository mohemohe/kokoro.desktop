import * as React from "react";
import {Link} from "react-router-dom";
import {inject, observer} from "mobx-react";
import {style} from "typestyle";
import ChannelStore from "../stores/ChannelStore";
import MessageStore from "../stores/MessageStore";
import {VirtualizedOverlayScroller} from "../components/VirtualizedOverlayScroller";
import {ChannelIcon} from "../components/ChannelIcon";

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
	scrollTop: number;
}

@inject("ChannelStore", "MessageStore")
@observer
export class Sidebar extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);

		this.state = {
			scrollTop: 0,
		};
	}


	public componentDidMount() {
		this.props.ChannelStore!.fetchChannels();
	}

	public render() {
		const items = [
			<div className={styles.channelsHeader}>
				Channels
			</div>,
			...this.props.ChannelStore!.memberships.map((membership) => {
				const classNames = [styles.channel];
				if (membership.channel.id === this.props.ChannelStore!.activeId) {
					classNames.push(styles.activeChannel);
				}

				return (
					<Link
						key={membership.channel.id}
						className={classNames.join(" ")}
						to={`/channels/${membership.channel.id}`}
						onClick={() => {
							this.props.ChannelStore!.setActiveChannel(membership.channel.id);
						}}
						>
						<div className={styles.channelName}>
							<div className={styles.icon}>
								<ChannelIcon membership={membership}/>
							</div>
							{membership.channel.channel_name}
						</div>
					</Link>
				)
			})
		];

		return (
			<div className={styles.root}>
				<div className={styles.sidebarHeader}>
					kokoro.desktop
				</div>
				<VirtualizedOverlayScroller
					items={items}
					className={"os-theme-light"}
					children={null}
					isRowLoaded={((index) => true)}
					loadMoreRows={(async ({startIndex, stopIndex}) => ({}))}
				/>
			</div>
		);
	}
}
