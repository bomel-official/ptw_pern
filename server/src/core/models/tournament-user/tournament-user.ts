import { Database } from "@db";
import { DataTypes } from "sequelize";
import { TournamentUser } from "./types";

TournamentUser.init( {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
}, {
    freezeTableName: true,
    modelName: "tournament_users",
    sequelize: Database
} );

export { TournamentUser };
