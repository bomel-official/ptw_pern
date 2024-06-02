import { Database } from "@db";
import { DataTypes } from "sequelize";
import { BuildWeapon } from "./types";

BuildWeapon.init( {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    gameVersion: { type: DataTypes.STRING, allowNull: true },
    title_RU: { type: DataTypes.STRING, allowNull: true },
    title_EU: { type: DataTypes.STRING, allowNull: true },
    image: { type: DataTypes.STRING, allowNull: true },
    allowedAttachments: {
        type: DataTypes.ARRAY( DataTypes.INTEGER ), defaultValue: []
    }
}, {
    freezeTableName: true,
    modelName: "build_weapons",
    sequelize: Database
} );

export { BuildWeapon };
