import * as React from "react";
import {Link} from "react-router-dom";
import {inject, observer} from "mobx-react";
import {classes, style} from "typestyle";
import ChannelStore from "../stores/ChannelStore";
import MessageStore from "../stores/MessageStore";
import {ChannelIcon} from "../components/ChannelIcon";
import {OverlayScrollbarsComponent} from "overlayscrollbars-react";
import Badge from "@atlaskit/badge";
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
		justifyContent: "space-between",
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
		// this.listRef = React.createRef<List>();
	}

	// private listRef: React.RefObject<List>;

	public render() {
		const items = [
			<div className={styles.channelsHeader}>
				Channels
			</div>,
			...this.props.ChannelStore!.memberships.slice().map((membership) => {
				const classNames = [styles.channel];
				if (membership.channel.id === this.props.ChannelStore!.activeId) {
					classNames.push(styles.activeChannel);
				}

				return (
					<Link
						id={`sidebar-channel-${membership.channel.id}`}
						key={membership.channel.id}
						className={classes(...classNames)}
						to={`/channels/${membership.channel.id}`}
						onClick={() => {
							this.props.ChannelStore!.setActiveChannel(membership.channel.id);
						}}
					>
						<div className={styles.channelName}>
							<div className={styles.icon}>
								<ChannelIcon membership={membership}/>
							</div>
							<span>
								{membership.channel.channel_name}
							</span>

						</div>
						{
							this.props.MessageStore!.unReads[membership.channel.id] &&
							this.props.MessageStore!.unReads[membership.channel.id] > 0 &&
							<Badge appearance="important" max={99}>{this.props.MessageStore!.unReads[membership.channel.id]}</Badge>
						}
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
						// callbacks: {
						// 	onScroll: (event) => {
						// 		if (this.listRef.current) {
						// 			const y = (event!.currentTarget! as any).scrollTop;
						// 			this.listRef.current.scrollTo(y);
						// 		}
						// 	},
						// },
					}}>
						<div>
							{items}
						</div>
						{/*<AutoSizer>*/}
						{/*	{({height, width}) => (*/}
						{/*		<List*/}
						{/*			className={"list"}*/}
						{/*			width={width}*/}
						{/*			height={height}*/}
						{/*			itemCount={items.length}*/}
						{/*			ref={this.listRef}*/}
						{/*		>*/}
						{/*			{*/}
						{/*				React.forwardRef((props, ref: any) => (*/}
						{/*					<div ref={ref} style={props.style}>*/}
						{/*						{items[props.index]}*/}
						{/*					</div>*/}
						{/*				))*/}
						{/*			}*/}
						{/*		</List>*/}
						{/*	)}*/}
						{/*</AutoSizer>*/}
					</OverlayScrollbarsComponent>
				</div>
			</div>
		);
	}
}
