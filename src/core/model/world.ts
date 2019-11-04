export interface World {
    id: string;
    ownerId: string | null;
    metal: number;
    ships: number;
    industry: number;
    population: number;
    mines: number;
}