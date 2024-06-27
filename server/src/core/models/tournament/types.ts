import { Game, TournamentType } from "@constants";
import {
    CreationOptional,
    DataTypes,
    HasManyAddAssociationMixin, HasManyRemoveAssociationMixin,
    InferAttributes,
    InferCreationAttributes,
    NonAttribute
} from "sequelize";
import { BelongsToMany, Column, Model, Table } from "sequelize-typescript";
import { TournamentUser } from "../tournament-user";

import { User } from "../user";

@Table( {
    tableName: "tournaments",
    freezeTableName: true
} )
export class Tournament extends Model<InferAttributes<Tournament>, InferCreationAttributes<Tournament>> {

    @Column( {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    } )
    declare id: CreationOptional<number>;

    @Column( {
        type: DataTypes.STRING, allowNull: false
    } )
    declare title_RU: string;

    @Column( {
        type: DataTypes.STRING, allowNull: false
    } )
    declare title_EU: string;

    @Column( {
        type: DataTypes.STRING, allowNull: true
    } )
    declare previewImg?: CreationOptional<string>;

    @Column( {
        type: DataTypes.STRING, allowNull: false
    } )
    declare slug: string;

    @Column( {
        type: DataTypes.STRING, allowNull: false
    } )
    declare game: Game;

    @Column( {
        type: DataTypes.STRING, defaultValue: TournamentType.TOURNAMENT
    } )
    declare type: TournamentType;

    @Column( {
        type: DataTypes.STRING, allowNull: false
    } )
    declare twitchChannel: string;

    @Column( {
        type: DataTypes.DATE, allowNull: false
    } )
    declare dateBegin: string;

    @Column( {
        type: DataTypes.DATE, allowNull: false
    } )
    declare dateEnd: string;

    @Column( {
        type: DataTypes.INTEGER, allowNull: false
    } )
    declare maxUsers: number;

    @Column( {
        type: DataTypes.INTEGER, allowNull: false
    } )
    declare playersInTeam: number;

    @Column( {
        type: DataTypes.FLOAT, defaultValue: 0
    } )
    declare participationPrice: CreationOptional<number>;

    @Column( {
        type: DataTypes.INTEGER, allowNull: false
    } )
    declare prizes: number;

    @Column( {
        type: DataTypes.INTEGER, allowNull: false
    } )
    declare prize_1: number;

    @Column( {
        type: DataTypes.INTEGER, allowNull: false
    } )
    declare prize_2: number;

    @Column( {
        type: DataTypes.INTEGER, allowNull: false
    } )
    declare prize_3: number;

    @Column( {
        type: DataTypes.ARRAY( DataTypes.INTEGER ), defaultValue: []
    } )
    declare participantsList: CreationOptional<number[]>;

    @Column( {
        type: DataTypes.BOOLEAN, defaultValue: true
    } )
    declare isRegisterOn: CreationOptional<boolean>;

    @Column( {
        type: DataTypes.TEXT, allowNull: false
    } )
    declare descRules_RU: string;

    @Column( {
        type: DataTypes.TEXT, allowNull: false
    } )
    declare descRules_EU: string;

    @Column( {
        type: DataTypes.TEXT, allowNull: false
    } )
    declare descAdditional_RU: string;

    @Column( {
        type: DataTypes.TEXT, allowNull: false
    } )
    declare descAdditional_EU: string;

    @Column( {
        type: DataTypes.STRING, allowNull: false
    } )
    declare format_RU: string;

    @Column( {
        type: DataTypes.STRING, allowNull: false
    } )
    declare format_EU: string;

    @BelongsToMany( () => User, () => TournamentUser )
    declare players: NonAttribute<User[]>;

    declare addPlayer: HasManyAddAssociationMixin<User, number>;

    declare removePlayer: HasManyRemoveAssociationMixin<User, number>;
}
