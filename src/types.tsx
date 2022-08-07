
export interface User {
  id: string | null;
  name: string;
  status: "ONLINE" | "OFFLINE" | "MATCHING" | "GAMING" | null;
  lastOnlineTime: Date | null;
  totalGames: number;
  wins: number;
  _links?: Links;
}

export interface Game {
  status: "IN_PROGRESS" | "END";
  totalSteps: number;
  boards: [{ step: string; board: Board }];
  _links?: Links;
}

export interface Board {
  id: string;
  step: number;
  pieces: [{ index: number; piece: Piece }];
  _links?: Links;
}

export interface Piece {
  id: string;
  type: "ZU";
  color: "RED" | "BLACK";
  row: number;
  col: number;
  alive: boolean;
  _links?: Links;
}

export interface Links {
  self: Link;
  users?: Link;
  piece?: Link;
  game?: Link;
  boards?: Link;
}

export interface Link {
  href: string;
}

export type AppState = {
  user: User | null;
  game: Game | null;
};

export type GameProps = {
  user: User | null;
  game: Game | null;
};

export type GameState = {
    user: User | null;
    game: Game | null;
    board: Board | null;
};

export type BoardProps = {
    user: User | null;
    board: Board | null;
}

export type BoardState = {
    user: User | null;
    board: Board | null;
}

export const apiUri: string = "localhost:8080";

export default User;
