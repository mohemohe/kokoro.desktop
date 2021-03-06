import * as React from "react";
import {RouteComponentProps} from "react-router";
import {inject, observer} from "mobx-react";
import MessageStore from "../stores/MessageStore";
import {Message} from "../components/Message";
import TextArea from "react-textarea-autosize";
import {style} from "typestyle";
import ChannelStore from "../stores/ChannelStore";
import {ChannelIcon} from "../components/ChannelIcon";
import AuthStore from "../stores/AuthStore";
import {Mode, State} from "../stores/BaseStore";
import OverlayScrollbars from "overlayscrollbars";
import {OverlayScrollbarsComponent} from "overlayscrollbars-react";
import {AutoSizer} from "react-virtualized";
import {DynamicSizeList as List} from "react-window-dynamic";
import InfiniteLoader from "react-window-infinite-loader";
import {toJS} from "mobx";
import ChatScroller from "../components/ChatScroller";

interface IProps extends RouteComponentProps<{ id: string }> {
	AuthStore?: AuthStore;
	MessageStore?: MessageStore;
	ChannelStore?: ChannelStore;
}

interface IState {
}

const styles = {
	root: style({
		display: "flex",
		flexDirection: "column",
		height: "100%",
	}),
	header: style({
		display: "flex",
		alignItems: "center",
		fontWeight: "bold",
		height: "3rem",
		borderBottom: "1px solid #d9d9d9"
	}),
	channelName: style({
		marginLeft: "1em",
	}),
	messages: style({
		flex: 1,
		overflowY: "auto",
		display: "flex",
		$nest: {
			"& > div": {
				width: "100%",
			},
		},
	}),
	textarea: style({
		width: "calc(100% - 1em)",
		resize: "none",
		padding: "0.5em",
		margin: "0.5em",
		border: "1px solid #605f60",
		borderRadius: "4px",
	}),
};

@inject("AuthStore", "MessageStore", "ChannelStore")
@observer
export default class Timeline extends React.Component<IProps, IState> {
	constructor(props: IProps, state: IState) {
		super(props, state);
		// this.listRef = React.createRef<InfiniteLoader>();
		// this.scrollRef = React.createRef<OverlayScrollbarsComponent>();
		// this.shouldScrollToBottom = false;
	}

	// private listRef: React.RefObject<InfiniteLoader>;
	// private scrollRef: React.RefObject<OverlayScrollbarsComponent>;
	// private shouldScrollToBottom: boolean;

	public componentDidMount() {
		this.onUpdate(this.props);
	}

