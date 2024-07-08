import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes } from "sequelize";
import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { CompetitionTable } from "../competition-table";
import { Team } from "../team";

@Table( {
    tableName: "competition_teams",
    freezeTableName: true
} )
export class CompetitionTeam extends Model<InferAttributes<CompetitionTeam>, InferCreationAttributes<CompetitionTeam>> {

    @Column( {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    } )
    declare id: CreationOptional<number>;

    @ForeignKey( () => Team ) @Column( {
        type: DataTypes.INTEGER, allowNull: true
    } )
    declare teamId: number;

    @ForeignKey( () => CompetitionTable ) @Column( {
        type: DataTypes.INTEGER, allowNull: true
    } )
    declare competitionId: number;
}
