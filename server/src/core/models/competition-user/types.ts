import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes } from "sequelize";
import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Competition } from "../competition";
import { User } from "../user";

@Table( {
    tableName: "competition-users",
    freezeTableName: true
} )
export class CompetitionUser extends Model<InferAttributes<CompetitionUser>, InferCreationAttributes<CompetitionUser>> {

    @Column( {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    } )
    declare id: CreationOptional<number>;

    @ForeignKey( () => User ) @Column( {
        type: DataTypes.INTEGER, allowNull: true
    } )
    declare userId: number;

    @ForeignKey( () => Competition ) @Column( {
        type: DataTypes.INTEGER, allowNull: true
    } )
    declare competitionId: number;
}