	public UNSAFE_componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any) {
		this.onUpdate(nextProps);
	}

	private onUpdate(props: IProps) {
		console.log("Timeline onUpdate:", props.ChannelStore!.activeId);
		props.ChannelStore!.setActiveChannel(props.ChannelStore!.activeId || this.props.match.params.id);
		const messages = this.props.MessageStore!.messages[props.ChannelStore!.activeId];
		if (!messages || messages.length === 0) {
			props.MessageStore!.fetchMessage(props.ChannelStore!.activeId);
		}
	}

	// public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
	// 	console.log("componentDidUpdate");
	// 	console.log("shouldScrollToBottom:", this.shouldScrollToBottom);
	// 	if (prevProps.MessageStore!.mode === Mode.GET && prevProps.MessageStore!.state === State.DONE && this.shouldScrollToBottom) {
	// 		this.shouldScrollToBottom = false;
	// 		if (this.listRef.current && this.scrollRef.current) {
	// 			const instance = this.scrollRef.current.osInstance();
	// 			if (instance) {
	// 				const id = this.props.match.params.id;
	// 				const messages = this.props.MessageStore!.messages[id] || [];
	// 				console.log(messages.length - 1);
	// 				// this.listRef.current!.scrollToItem(messages.length - 1);
	// 				instance.scroll({
	// 					y: "100%",
	// 				});
	// 			}
	// 		}
	// 	}
	// }

	private header() {
		const membership = this.props.ChannelStore!.activeChannel;
		if (!membership) {
			return (
				<div className={styles.header}>
					<span className={styles.channelName}>
						{""}
					</span>
				</div>
			);
		}

		return (
			<div className={styles.header}>
				<span className={styles.channelName}>
					<ChannelIcon membership={membership}/>
					{membership.channel.channel_name}
				</span>
			</div>
		);
	}

	public render() {
		const id = this.props.match.params.id;
		const messages = this.props.MessageStore!.messages[this.props.match.params.id];

		console.log("Timeline render()", id, messages);

		return (
			<div className={styles.root}>
				{this.header()}
				<div className={styles.messages}>
					{!messages && <p>なうろーでぃん</p>}
					{messages && <ChatScroller key={`chatscroller-${id}`} channelId={id} />}
					{/*<OverlayScrollbarsComponent ref={this.scrollRef} options={{*/}
					{/*	className: "os-theme-dark",*/}
					{/*	scrollbars: {*/}
					{/*		autoHide: "leave",*/}
					{/*		autoHideDelay: 300*/}
					{/*	},*/}
					{/*	callbacks: {*/}
					{/*		onScroll: (event) => {*/}
					{/*			if (this.listRef.current) {*/}
					{/*				const y = (event!.currentTarget! as any).scrollTop;*/}
					{/*				requestAnimationFrame(() => {*/}
					{/*					this.listRef.current!.scrollTo(y);*/}
					{/*				});*/}
					{/*			}*/}
					{/*		},*/}
					{/*	},*/}
					{/*}}>*/}
					{/*	<AutoSizer>*/}
					{/*		{({height, width}) => (*/}
					{/*			<InfiniteLoader*/}
					{/*				isItemLoaded={(index) => 0 < index && index < items.length + 1}*/}
					{/*				itemCount={items.length + 2}*/}
					{/*				loadMoreItems={async (startIndex, stopIndex) => {*/}
					{/*					if (startIndex === 0 && messages.length !== 0) {*/}
					{/*						const firstMessage = toJS(messages)[0];*/}
					{/*						await this.props.MessageStore!.fetchMoreMessage(id, firstMessage.id);*/}
					{/*						this.forceUpdate(() => {*/}
					{/*							const updatedMessages = this.props.MessageStore!.messages[id] || [];*/}
					{/*							const currentPos = updatedMessages.findIndex((message) => message.id === firstMessage.id);*/}
					{/*							this.listRef!.current!.scrollToItem(currentPos, "start");*/}
					{/*						})*/}
					{/*					}*/}
					{/*				}}*/}
					{/*				threshold={5}*/}
					{/*				minimumBatchSize={30}*/}
					{/*				ref={this.listRef}*/}
					{/*			>*/}
					{/*				{({ onItemsRendered, ref }) => (*/}
					{/*					<List*/}
					{/*						key={id}*/}
					{/*						className={"list"}*/}
					{/*						width={width}*/}
					{/*						height={height}*/}
					{/*						itemCount={items.length}*/}
					{/*						onItemsRendered={onItemsRendered}*/}
					{/*						ref={ref}*/}
					{/*					>*/}
					{/*						{*/}
					{/*							React.forwardRef((props, ref: any) => (*/}
					{/*								<div ref={ref} style={props.style}>*/}
					{/*									{items[props.index]}*/}
					{/*								</div>*/}
					{/*							))*/}
					{/*						}*/}
					{/*					</List>*/}
					{/*				)}*/}
					{/*			</InfiniteLoader>*/}
					{/*		)}*/}
					{/*	</AutoSizer>*/}
					{/*</OverlayScrollbarsComponent>*/}
				</div>
				<TextArea
					className={styles.textarea}
					minRows={1}
					maxRows={10}
					placeholder={"なんか書こう"}
					value={this.props.MessageStore!.inputs[id]}
					onChange={(event) => {
						this.props.MessageStore!.onInputMessage(id, event.target.value);
					}}
					onKeyDown={(event) => {
						if (event.keyCode == 13) {
							if (!event.shiftKey) {
								event.preventDefault();
								// this.shouldScrollToBottom = true;
								this.props.MessageStore!.sendMessage(id);
							}
						}
					}}
				/>
			</div>
		);
	}
}
