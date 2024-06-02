import { Database } from "@db";
import { DataTypes } from "sequelize";
import { TournamentUser } from "./types";

TournamentUser.init( {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
}, {
    modelName: "tournament_user",
    sequelize: Database
} );

export { TournamentUser };
