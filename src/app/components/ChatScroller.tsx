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
		this.waitMouse = true;
	}

	private listRef: React.RefObject<HTMLDivElement>;
	private scrollRef: React.RefObject<OverlayScrollbarsComponent>;
	private scrollLoop: boolean;
	private shouldBottom: boolean;
	private waitMouse: boolean;

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
		window.requestAnimationFrame(() => {
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
					},
					onScroll: (event) => {
						console.log("onScroll", "waitMouse:", this.waitMouse);
						if (event && event.currentTarget && this.listRef.current) {
							const target = event.currentTarget as HTMLDivElement;
							const offset = target.scrollTop;
							const maxOffset = target.scrollHeight - target.clientHeight;

							// NOTE: 自動スクロール終了
							if (!this.waitMouse) {
								this.waitMouse = offset === maxOffset;
							}

							// NOTE: ユーザーがスクロールしたら自動スクロールするかしないか決める
							if (this.waitMouse) {
								this.shouldBottom = offset === maxOffset;
							}

							console.log("onScroll", "offset:", offset, "/", maxOffset);
							console.log("onScroll", "shouldBottom:", this.shouldBottom);
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
