declare module "gamedig" {
  export interface GameDigPlayer {
    name?: string;
    raw?: {
      score?: number;
      time?: number;
    };
  }

  export interface QueryOptions {
    type: string;
    host: string;
    port: number;
    maxAttempts?: number;
    socketTimeout?: number;
  }

  export interface QueryResult {
    name?: string;
    map?: string;
    numplayers?: number;
    maxplayers?: number;
    players?: GameDigPlayer[];
    ping?: number;
  }

  export class GameDig {
    static query(options: QueryOptions): Promise<QueryResult>;
  }
}
