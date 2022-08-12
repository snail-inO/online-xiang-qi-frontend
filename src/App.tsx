import React, { FormEvent, FormEventHandler } from "react";
import axios from "axios";
import { User, apiUri, AppState, Board, ColorUser, Game } from "./types";
import GameElement from "./Game";
import { Message } from "@stomp/stompjs";
import subscribeMessage from "./websocket";

type startFromProps = {
  user: User | null;
  handleSubmit: FormEventHandler;
};

type HeaderProps = {
  user: User | null;
};

class App extends React.Component<Object, AppState> {
  constructor(props: Object) {
    super(props);
    this.state = { user: null, game: null };
    this.handleNewGameCallback = this.handleNewGameCallback.bind(this);
    this.startMatching = this.startMatching.bind(this);
  }
  handleSubmit: FormEventHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const username = (event.currentTarget.children[1] as HTMLInputElement)
      .value;
    console.log(username);

    this.startMatching(username).then((res) => {
      this.setState({ user: res, game: this.state.game });
    });
  };

  handleNewGameCallback(message: Message): void {
    const gameLink: string = message.body.replaceAll('"', "");
    console.log(gameLink);
    this.getGame(gameLink);
  }

  async getGame(link: string) {
    let game: Game = (await axios.get(link)).data;
    console.log(game);

    game.boards = (
      await axios.get(game._links?.boards?.href as string)
    ).data._embedded.boards;
    console.log(game);

    let color: ColorUser = (await axios.get(game._links?.users?.href as string))
      .data;
    console.log(color);

    let user = this.state.user;
    if (color.BLACK._links?.self.href === user?._links?.self.href) {
      user = color.BLACK;
      user.color = "BLACK";
    } else if (color.RED._links?.self.href === user?._links?.self.href) {
      user = color.RED;
      user.color = "RED";
    }
    console.log(user);

    let pieces = (
      await axios.get((game.boards.at(-1) as Board)._links?.pieces?.href as string)
    ).data;
    (game.boards.at(-1) as Board).pieces = {};
    Object.keys(pieces).forEach((key) => {
      console.log(key);
      console.log(pieces[key]);

      (game.boards.at(-1) as Board).pieces[key] = pieces[key];
    });
    setEntityId(game.boards.at(-1) as Board);
    setEntityId(game);
    console.log(game.boards);

    this.setState({
      user: user,
      game: {
        id: game.id,
        status: game.status,
        totalSteps: game.totalSteps,
        boards: [...game.boards],
        _links: game._links,
      },
    });
  }

  async startMatching(username: string): Promise<User> {
    const postResp = await axios.post(`http://${apiUri}/users`, {
      name: username,
    });

    let user: User = postResp.data;
    setEntityId(user);
    subscribeMessage(
      `/xiang-qi/newGame/${user.id}`,
      this.handleNewGameCallback
    );

    console.log(user);

    delete user._links;
    user.status = "MATCHING";

    const putResp = await axios.put(`http://${apiUri}/users`, user);

    return putResp.data;
  }

  render(): React.ReactNode {
    const user = this.state.user;
    console.log(user);
    console.log(this.state.game);
    return (
      <div className="App">
        <Header user={user} />
        <StartForm user={user} handleSubmit={this.handleSubmit} />
        <GameElement user={user} game={this.state.game} />
      </div>
    );
  }
}

function StartForm(props: startFromProps): JSX.Element {
  let style = props.user === null ? { display: "block" } : { display: "none" };
  return (
    <form style={style} onSubmit={props.handleSubmit}>
      <label htmlFor="username">User name: </label>
      <input name="username" id="nameInput" type="text" placeholder="Jhon" />
      <input type="submit" value="Confirm" />
    </form>
  );
}

function Header(props: HeaderProps): JSX.Element {
  if (props.user === null) {
    return (
      <header>
        <h1>中国象棋 Online</h1>
      </header>
    );
  }
  return (
    <header>
      <h1>中国象棋 Online</h1>
      <h2>Welcome {props.user.name}</h2>
      <p>
        Status: {props.user.status} TotalGames: {props.user.totalGames} Wins:{" "}
        {props.user.wins}
      </p>
    </header>
  );
}

function setEntityId(entity: User | Game | Board): void {
  entity.id = entity._links?.self.href.split("/")[4] as string;
}

export default App;
