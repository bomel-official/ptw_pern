import { Game } from "@constants";
import { DataTypes, InferAttributes, InferCreationAttributes } from "sequelize";
import { Column, Model, Table } from "sequelize-typescript";

@Table( {
    tableName: "build_modes",
    freezeTableName: true
} )
export class BuildMode extends Model<InferAttributes<BuildMode>, InferCreationAttributes<BuildMode>> {

    @Column( {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    } )
    declare id: number;

    @Column( {
        type: DataTypes.STRING, allowNull: true
    } )
    declare gameVersion?: Game;

    @Column( {
        type: DataTypes.STRING, allowNull: true
    } )
    declare title_RU?: string;

    @Column( {
        type: DataTypes.STRING, allowNull: true
    } )
    declare title_EU?: string;
}
