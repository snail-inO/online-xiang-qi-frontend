import axios from "axios";
import React from "react";
import BlockElement from "./Block";
import { BoardProps, BoardState, Piece, Board, User } from "./types";

export default class BoardElement extends React.Component<
  BoardProps,
  BoardState
> {
  constructor(props: BoardProps) {
    super(props);
    this.state = { board: this.props.board, selectedPiece: null};
    this.handlePiece = this.handlePiece.bind(this);
    this.handleBlank = this.handleBlank.bind(this);

  }

  //shouldComponentUpdate
  /*
    setInterval(()=>{

    },1000);
    */
 handleBlank(piece: Piece, col: number, row: number) {
    if (this.state.selectedPiece) {
      let curPiece = { ...this.state.selectedPiece };
      this.setState({ selectedPiece: null });
      if (this.props.user?.color === "RED") {
        console.log("user red");
        
        curPiece.col = (8 - col);
        curPiece.row = (9 - row);
      } else {
        console.log("user black");
        curPiece.col = col;
        curPiece.row = row;
      }
      const url = curPiece._links?.self.href as string;
      console.log(curPiece);
      axios
        .put(url, curPiece)
        .then((response) => {
          this.setState({ errInfo: "" });
          const newPiece: Piece = response.data;
          console.log(newPiece);
          // axios.get(newPiece._links?.boards?.href as string).then(resp => {
          //   this.setState({board: resp.data});
          // });
        })
        .catch((error) => {
          console.log("error" + error);
          this.setState({ errInfo: error.message });
        });
    }
  }

  handlePiece(piece: Piece, col: number, row: number) {
    if (piece === this.state.selectedPiece) {
      console.log("unselect " + piece.type);
      
      this.setState({ selectedPiece: null});
    } else {
      console.log("select " + piece.type);
      this.setState({ selectedPiece: piece});
    }
  }
  render(): React.ReactNode {
    let res: JSX.Element[] = [];
    if (this.props.board === null) {
      return <div></div>;
    }
    for (let i = 0; i < 10; i++) {
      res.push(
        <Row
          row={i}
          board={this.props.board}
          user={this.props.user}
          handlePiece={this.handlePiece}
          handleBlank={this.handleBlank}
        />
      );
    }
    return (
      <div>
        <p>{this.state.errInfo}</p>
        <table>
          <tbody>{React.Children.toArray(res)}</tbody>
        </table>
      </div>
    );
  }
}

type RowProps = {
  row: number;
  board: Board | null;
  user: User | null;
  handlePiece: Function;
  handleBlank: Function;
};

type CellProps = {
  row: number;
  col: number;
  block: Piece | null;
  handleBlock: Function | null;
};

function Cell({ row, col, block, handleBlock }: CellProps): JSX.Element {
  return (
    <td>
      <BlockElement
        handleBlock={handleBlock}
        col={col}
        row={row}
        block={block}
      />
    </td>
  );
}

function Row({
  row,
  board,
  handlePiece,
  handleBlank,
  user,
}: RowProps): JSX.Element {
  let curRow: JSX.Element[] = [];

  const curRound =
    board === null
      ? false
      : (board.step % 2 === 0 && user?.color === "RED") ||
        (board.step % 2 === 1 && user?.color === "BLACK")
      ? true
      : false;

  for (let i = 0; i < 9; i++) {
    let handleBlock = handleBlank;
    let index = (row * 9 + i).toString();
    if (user?.color === "RED") {
      index = ((9 - row) * 9 + (8 - i)).toString();
    }

    const block = board?.pieces.hasOwnProperty(index)
      ? board?.pieces[index]
      : null;
    if (block !== null && block.color === user?.color) {
      
      handleBlock = handlePiece;
    }
    curRow.push(
      <Cell
        row={row}
        col={i}
        block={block}
        handleBlock={curRound ? handleBlock : null}
      />
    );
  }

  return <tr>{React.Children.toArray(curRow)}</tr>;
}
