import { DataTypes, InferAttributes, InferCreationAttributes } from "sequelize";
import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Participant } from "../participant";
import { User } from "../user";

@Table( {
    tableName: "participant_users",
    freezeTableName: true
} )
export class ParticipantUser extends Model<InferAttributes<ParticipantUser>, InferCreationAttributes<ParticipantUser>> {

    @Column( {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    } )
    declare id: number;

    @ForeignKey( () => User ) @Column( {
        type: DataTypes.INTEGER, allowNull: true
    } )
    declare userId: number;

    @ForeignKey( () => Participant ) @Column( {
        type: DataTypes.INTEGER, allowNull: true
    } )
    declare participantId: number;
}
