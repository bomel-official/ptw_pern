import { Team } from "../StoreTypes";

export function isTeam( team: any ): team is Team {
    return (typeof team === "object" && team && team.id !== undefined && team.capitanId !== undefined);
}
