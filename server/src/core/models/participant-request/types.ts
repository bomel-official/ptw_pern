import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, NonAttribute } from "sequelize";
import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Participant } from "../participant";

@Table( {
    tableName: "participant_request"
} )
export class ParticipantRequest
    extends Model<InferAttributes<ParticipantRequest>, InferCreationAttributes<ParticipantRequest>> {

    @Column( {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    } )
    declare id: CreationOptional<number>;

    @Column( {
        type: DataTypes.ARRAY( DataTypes.ARRAY( DataTypes.FLOAT ) ),
        defaultValue: [ [] ]
    } )
    declare dataArray: number[][];

    @Column( {
        type: DataTypes.ARRAY( DataTypes.ARRAY( DataTypes.FLOAT ) ),
        defaultValue: []
    } )
    declare places: number[][];

    @Column( {
        type: DataTypes.STRING, allowNull: false
    } )
    declare approveUrl: string;

    @Column( {
        type: DataTypes.STRING, defaultValue: "new"
    } )
    declare status: CreationOptional<string>;

    @ForeignKey( () => Participant ) @Column( {
        type: DataTypes.INTEGER, allowNull: false
    } )
    declare participantId: number;

    @BelongsTo( () => Participant )
    declare participant: NonAttribute<Participant>;
}
