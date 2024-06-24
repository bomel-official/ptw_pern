import {
    CreationOptional,
    DataTypes,
    HasManyAddAssociationMixin, HasManyRemoveAssociationMixin,
    InferAttributes,
    InferCreationAttributes,
    NonAttribute
} from "sequelize";
import { BelongsTo, BelongsToMany, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { TeamRequest } from "../team-request";
import { User } from "../user";

@Table( {
    tableName: "team"
} )
export class Team extends Model<InferAttributes<Team>, InferCreationAttributes<Team>> {

    @Column( {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    } )
    declare id: CreationOptional<number>;

    @Column( {
        type: DataTypes.STRING, allowNull: true
    } )
    declare slug?: string;

    @Column( {
        type: DataTypes.STRING, allowNull: true
    } )
    declare name?: string;

    @Column( {
        type: DataTypes.STRING, allowNull: true
    } )
    declare avatar?: string;

    @ForeignKey( () => User ) @Column( {
        type: DataTypes.INTEGER, allowNull: false
    } )
    declare capitanId: number;

    @BelongsTo( () => User, "capitanId" )
    declare capitan: NonAttribute<User>;

    @BelongsToMany( () => User, () => TeamRequest )
    declare players: NonAttribute<User[]>;

    declare addPlayer: HasManyAddAssociationMixin<User, number>;

    declare removePlayer: HasManyRemoveAssociationMixin<User, number>;
}
