import React from "react";
import { inject, observer } from "mobx-react";
import {useChatScroll, useDataLoader} from "use-chat-scroll";
import {Message} from "./Message";
import {IMessageEntity} from "kokoro-io/dist/src/lib/IPuripara";
import MessageStore from "../stores/MessageStore";

export interface IProps {
	MessageStore?: MessageStore;
	channelId: string;
}

const fetchMessages = () => [];

const ChatScroller: React.FC<IProps> = inject("MessageStore")(observer((props: IProps) => {
	const [data, setData] = React.useState<IMessageEntity[]>([]);
	const containerRef = React.useRef<React.MutableRefObject<HTMLDivElement>>();
	const loader = useDataLoader(fetchMessages, data, setData);
	if (containerRef) {
		useChatScroll(containerRef, data, loader);
	}

	return (
		<div ref={containerRef}>
			{data.map(item => (
				<Message message={item} />
			))}
		</div>
	)
}));

export default ChatScroller;
