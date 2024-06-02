import { Database } from "@db";
import { DataTypes } from "sequelize";
import { Team } from "./types";

Team.init( {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    slug: { type: DataTypes.STRING, allowNull: true },
    name: { type: DataTypes.STRING, allowNull: true },
    avatar: { type: DataTypes.STRING, allowNull: true },
}, {
    freezeTableName: true,
    modelName: "teams",
    sequelize: Database
} );

export { Team };
