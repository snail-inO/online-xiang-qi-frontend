import React, { FormEvent, FormEventHandler } from "react";
import axios from "axios";
import { User, apiUri, AppState, Board, ColorUser, Game } from "./types";
import GameElement from "./Game";
import { Message } from "@stomp/stompjs";
import subscribeMessage from "./websocket";

type StartFromProps = {
  user: User | null;
  handleSubmit: FormEventHandler;
};

type ModeFromProps = {
  user: User | null;
  selected: boolean;
  handleSubmit: FormEventHandler;
};

type HeaderProps = {
  user: User | null;
};

class App extends React.Component<Object, AppState> {
  constructor(props: Object) {
    super(props);
    this.state = { user: null, game: null, mode1: -1, mode2: -1};
    this.handleNewGameCallback = this.handleNewGameCallback.bind(this);
    this.startMatching = this.startMatching.bind(this);
    this.submitMode = this.submitMode.bind(this);
  }
  handleSubmit: FormEventHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const username = (event.currentTarget.children[1] as HTMLInputElement)
      .value;
    console.log(username);

    this.startMatching(username).then((res) => {
      this.setState({ user: res, game: this.state.game, mode1: this.state.mode1, mode2: this.state.mode2});
    });
  };

  handleModeSubmit: FormEventHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const mode1 = parseInt((event.currentTarget.children[1] as HTMLInputElement)
      .value);
    const mode2 = parseInt((event.currentTarget.children[3] as HTMLInputElement)
      .value);
    const size = parseInt((event.currentTarget.children[5] as HTMLInputElement)
      .value);
    this.submitMode(mode1, mode2, size).then((res) => {
      this.setState({user: this.state.user, game: this.state.game, mode1: mode1, mode2: mode2});
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
      mode1: this.state.mode1,
      mode2: this.state.mode2
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
    console.log(user);

    let putResp = await axios.put(`http://${apiUri}/users`, user);
    console.log(putResp);
    putResp.data.id = user.id;

    return putResp.data;
  }

  async submitMode(mode1: number, mode2: number, size: number) {
    let putResp;
    if (this.state.user != null) {
      console.log("submit mode: " + this.state.user);
      console.log("submit mode: " + this.state.user.id);
      putResp = await axios.put(`http://${apiUri}/mode?uid=${this.state.user.id}&mode1=${mode1}&mode2=${mode2}&size=${size}`);
    }

  }

  render(): React.ReactNode {
    const user = this.state.user;
    console.log(user);
    console.log(this.state.game);
    return (
      <div className="App">
        <Header user={user} />
        <StartForm user={user} handleSubmit={this.handleSubmit} />
        <ModeForm user={user} selected={!(this.state.mode1 === -1 && this.state.mode2 === -1)} handleSubmit={this.handleModeSubmit} />
        <GameElement user={user} game={this.state.game} mode1={this.state.mode1} mode2={this.state.mode2} />
      </div>
    );
  }
}

function StartForm(props: StartFromProps): JSX.Element {
  let style = props.user === null ? { display: "block" } : { display: "none" };
  return (
    <form style={style} onSubmit={props.handleSubmit}>
      <label htmlFor="username">User name: </label>
      <input name="username" id="nameInput" type="text" placeholder="Jhon" />
      <input type="submit" value="Confirm" />
    </form>
  );
}

function ModeForm(props: ModeFromProps): JSX.Element {
  let style = props.selected === false && props.user != null ? { display: "block" } : { display: "none" };
  return (
    <div style={style}>
      <p>mode: </p>
      <p>0 - user mode</p>
      <p>1 - tree-based mode</p>
      <p>2 - baseline mode</p>
      <p>3 - NN mode</p>
      <p>problem size: 3 - 7</p>
    <form onSubmit={props.handleSubmit}>
      <label htmlFor="mode1">Your mode: </label>
      <input type="number" id="player1Mode" name="mode1" min="0" max="3" />
      <label htmlFor="mode2">Opponent mode: </label>
      <input type="number" id="player2Mode" name="mode2" min="0" max="3" />
      <label htmlFor="size">problem size: </label>
      <input type="number" id="problemSize" name="size" min="0" max="8" />
      <input type="submit" value="Confirm" />
    </form>
    </div>
  )

}

function Header(props: HeaderProps): JSX.Element {
  if (props.user === null) {
    return (
      <header>
        <h1>中国象棋 XiangQi Online</h1>
      </header>
    );
  }
  return (
    <header>
      <h1>中国象棋 XiangQi Online</h1>
      <h2>Welcome {props.user.name}</h2>
      <p>
        Status: {props.user.status} TotalGames: {props.user.totalGames} Wins:{" "}
        {props.user.wins} Score:{}
      </p>
    </header>
  );
}

function setEntityId(entity: User | Game | Board): void {
  entity.id = entity._links?.self.href.split("/")[4] as string;
}

export default App;
