import React, { MouseEventHandler } from "react";
import { BlockProps, BlockState } from "./types";
import "./App.css"

export default class BlockElement extends React.Component<
  BlockProps,
  BlockState
> {
  constructor(props: BlockProps) {
    super(props);
    this.state = {
      block: this.props.block,
      col: this.props.col,
      row: this.props.row,
    };
  }

  handleClick: MouseEventHandler = (event: React.MouseEvent): void => {
    if (this.props.handleBlock)
      this.props.handleBlock(this.props.block, this.props.col, this.props.row);
  };

  render(): React.ReactNode {
    let myBlock = "";
  if(this.props.block !== null){
    switch(this.props.block?.type){
      case "JU": 
        myBlock = this.props.block.color === "BLACK"?"車":"俥";
        break;
      case "MA": 
        myBlock = this.props.block.color === "BLACK"?"馬":"傌";
        break;
      case "PAO": 
        myBlock = this.props.block.color === "BLACK"?"炮":"炮";
        break;
      case "SHI": 
        myBlock = this.props.block.color === "BLACK"?"士":"仕";
        break;
      case "XIANG": 
        myBlock = this.props.block.color === "BLACK"?"象":"相";
        break;
      case "SHUAI": 
        myBlock = this.props.block.color === "BLACK"?"将":"帅";
        break;
      case "BING": 
        myBlock = this.props.block.color === "BLACK"?"卒":"兵";
        break;
    }
  }
    return (
      <button
        className="Block"
        onClick={this.handleClick}
        style={{ color: this.props.block?.color, backgroundColor: this.props.block? "rgb(240, 220, 169)" : "transparent", border: this.props.block? "6px, black" : "none"}}
      >
        {myBlock}
      </button>
    );
  }
}
