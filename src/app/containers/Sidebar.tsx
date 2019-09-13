import * as React from "react";
import {Link} from "react-router-dom";
import {inject, observer} from "mobx-react";
import {style} from "typestyle";
import ChannelStore from "../stores/ChannelStore";
import MessageStore from "../stores/MessageStore";
import {ChannelIcon} from "../components/ChannelIcon";
import {OverlayScrollbarsComponent} from "overlayscrollbars-react";
import {AutoSizer} from "react-virtualized";
import {DynamicSizeList as List} from "react-window-dynamic";

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
	scroller: style({
		flex: 1,
		display: "flex",
		$nest: {
			"& > .os-host": {
				flex: 1,
			},
			"& .list": {
				height: "auto !important",
			},
		},
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
		this.listRef = null;
	}

	private listRef: List | null;

	public componentDidMount() {
		this.props.ChannelStore!.fetchChannels();
	}

	public render() {
		const items = [
			<div className={styles.channelsHeader}>
				Channels
			</div>,
			...this.props.ChannelStore!.memberships.sort((a, b) => a.channel.channel_name.toLowerCase() < b.channel.channel_name.toLowerCase() ? -1 : 1).map((membership) => {
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
				<div className={styles.scroller}>
					<OverlayScrollbarsComponent options={{
						className: "os-theme-light",
						scrollbars: {
							autoHide: "leave",
							autoHideDelay: 300
						},
						callbacks: {
							onScroll: (event) => {
								if (this.listRef) {
									const y = (event!.currentTarget! as any).scrollTop;
									this.listRef.scrollTo(y);
								}
							},
						},
					}}>
						<AutoSizer>
							{({height, width}) => (
								<List
									className={"list"}
									width={width}
									height={height}
									itemCount={items.length}
									ref={(elem) => this.listRef = elem}
								>
									{
										React.forwardRef((props, ref: any) => (
											<div ref={ref} style={props.style}>
												{items[props.index]}
											</div>
										))
									}
								</List>
							)}
						</AutoSizer>
					</OverlayScrollbarsComponent>
				</div>
			</div>
		);
	}
}
