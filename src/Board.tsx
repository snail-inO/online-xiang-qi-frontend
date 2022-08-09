import React from "react";
import { BoardProps, BoardState} from "./types";


export default class BoardElement extends React.Component<BoardProps, BoardState> {
    constructor(props : BoardProps) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <div></div>
        );
    }
}