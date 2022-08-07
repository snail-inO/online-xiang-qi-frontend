import React, { FormEvent } from "react";
import axios from "axios";
import User, { apiUri, Game, GameProps, GameState} from "./types";
import { Client, IFrame, Message, messageCallbackType } from "@stomp/stompjs";
import BoardElement from "./Board";

export default class GameElement extends React.Component<GameProps, GameState> {
  constructor(props: GameProps) {
    super(props);
    this.state = {board: null, user: null, game: null};
    this.subscribeMessage = this.subscribeMessage.bind(this);
  }

  componentDidMount() {
    this.subscribeMessage("/xiang-qi/newGame", this.createGame);
  }

  subscribeMessage(path: string, callback: messageCallbackType) {
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
      },
    };

    // Create an instance
    stompClient = new Client(stompConfig);

    // You can set additional configuration here

    // Attempt to connect
    stompClient.activate();
  }

  createGame(message: Message): void {
    const gameLink: string = message.body;
    getGame(gameLink).then((res) => {
      this.setState({ game: res });
    });
  }
  render(): React.ReactNode {
    return (
      <div className="Game">
        
        <BoardElement board={this.state.board} user={this.state.user} />
      </div>
    );
  }
}

async function getGame(link: string): Promise<Game> {
  return  (await axios.get(link)).data;
}
