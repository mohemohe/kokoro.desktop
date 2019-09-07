import {RouterStore} from "mobx-react-router";
import AuthStore from "./AuthStore";
import ChannelStore from "./ChannelStore";

const stores = {
	RouterStore: new RouterStore(),

	AuthStore: new AuthStore(),
	ChannelStore: new ChannelStore(),
};

export default stores;
