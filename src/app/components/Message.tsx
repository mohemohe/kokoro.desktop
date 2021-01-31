import * as React from "react";
import ReactMarkdown from "react-markdown";
import {IMessageEntity} from "kokoro-io/dist/src/lib/IPuripara";
import {style} from "typestyle";
import {Embed} from "./Embed";
import { Prism } from "./Prism";
import electron from "electron";

export interface IProps {
	message: IMessageEntity;
	previous: IMessageEntity | null;
}

const styles = {
	root: style({
		display: "flex",
		padding: "0.25em 1rem",
		$nest: {
			"&:hover": {
				background: "#f8f8f8",
			},
			"& *": {
				wordBreak: "break-all",
			},
			"& a": {
				color: "#1f6da8",
			},
		},
	}),
	leftContainer: style({
		width: 40,
		height: "auto",
		$nest: {
			"& img": {
				borderRadius: 4,
			},
		},
	}),
	rightContainer: style({
		width: 0,
		flex: 1,
		paddingLeft: "0.5em",
	}),
	name: style({
		fontWeight: "bold",
	}),
	date: style({
		color: "#616161",
		fontSize: 12,
	}),
	body: style({
		$nest: {
			"& img": {
				maxWidth: "100%",
			},
			"& pre": {
				overflowX: "auto",
			},
			"& code": {
				background: "#f6f6f6",
				border: "1px solid #d9d9d9",
				padding: "0.1em 0.25em",
				color: "#e01e5a",
			},
		},
	}),
};

export class Message extends React.Component<IProps, {}> {
	private get shouldHideInfo() {
		return (
			this.props.previous &&
			this.props.previous.profile.id === this.props.message.profile.id &&
			this.props.previous.display_name === this.props.message.display_name &&
			this.props.previous.avatar === this.props.message.avatar &&
			new Date(this.props.message.published_at).getTime() - new Date(this.props.previous.published_at).getTime() < 180000 // NOTE: 180sec
		);
	}

	public render() {
		const {message} = this.props;
		if (!message) {
			return <div/>
		}
		return (
			<div className={styles.root}>
				<div className={styles.leftContainer}>
					{!this.shouldHideInfo && <img src={message.avatar} alt={message.display_name}/>}
				</div>
				<div className={styles.rightContainer}>
					{!this.shouldHideInfo && (
						<div>
							<span className={styles.name}>{message.display_name}</span> <span className={styles.date}>{new Date(message.published_at).toLocaleString()}</span>
						</div>
					)}
					<ReactMarkdown
						className={styles.body}
						source={message.raw_content}
						escapeHtml={true}
						renderers={{
							link: (props) => (
								<a
									href={props.href}
									onClick={(event) => {
										event.preventDefault();
										event.stopPropagation();

										// TODO: 別channelとかのアプリ内リンクを考慮する必要がある
										electron.shell.openExternal(props.href);
									}}
								>
									{props.children}
								</a>
							),
							code: Prism,
						}}
					/>
					{message.embed_contents && message.embed_contents.length > 0 ?
						// FIXME: ちょっとなんでか分からん
						message.embed_contents.map((embedContent) => <Embed content={embedContent as any} key={embedContent.position}/>) :
						<></>
					}
				</div>
			</div>
		)
	}
}
