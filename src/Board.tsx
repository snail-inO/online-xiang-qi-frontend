import axios from "axios";
import React, { MouseEventHandler } from "react";
import BlockElement from "./Block";
import { BoardProps, BoardState, Piece, Board, User} from "./types";


export default class BoardElement extends React.Component<BoardProps, BoardState> {
    constructor(props : BoardProps) {
        super(props);
        this.state = {board:this.props.board};
        
        console.log("boardconstructor"+this.state);
        
    }
    
    
    
    //shouldComponentUpdate
    /*
    setInterval(()=>{

    },1000);
    */
    
    render(): React.ReactNode {
        let res : JSX.Element[] = [];
        //this.setState({board:this.props.board})
        //console.log(this.state.board);
        if(this.props.board===null){
           return(
                <div></div>
            );
        }
        for (let i = 0; i < 10; i++) {
            res.push(<Row row={i} board={this.props.board} user={this.props.user} handlePiece={this.props.handlePiece} handleBlank={this.props.handleBlank} />);
        }
        return (
            <div>
                <table>
                    <tbody>{React.Children.toArray( res)}</tbody></table>
            </div>
        );
    }
}

type RowProps = {
    row : number;
    board: Board | null;
    user: User | null;
    handlePiece: Function;
    handleBlank: Function;
}

type CellProps = {
    row: number;
    col: number;
    block: Piece | null;
    handleBlock: Function | null;
}

function    Cell({row, col, block, handleBlock} : CellProps) : JSX.Element {
    
        return (
            <td><BlockElement 
                handleBlock={handleBlock} 
                col = {col} row = {row} 
                block = {block}
            /></td>
        );

    }

function    Row({row, board, handlePiece, handleBlank, user}: RowProps) : JSX.Element {
        let curRow : JSX.Element[] = [];
        let handleBlock = handleBlank;

        const curRound = board===null?false:(board.step % 2 === 0 && user?.color === "RED") || (board.step % 2 === 1 && user?.color === "BLACK") ? true : false;

        for (let i = 0; i < 9; i++) {
            let index = (row * 9 + i).toString();
            if (user?.color == "RED") {
                index = ((9 - row) * 9 + (8 - i)).toString();
            }
            
            const block = board?.pieces.hasOwnProperty(index) ? board?.pieces[index] : null;
            if (block !== null && block.color === user?.color) {
                handleBlock = handlePiece;
            }
            curRow.push( <Cell row={row} col={i} block={block} handleBlock={curRound? handleBlock : null}/>);
        }

        return (
            <tr>{React.Children.toArray(curRow)}</tr>
        );
    }