import { Universe } from "./universe";

export interface GameMap {
  id: string;
  name: string;
  final: boolean;
  universe: Universe;
  seats: string[];
}
