import { DataTypes, InferAttributes, InferCreationAttributes } from "sequelize";
import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Team } from "../team";
import { User } from "../user";

@Table( {
    tableName: "team_request"
} )
export class TeamRequest extends Model<InferAttributes<TeamRequest>, InferCreationAttributes<TeamRequest>> {

    @Column( {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    } )
    declare id: number;

    @ForeignKey( () => Team ) @Column( {
        type: DataTypes.INTEGER, allowNull: false
    } )
    declare teamId: number;

    @ForeignKey( () => User ) @Column( {
        type: DataTypes.INTEGER, allowNull: false
    } )
    declare userId: number;
}
