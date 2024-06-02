import { Database } from "@db";
import { DataTypes } from "sequelize";
import { TeamRequest } from "./types";

TeamRequest.init( {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
}, {
    freezeTableName: true,
    modelName: "team_requests",
    sequelize: Database
} );

export { TeamRequest };
