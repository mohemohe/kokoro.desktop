import * as React from "react";
import {RouteComponentProps} from "react-router";
import {inject, observer} from "mobx-react";
import MessageStore from "../stores/MessageStore";
import {Message} from "../components/Message";
import TextArea from "react-textarea-autosize";
import {style} from "typestyle";

interface IProps extends RouteComponentProps<{ id: string }> {
	MessageStore?: MessageStore;
}

interface IState {
}

const styles = {
	root: style({
		display: "flex",
		flexDirection: "column",
		height: "100%",
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

@inject("MessageStore")
@observer
export default class Timeline extends React.Component<IProps, IState> {
	constructor(props: IProps, state: IState) {
		super(props, state);
	}

	public componentDidMount() {
		console.log(this.props.match.params.id);
		this.props.MessageStore!.fetchMessage(this.props.match.params.id);
	}

	public UNSAFE_componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any) {
		if (this.props.match.params.id != nextProps.match.params.id) {
			this.props.MessageStore!.fetchMessage(nextProps.match.params.id);
		}
	}

	public render() {
		const channel = this.props.match.params.id;
		const messages = this.props.MessageStore!.messages[channel] || [];
		return (
			<div className={styles.root}>
				<div className={styles.messages}>
					{messages.slice().reverse().map((message) => <Message message={message} key={message.id}/>)}
				</div>
				<TextArea
					className={styles.textarea}
					minRows={1}
					maxRows={10}
					placeholder={"なんか書こう"}
					value={this.props.MessageStore!.inputs[channel]}
					onChange={(event) => {
						this.props.MessageStore!.onInputMessage(channel, event.target.value);
					}}
					onKeyDown={(event) => {
						if (event.keyCode == 13) {
							if (!event.shiftKey) {
								event.preventDefault();
								this.props.MessageStore!.sendMessage(channel);
							}
						}
					}}
				/>
			</div>
		);
	}
}
