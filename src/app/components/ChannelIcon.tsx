import * as React from "react";
import {IMembershipEntity} from "kokoro-io/src/lib/IPuripara";
import {FiHash, FiLock, FiMail} from "react-icons/fi";

export interface IProps {
	membership: IMembershipEntity;
}

export class ChannelIcon extends React.Component<IProps, {}> {
	public render() {
		let icon;
		if (this.props.membership.channel.kind.includes("public")) {
			icon = <FiHash/>;
		} else if (this.props.membership.channel.kind.includes("private")) {
			icon = <FiLock/>;
		} else if (this.props.membership.channel.kind.includes("direct")) {
			icon = <FiMail/>;
		}

		return icon;
	}
}
