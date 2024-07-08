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
import { Competition } from "../competition";
import { CompetitionTeam } from "../competition-team";
import { CompetitionUser } from "../competition-user";
import { Team } from "../team";
import { Tournament } from "../tournament";
import { User } from "../user";

export interface CompetitionParticipant<TItem> {
    index: number;
    items: TItem[];
    points: number;
}

@Table( {
    tableName: "competition_tables",
    freezeTableName: true
} )
export class CompetitionTable
    extends Model<InferAttributes<CompetitionTable>, InferCreationAttributes<CompetitionTable>> {

    @Column( {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    } )
    declare id: CreationOptional<number>;

    @Column( {
        type: DataTypes.STRING, defaultValue: "user"
    } )
    declare type: "user" | "team";

    @Column( {
        type: DataTypes.STRING, defaultValue: "competition"
    } )
    declare parentType: "competition" | "tournament";

    @Column( {
        type: DataTypes.INTEGER, allowNull: false
    } )
    declare itemsInTeam: number;

    @Column( {
        type: DataTypes.JSON,
        defaultValue: []
    } )
    declare participants: CompetitionParticipant<number>[][];

    @Column( {
        type: DataTypes.JSON,
        defaultValue: []
    } )
    declare outsiders: CompetitionParticipant<number>[][];

    @Column( {
        type: DataTypes.BOOLEAN, defaultValue: false
    } )
    declare isOutsiders: boolean;

    @Column( {
        type: DataTypes.BOOLEAN, defaultValue: false
    } )
    declare allowShuffle: boolean;

    @ForeignKey( () => User ) @Column( {
        type: DataTypes.INTEGER, allowNull: true,
    } )
    declare authorId: number;

    @BelongsTo( () => User )
    declare author: NonAttribute<User>;

    @ForeignKey( () => Competition ) @Column( {
        type: DataTypes.INTEGER, allowNull: true,
    } )
    declare competitionId?: CreationOptional<number>;

    @BelongsTo( () => Competition )
    declare competition?: NonAttribute<Competition>;

    @ForeignKey( () => Tournament ) @Column( {
        type: DataTypes.INTEGER, allowNull: true,
    } )
    declare tournamentId?: CreationOptional<number>;

    @BelongsTo( () => Tournament )
    declare tournament?: NonAttribute<Tournament>;

    @BelongsToMany( () => User, () => CompetitionUser )
    declare users: NonAttribute<User[]>;

    @BelongsToMany( () => Team, () => CompetitionTeam )
    declare teams: NonAttribute<Team[]>;

    declare addUser: HasManyAddAssociationMixin<User, number>;

    declare removeUser: HasManyRemoveAssociationMixin<User, number>;

    declare addTeam: HasManyAddAssociationMixin<Team, number>;

    declare removeTeam: HasManyRemoveAssociationMixin<Team, number>;
}

export interface CompetitionTableNormalized
    extends Omit<InferAttributes<CompetitionTable>, "participants" | "outsiders"> {
    outsidersUsers: CompetitionParticipant<User | Team>[][],
    participantsUsers: CompetitionParticipant<User | Team>[][];
    users: User[];
    teams: Team[];
}

export interface CompetitionNormalized extends Omit<InferAttributes<Competition>, 'competitionTable'> {
    competitionTable: CompetitionTableNormalized;
}
