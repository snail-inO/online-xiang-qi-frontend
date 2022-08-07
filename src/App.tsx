import React, { CSSProperties, FormEvent, FormEventHandler } from "react";
import axios from "axios";
import User, { apiUri, AppState} from "./types";
import GameElement from "./Game";

type startFromProps = {
  user: User | null;
  handleSubmit: FormEventHandler;
}

type HeaderProps = {
  user: User | null;
}

class App extends React.Component<Object, AppState> {
  constructor(props : Object) {
    super(props);
    this.state = ({user: null, game: null})
  }
  handleSubmit: FormEventHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const username = (event.currentTarget.children[1] as HTMLInputElement).value;
    console.log(username);

    startMatching(username).then((res) => {
      this.setState({ user: res });
    });
  };



  render(): React.ReactNode {
    const user = this.state.user;
    return (
      <div className="App">
        <Header user={user}/>
        <StartForm user={user}  handleSubmit={this.handleSubmit} />
        <GameElement user={user} game={this.state.game} />
      </div>
    );
  }
}

function StartForm(props : startFromProps): JSX.Element {
  let style = props.user === null? {"display" : "block"} : {"display" : "none"};
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
    return <header><h1>中国象棋 Online</h1></header>;
  }
  return (
     <header>
      <h1>中国象棋 Online</h1>
      <h2>Welcome {props.user.name}</h2>
      <p>Status: {props.user.status} TotalGames: {props.user.totalGames} Wins: {props.user.wins}</p>
    </header>
  );
}

async function startMatching(username: string): Promise<User> {
  const postResp = await axios.post(`http://${apiUri}/users`, {
    name: username,
  });

  let user: User = postResp.data;
  console.log(user);

  const putLink: string = user._links?.self.href as string;
  delete user._links;
  user.status = "MATCHING";
  user.id = putLink.split("/")[4];

  const putResp = await axios.put(`http://${apiUri}/users`, user);

  return putResp.data;
}

export default App;
