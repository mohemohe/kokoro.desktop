import {RouterStore} from "mobx-react-router";
import AuthStore from "./AuthStore";
import ChannelStore from "./ChannelStore";
import MessageStore from "./MessageStore";

const stores = {
	RouterStore: new RouterStore(),

	AuthStore: new AuthStore(),
	ChannelStore: new ChannelStore(),
	MessageStore: new MessageStore(),
};

export default stores;
