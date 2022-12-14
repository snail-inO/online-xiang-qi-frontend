
export interface User {
  id: string | null;
  name: string;
  status: "ONLINE" | "OFFLINE" | "MATCHING" | "GAMING" | null;
  lastOnlineTime: Date | null;
  totalGames: number;
  wins: number;
  color: "RED" | "BLACK";
  _links?: Links;
}

export interface ColorUser {
  RED: User;
  BLACK: User;
}

export interface Game {
  id: string;
  status: "IN_PROGRESS" | "END";
  totalSteps: number;
  boards: Array<Board>;
  score: number | null;
  _links?: Links;
}

export interface Board {
  id: string;
  step: number;
  pieces: {
    [index: string]: Piece;
  };
  _links?: Links;
}

export interface Piece {
  id: string;
  type: "JU" | "MA" | "PAO" | "XIANG" | "SHI" | "SHUAI" | "BING";
  color: "RED" | "BLACK";
  row: number;
  col: number;
  alive: boolean;
  _links?: Links;
}

export interface Links {
  self: Link;
  users?: Link;
  pieces?: Link;
  game?: Link;
  boards?: Link;
}

export interface Link {
  href: string;
}

export type AppState = {
  user: User | null;
  game: Game | null;
  score: number | null;
  mode1: number;
  mode2: number;
};

export type GameProps = {
  user: User | null;
  game: Game | null;
  mode1: number;
  mode2: number;
};

export type GameState = {
  user: User | null;
  game: Game | null;
  board: Board | null;
};

export type BoardProps = {
  user: User | null;
  board: Board | null;
  mode1: number;
  mode2: number;
};

export type BoardState = {
  // user: User | null;
  board: Board | null;
  selectedPiece: Piece | null;
  errInfo?: string;
};

export type BlockProps = {
  //user: User | null;
  block: Piece | null;
  handleBlock: Function | null;
  col: number;
  row: number;
};

export type BlockState = {
  //user: User | null;
  block: Piece | null;
  col: number;
  row: number;
};

export const apiUri: string = "170.187.139.216:8080";
