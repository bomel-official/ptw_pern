import { Build, BuildWeapon } from "@core";
import { Database } from "@db";
import { DataTypes } from "sequelize";
import { BuildWeaponType } from "./types";

BuildWeaponType.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        title_RU: { type: DataTypes.STRING, allowNull: true },
        title_EU: { type: DataTypes.STRING, allowNull: true },
    }, {
        modelName: "build_weapon_type",
        sequelize: Database
    } );

BuildWeaponType.hasMany( BuildWeapon );
BuildWeaponType.hasMany( Build );

export { BuildWeaponType };
