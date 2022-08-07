import React, { FormEvent } from "react";
import axios from "axios";
import User, { BoardProps, BoardState, Game} from "./types";


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