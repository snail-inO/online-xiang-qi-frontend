import React, { MouseEvent, MouseEventHandler } from "react";
import { GameProps, GameState, Piece} from "./types";
import BoardElement from "./Board";
import "./App.css";
import axios from "axios";


type NextButtonProps = {
  handleClick: MouseEventHandler;
  show: boolean;
};

export default class GameElement extends React.Component<GameProps, GameState> {
  constructor(props: GameProps) {
    super(props);
    this.state = {
      board: null,
      user: this.props.user,
      game: this.props.game,
    };
  }
 
  handleClick: MouseEventHandler = (event: MouseEvent) => {
    event.preventDefault();
    
    const pieces = this.props.game?.boards.at(-1)?.pieces;
    let piece;
    for (let i = 0; i < 90; i++) {
      if (pieces?.hasOwnProperty(i.toString())) {
        piece = pieces[i.toString()];
        break;
      }
    }
    console.log(piece);

    const url = piece?._links?.self.href as string;
    axios
        .put(url + `?mode1=${this.props.mode1}&mode2=${this.props.mode2}`, piece)
        .then((response) => {
          console.log("succeeded");
        }).catch((error) => {
          console.log("error" + error);
        });
    
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
          mode1={this.props.mode1}
          mode2={this.props.mode2}
        />
        <br></br>
        <NextButton show={!((this.props.mode1 === -1 && this.props.mode2 === -1) || this.props.mode1 === 0)} handleClick={this.handleClick}/>
      </div>
    );
  }
}


function NextButton(props: NextButtonProps): JSX.Element {
  let style = props.show? { display: "block" } : { display: "none" };
  return <button className="NextButton" style={style} onClick={props.handleClick}>Next</button>
}
