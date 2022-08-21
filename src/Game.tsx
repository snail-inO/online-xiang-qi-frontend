import React from "react";
import { GameProps, GameState} from "./types";
import BoardElement from "./Board";
import "./App.css";

export default class GameElement extends React.Component<GameProps, GameState> {
  constructor(props: GameProps) {
    super(props);
    this.state = {
      board: null,
      user: this.props.user,
      game: this.props.game,
    };
  }
 

  render(): React.ReactNode {
    // console.log(this.props.game);
    // console.log(this.props.user);

    const board = this.props.game?.boards.at(-1);
    const user = this.props.user;
    const info =
      this.props.game === null
        ? ""
        : `Current step: ${this.props.game.totalSteps}. Your color is ${user?.color}`;
    return (
      <div className="Game">
        <p>{info}</p>
        <BoardElement
          board={board === undefined ? null : board}
          user={user}
        />
      </div>
    );
  }
}
