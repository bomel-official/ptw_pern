import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, NonAttribute } from "sequelize";
import { BelongsTo, Column, ForeignKey, HasOne, Model, Table } from "sequelize-typescript";
import { CompetitionTable } from "../competition-table";
import { User } from "../user";

@Table( {
    tableName: "competitions",
    freezeTableName: true
} )
export class Competition extends Model<InferAttributes<Competition>, InferCreationAttributes<Competition>> {

    @Column( {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    } )
    declare id: CreationOptional<number>;

    @Column( {
        type: DataTypes.STRING, allowNull: false
    } )
    declare title: string;

    @Column( {
        type: DataTypes.INTEGER, allowNull: false
    } )
    declare participantsAmount: number;

    @ForeignKey( () => User ) @Column( {
        type: DataTypes.INTEGER, allowNull: true,
    } )
    declare authorId: number;

    @BelongsTo( () => User )
    declare author: NonAttribute<User>;

    @HasOne( () => CompetitionTable )
    declare competitionTable: NonAttribute<CompetitionTable>;
}
