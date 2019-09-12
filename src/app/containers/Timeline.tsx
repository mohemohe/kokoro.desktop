import * as React from "react";
import {RouteComponentProps, Redirect} from "react-router";
import {inject, observer} from "mobx-react";
import MessageStore from "../stores/MessageStore";
import {Message} from "../components/Message";
import TextArea from "react-textarea-autosize";
import {style} from "typestyle";
import ChannelStore from "../stores/ChannelStore";
import {ChannelIcon} from "../components/ChannelIcon";
import AuthStore, {AuthStatus} from "../stores/AuthStore";
import {State} from "../stores/BaseStore";

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
	}

	public componentDidMount() {
		if (this.props.ChannelStore!.activeId !== this.props.match.params.id) {
			this.props.ChannelStore!.setActiveChannel(this.props.match.params.id);
		}
		this.props.MessageStore!.fetchMessage(this.props.match.params.id);
	}

	public UNSAFE_componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any) {
		if (this.props.match.params.id != nextProps.match.params.id) {
			this.props.MessageStore!.fetchMessage(nextProps.match.params.id);
		}
	}

	private header() {
		const membership = this.props.ChannelStore!.activeChannel;
		if (!membership) {
			return (
				<div className={styles.header}>
					<span className={styles.channelName}>
						null
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
		const messages = this.props.MessageStore!.messages[id] || [];

		return (
			<div className={styles.root}>
				{this.header()}
				<div className={styles.messages}>
					{messages.slice().reverse().map((message) => <Message message={message} key={message.id}/>)}
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
								this.props.MessageStore!.sendMessage(id);
							}
						}
					}}
				/>
			</div>
		);
	}
}
