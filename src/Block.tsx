import React, { MouseEventHandler } from "react";
import { BlockProps, BlockState } from "./types";
import BoardElement from "./Board";

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
    return (
      <button
        onClick={this.handleClick}
        style={{ color: this.props.block?.color }}
      >
        {this.props.block === null ? "" : this.props.block.type}
      </button>
    );
  }
}
