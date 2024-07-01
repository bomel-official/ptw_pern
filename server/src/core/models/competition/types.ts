import {
    CreationOptional,
    DataTypes,
    HasManyAddAssociationMixin,
    HasManyRemoveAssociationMixin,
    InferAttributes,
    InferCreationAttributes,
    NonAttribute
} from "sequelize";
import { BelongsTo, BelongsToMany, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { CompetitionUser } from "../competition-user";
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

    @Column( {
        type: DataTypes.ARRAY( DataTypes.ARRAY( DataTypes.INTEGER ) ), defaultValue: []
    } )
    declare participants: number[][];

    @Column( {
        type: DataTypes.BOOLEAN, defaultValue: false
    } )
    declare isOutsiders: boolean;

    @Column( {
        type: DataTypes.ARRAY( DataTypes.ARRAY( DataTypes.INTEGER ) ), defaultValue: []
    } )
    declare outsiders: number[][];

    @ForeignKey( () => User ) @Column( {
        type: DataTypes.INTEGER, allowNull: true,
    } )
    declare authorId: number;

    @BelongsTo( () => User )
    declare author: NonAttribute<User>;

    @BelongsToMany( () => User, () => CompetitionUser )
    declare users: NonAttribute<User[]>;

    declare addUser: HasManyAddAssociationMixin<User, number>;

    declare removeUser: HasManyRemoveAssociationMixin<User, number>;
}

export interface CompetitionNormalized extends InferAttributes<Competition> {
    outsidersUsers: (User | null)[][],
    participantsUsers: (User | null)[][];
}
