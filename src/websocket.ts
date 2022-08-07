import { Client, IFrame, messageCallbackType } from "@stomp/stompjs";
import {apiUri} from "./types";

export default function subscribeMessage(
  path: string,
  callback: messageCallbackType
) {
  let stompClient: Client;
  const stompConfig = {
    // Typically login, passcode and vhost
    // Adjust these for your broker
    connectHeaders: {
      login: "guest",
      passcode: "guest",
    },

    // Broker URL, should start with ws:// or wss:// - adjust for your broker setup
    brokerURL: `ws://${apiUri}/message`,

    // Keep it off for production, it can be quit verbose
    // Skip this key to disable
    debug: function (str: string) {
      console.log("STOMP: " + str);
    },

    // If disconnected, it will retry after 200ms
    reconnectDelay: 200,

    // Subscriptions should be done inside onConnect as those need to reinstated when the broker reconnects
    onConnect: function (frame: IFrame) {
      // The return object has a method called `unsubscribe`
      const subscription = stompClient.subscribe(path, callback);
      console.log("listen to: " + path);
    },
  };

  // Create an instance
  stompClient = new Client(stompConfig);

  // You can set additional configuration here

  // Attempt to connect
  stompClient.activate();
}
