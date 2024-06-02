import { Database } from "@db";
import { DataTypes } from "sequelize";
import { BuildMode } from "./types";

BuildMode.init( {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    gameVersion: { type: DataTypes.STRING, allowNull: true },
    title_RU: { type: DataTypes.STRING, allowNull: true },
    title_EU: { type: DataTypes.STRING, allowNull: true },
}, {
    freezeTableName: true,
    modelName: "build_modes",
    sequelize: Database
} );

export { BuildMode };
