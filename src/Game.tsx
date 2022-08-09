import React from "react";
import { GameProps, GameState, Piece } from "./types";
import BoardElement from "./Board";
import axios from "axios";

export default class GameElement extends React.Component<GameProps, GameState> {
  constructor(props: GameProps) {
    super(props);
    this.state = { board: null, user: this.props.user, game: this.props.game, selected:false, selectedPiece:null};
    this.handlePiece = this.handlePiece.bind(this);
    this.handleBlank = this.handleBlank.bind(this);
  }
  handleBlank(piece:Piece, col:number, row:number) {
    if(this.state.selected){
        piece.col = col;
        piece.row = row;
        axios.put('http://${apiUri}/pieces',piece)
        .then(response=>{
          console.log(response.data);
          this.setState({board:response.data});
        })
    }
}

handlePiece(piece:Piece, col:number, row:number){
    if (this.state.selected&&piece===this.state.selectedPiece) {
        this.setState({selectedPiece: null, selected:false});
    } 
    else {
        this.setState({selectedPiece: piece, selected:true});
    }
    
}

  render(): React.ReactNode {
    console.log(this.props.game);
    console.log(this.props.user);

    const board = this.props.game?.boards.at(-1);
    const user = this.props.user;
    const info =
      this.props.game === null
        ? ""
        : `Current step: ${this.props.game.totalSteps}. Your color is ${user?.color}`;
    return (
      <div className="Game">
        <p>{info}</p>
        <BoardElement board={board === undefined ? null : board} user={user} handleBlank={this.handleBlank} handlePiece={this.handlePiece}/>
      </div>
    );
  }
}
