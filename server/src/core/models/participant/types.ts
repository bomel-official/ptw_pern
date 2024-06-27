import {
    CreationOptional,
    DataTypes,
    HasManyAddAssociationMixin,
    HasManyRemoveAssociationMixin,
    InferAttributes,
    InferCreationAttributes,
    NonAttribute
} from "sequelize";
import { BelongsTo, BelongsToMany, Column, ForeignKey, HasOne, Model, Table } from "sequelize-typescript";
import { Invoice } from "../invoice";
import { ParticipantRequest } from "../participant-request";
import { ParticipantUser } from "../participant-user";
import { Team } from "../team";
import { Tournament } from "../tournament";
import { User } from "../user";

@Table( {
    tableName: "participants",
    freezeTableName: true
} )
export class Participant extends Model<InferAttributes<Participant>, InferCreationAttributes<Participant>> {

    @Column( {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    } )
    declare id: CreationOptional<number>;

    @Column( {
        type: DataTypes.FLOAT, defaultValue: 0
    } )
    declare points: CreationOptional<number>;

    @Column( {
        type: DataTypes.ARRAY( DataTypes.ARRAY( DataTypes.FLOAT ) ),
        defaultValue: [ [] ]
    } )
    declare dataArray: CreationOptional<number[][]>;

    @Column( {
        type: DataTypes.ARRAY( DataTypes.ARRAY( DataTypes.FLOAT ) ),
        defaultValue: []
    } )
    declare places: CreationOptional<number[][]>;

    @Column( {
        type: DataTypes.ARRAY( DataTypes.BOOLEAN ), defaultValue: []
    } )
    declare isRoundsHidden: CreationOptional<boolean[]>;

    @Column( {
        type: DataTypes.INTEGER, defaultValue: 0
    } )
    declare roomNumber: CreationOptional<number>;

    @Column( {
        type: DataTypes.STRING, allowNull: true
    } )
    declare invoiceUrl?: CreationOptional<string>;

    @Column( {
        type: DataTypes.STRING, defaultValue: "paypal"
    } )
    declare payMethod: CreationOptional<string>;

    @Column( {
        type: DataTypes.BOOLEAN, defaultValue: false
    } )
    declare isPaid: CreationOptional<boolean>;

    @Column( {
        type: DataTypes.INTEGER, defaultValue: 0
    } )
    declare priority: CreationOptional<number>;

    @BelongsToMany( () => User, () => ParticipantUser )
    declare users: NonAttribute<User[]>;

    @ForeignKey( () => Team ) @Column( {
        type: DataTypes.INTEGER, allowNull: true
    } )
    declare teamId: number;

    @BelongsTo( () => Team )
    declare team: NonAttribute<Team>;

    @ForeignKey( () => Tournament ) @Column( {
        type: DataTypes.INTEGER, allowNull: true
    } )
    declare tournamentId: number;

    @BelongsTo( () => Tournament )
    declare tournament: NonAttribute<Tournament>;

    @ForeignKey( () => Invoice ) @Column( {
        type: DataTypes.INTEGER, allowNull: true
    } )
    declare invoiceId?: CreationOptional<number>;

    @BelongsTo( () => Invoice )
    declare invoice?: NonAttribute<Invoice>;

    @HasOne( () => ParticipantRequest )
    declare participantRequest: NonAttribute<ParticipantRequest>;

    declare addUser: HasManyAddAssociationMixin<User, number>;

    declare removeUser: HasManyRemoveAssociationMixin<User, number>;
}
