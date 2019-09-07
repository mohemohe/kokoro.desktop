import * as React from "react";
import {IMessageEntity} from "kokoro-io/dist/src/lib/IPuripara";
import {inject, observer} from "mobx-react";

export interface IProps {
	message: IMessageEntity;
}

@inject("ChannelStore")
@observer
export class Message extends React.Component<IProps, {}> {
	render () {
		return (
			<div>
				{JSON.stringify(this.props.message)}
			</div>
		)
	}
}
