import { Database } from "@db";
import { DataTypes } from "sequelize";
import { TeamRequest } from "./types";

TeamRequest.init( {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
}, {
    modelName: "team_request",
    sequelize: Database
} );

export { TeamRequest };
