import * as React from "react";
import {RouteComponentProps} from "react-router";
import {inject, observer} from "mobx-react";
import MessageStore from "../stores/MessageStore";
import {Message} from "../components/Message";

interface IProps extends RouteComponentProps<{ id: string }> {
	MessageStore?: MessageStore;
}

interface IState {
}

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
		const messages = this.props.MessageStore!.messages[this.props.match.params.id] || [];
		return (
			<div>
				<div>
					{messages.slice().reverse().map((message) => <Message message={message} key={message.id}/>)}
				</div>
			</div>
		);
	}
}
