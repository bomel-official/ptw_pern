import { DataTypes, InferAttributes, InferCreationAttributes } from "sequelize";
import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Team } from "../team";
import { User } from "../user";

@Table( {
    tableName: "team_requests",
    freezeTableName: true
} )
export class TeamRequest extends Model<InferAttributes<TeamRequest>, InferCreationAttributes<TeamRequest>> {

    @Column( {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    } )
    declare id: number;

    @ForeignKey( () => Team ) @Column( {
        type: DataTypes.INTEGER, allowNull: true
    } )
    declare teamId: number;

    @ForeignKey( () => User ) @Column( {
        type: DataTypes.INTEGER, allowNull: true
    } )
    declare userId: number;
}
