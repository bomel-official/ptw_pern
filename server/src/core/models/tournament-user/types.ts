import { DataTypes, InferAttributes, InferCreationAttributes } from "sequelize";
import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Tournament } from "../tournament";
import { User } from "../user";

@Table( {
    tableName: "tournament_user"
} )
export class TournamentUser extends Model<InferAttributes<TournamentUser>, InferCreationAttributes<TournamentUser>> {

    @Column( {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    } )
    declare id: number;

    @ForeignKey( () => User ) @Column( {
        type: DataTypes.INTEGER, allowNull: false
    } )
    declare userId: number;

    @ForeignKey( () => Tournament ) @Column( {
        type: DataTypes.INTEGER, allowNull: false
    } )
    declare tournamentId: number;
}
