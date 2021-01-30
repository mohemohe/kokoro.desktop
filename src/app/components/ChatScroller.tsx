import * as React from "react";
import {inject, observer} from "mobx-react";
import {Message} from "./Message";
import MessageStore from "../stores/MessageStore";
import {OverlayScrollbarsComponent} from "overlayscrollbars-react";
import {style} from "typestyle";

export interface IProps {
	MessageStore?: MessageStore;
	channelId: string;
}

const styles = {
	list: style({
		width: "100%",
		overflowX: "hidden",
	}),
};

@inject("MessageStore")
@observer
export default class ChatScroller extends React.Component<IProps, {}> {
	constructor(props: IProps) {
		super(props);

		this.listRef = React.createRef<HTMLDivElement>();
		this.scrollRef = React.createRef<OverlayScrollbarsComponent>();
		this.scrollLoop = true;
		this.shouldBottom = true;
		this.shouldKeep = false;
		this.waitMouse = true;
		this.lastBottomOffset = -1;
	}

	private listRef: React.RefObject<HTMLDivElement>;
	private scrollRef: React.RefObject<OverlayScrollbarsComponent>;
	private scrollLoop: boolean;
	private shouldBottom: boolean;
	private shouldKeep: boolean;
	private waitMouse: boolean;
	private lastBottomOffset: number;

	public componentDidMount() {
		console.log("ChatScroller", "componentDidMount");
	}

	public UNSAFE_componentWillUpdate(nextProps: Readonly<IProps>, nextState: Readonly<{}>, nextContext: any) {
		console.log("ChatScroller", "UNSAFE_componentWillUpdate");
		if (this.listRef.current) {
			console.log("ChatScroller", "UNSAFE_componentWillUpdate", "scrollHeight:", this.listRef.current.scrollHeight);
		}
	}

	public componentDidUpdate() {
		console.log("ChatScroller", "componentDidUpdate");
		if (this.listRef.current) {
			console.log("ChatScroller", "componentDidUpdate", "scrollHeight:", this.listRef.current.scrollHeight);
		}
	}

	public componentWillUnmount() {
		this.scrollLoop = false;
	}

	private scrollToBottom() {
		if (!this.scrollRef.current) {
			return;
		}
		const instance = this.scrollRef.current.osInstance();
		if (!instance) {
			return;
		}

		this.waitMouse = false;
		instance.scroll({
			x: 0,
			y: instance.scroll().max.y,
		});
	}

	private scrollToKeep() {
		if (!this.scrollRef.current) {
			return;
		}
		const instance = this.scrollRef.current.osInstance();
		if (!instance) {
			return;
		}

		this.waitMouse = false;
		instance.scroll({
			x: 0,
			y: instance.scroll().max.y - this.lastBottomOffset,
		});
	}

	public render() {
		const messages = this.props.MessageStore!.messages[this.props.channelId] || [];
		console.log("ChatScroller", "render()", messages);

		return (
			<OverlayScrollbarsComponent ref={this.scrollRef} options={{
				className: "os-theme-dark",
				scrollbars: {
					autoHide: "leave",
					autoHideDelay: 300
				},
				callbacks: {
					onUpdated: (event) => {
						if (this.shouldBottom) {
							this.scrollToBottom();
						}
						if (this.shouldKeep) {
							this.scrollToKeep();
						}
					},
					onScroll: (event) => {
						if (event && event.currentTarget && this.listRef.current && this.scrollRef.current) {
							const instance = this.scrollRef.current.osInstance();
							if (!instance) {
								return;
							}

							const target = event.currentTarget as HTMLDivElement;
							const offset = target.scrollTop;
							const maxOffset = target.scrollHeight - target.clientHeight;

							if (offset === 0 && this.lastBottomOffset === -1) {
								const messages = this.props.MessageStore!.messages[this.props.channelId] || [];
								const topMessage = messages.slice().shift();
								if (topMessage) {
									this.waitMouse = false;
									this.shouldKeep = true;
									this.lastBottomOffset = instance.scroll().max.y;
									this.props.MessageStore!.fetchMoreMessage(this.props.channelId, topMessage.id);
								}
							}

							// NOTE: 自動スクロール終了判定
							if (!this.waitMouse) {
								this.waitMouse = offset >= maxOffset - 8 || Math.abs(instance.scroll().max.y - this.lastBottomOffset) >= 8;
							}

							// NOTE: ユーザーがスクロールしたら自動スクロールするかしないか決める
							if (this.waitMouse) {
								this.shouldBottom = offset >= maxOffset - 8;
								this.shouldKeep = false;
								this.lastBottomOffset = -1;
							}

							console.log("onScroll", {offset, maxOffset, waitMouse: this.waitMouse, lastBottomOffset: this.lastBottomOffset, shouldBottom: this.shouldBottom, shouldKeep: this.shouldKeep});
						}
					},
				},
			}}>
				<div className={styles.list} ref={this.listRef}>
					{messages.slice().map((message) => <Message key={message.id} message={message} />)}
				</div>
			</OverlayScrollbarsComponent>
		)
	}
}
