import * as React from "react";
import ReactMarkdown from "react-markdown";
import {IMessageEntity} from "kokoro-io/dist/src/lib/IPuripara";
import {style} from "typestyle";

export interface IProps {
	message: IMessageEntity;
}

const styles = {
	root: style({
		display: "flex",
	}),
};

export class Message extends React.Component<IProps, {}> {
	render () {
		const {message} = this.props;
		return (
			<div className={styles.root}>
				<div>
					<img src={message.avatar} alt={message.display_name}/>
				</div>
				<div>
					<div>
						{message.display_name} {new Date(message.published_at).toLocaleString()}
					</div>
					<ReactMarkdown
						source={message.raw_content}
						escapeHtml={true}
					/>
				</div>
			</div>
		)
	}
}
