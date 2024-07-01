import { Device, Platform, UserRole } from "@constants";
import {
    CreationOptional,
    DataTypes,
    HasManyAddAssociationMixin,
    InferAttributes,
    InferCreationAttributes,
    NonAttribute
} from "sequelize";
import { BelongsToMany, Column, HasMany, Model, Table } from "sequelize-typescript";
import { Build } from "../build";
import { Competition } from "../competition";
import { CompetitionUser } from "../competition-user";
import { Team } from "../team";

@Table( {
    tableName: "users",
    freezeTableName: true
} )
export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {

    @Column( {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    } )
    declare id: CreationOptional<number>;

    @Column( {
        type: DataTypes.STRING, allowNull: true, unique: true
    } )
    declare nickname: CreationOptional<string>;

    @Column( {
        type: DataTypes.STRING, unique: true
    } )
    declare email: string;

    @Column( {
        type: DataTypes.STRING, defaultValue: "password"
    } )
    declare password: CreationOptional<string>;

    @Column( {
        type: DataTypes.STRING, defaultValue: UserRole.USER
    } )
    declare role: CreationOptional<UserRole>;

    @Column( {
        type: DataTypes.STRING, defaultValue: "FREE"
    } )
    declare status: CreationOptional<string>;

    @Column( {
        type: DataTypes.STRING, allowNull: true
    } )
    declare avatar?: CreationOptional<string>;

    @Column( {
        type: DataTypes.STRING, allowNull: true
    } )
    declare twitch?: CreationOptional<string>;

    @Column( {
        type: DataTypes.STRING, allowNull: true
    } )
    declare twitter?: CreationOptional<string>;

    @Column( {
        type: DataTypes.STRING, allowNull: true
    } )
    declare steam?: CreationOptional<string>;

    @Column( {
        type: DataTypes.STRING, allowNull: true
    } )
    declare vk?: CreationOptional<string>;

    @Column( {
        type: DataTypes.STRING, allowNull: true
    } )
    declare youtube?: CreationOptional<string>;

    @Column( {
        type: DataTypes.STRING, allowNull: true
    } )
    declare activisionId?: CreationOptional<string>;

    @Column( {
        type: DataTypes.STRING, allowNull: true
    } )
    declare discord_id?: CreationOptional<string>;

    @Column( {
        type: DataTypes.STRING, allowNull: true
    } )
    declare discord_username?: CreationOptional<string>;

    @Column( {
        type: DataTypes.STRING, allowNull: true
    } )
    declare discord_avatar?: CreationOptional<string>;

    @Column( {
        type: DataTypes.ARRAY( DataTypes.INTEGER ), defaultValue: []
    } )
    declare friends: CreationOptional<number[]>;

    @Column( {
        type: DataTypes.STRING, defaultValue: Platform.PC
    } )
    declare platform: CreationOptional<Platform>;

    @Column( {
        type: DataTypes.STRING, defaultValue: Device.KEYBOARD_MOUSE
    } )
    declare device: CreationOptional<Device>;

    @Column( {
        type: DataTypes.INTEGER, defaultValue: 0
    } )
    declare statsToursPlayed: CreationOptional<number>;

    @Column( {
        type: DataTypes.ARRAY( DataTypes.INTEGER ), defaultValue: []
    } )
    declare statsToursList: CreationOptional<number[]>;

    @Column( {
        type: DataTypes.INTEGER, defaultValue: 0
    } )
    declare statsToursWon: CreationOptional<number>;

    @Column( {
        type: DataTypes.INTEGER, defaultValue: 0
    } )
    declare statsToursTop3: CreationOptional<number>;

    @Column( {
        type: DataTypes.FLOAT, defaultValue: 0
    } )
    declare statsAverageKills: CreationOptional<number>;

    @Column( {
        type: DataTypes.INTEGER, defaultValue: 0
    } )
    declare statsAmountKills: CreationOptional<number>;

    @HasMany( () => Build )
    declare builds: NonAttribute<Build[]>;

    @HasMany( () => Competition, "authorId" )
    declare competitions: NonAttribute<Competition[]>;

    @BelongsToMany( () => Competition, () => CompetitionUser )
    declare competitionIncluded: NonAttribute<Competition[]>;

    @HasMany( () => Team, "capitanId" )
    declare own_teams: NonAttribute<Team[]>;

    declare addOwn_team: HasManyAddAssociationMixin<Team, number>;
}

export interface JWTUserData {
    id: User["id"],
    email: User["email"],
    nickname: User["nickname"],
    role: User["role"],
}
