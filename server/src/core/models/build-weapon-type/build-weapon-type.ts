import { Database } from "@db";
import { DataTypes } from "sequelize";
import { BuildWeaponType } from "./types";

BuildWeaponType.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        title_RU: { type: DataTypes.STRING, allowNull: true },
        title_EU: { type: DataTypes.STRING, allowNull: true },
    }, {
        freezeTableName: true,
        modelName: "build_weapon_types",
        sequelize: Database
    } );

export { BuildWeaponType };
