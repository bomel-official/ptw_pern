import { Game, TournamentType } from "@constants";
import { User } from "../user";
import {
    CreationOptional,
    HasManyRemoveAssociationMixin,
    InferAttributes,
    InferCreationAttributes,
    Model
} from "sequelize";

export class Tournament
    extends Model<InferAttributes<Tournament>, InferCreationAttributes<Tournament>> {
    declare id: CreationOptional<number>;
    declare previewImg?: CreationOptional<string>;

    declare slug: string;
    declare game: Game;
    declare type: TournamentType;
    declare twitchChannel: string;
    declare dateBegin: string;
    declare dateEnd: string;
    declare maxUsers: number;
    declare playersInTeam: number;
    declare participationPrice: CreationOptional<number>;
    declare prizes: number;
    declare prize_1: number;
    declare prize_2: number;
    declare prize_3: number;

    declare participantsList: CreationOptional<number[]>;
    declare isRegisterOn: CreationOptional<boolean>;

    declare title_RU: string;
    declare title_EU: string;
    declare descRules_RU: string;
    declare descRules_EU: string;
    declare descAdditional_RU: string;
    declare descAdditional_EU: string;
    declare format_RU: string;
    declare format_EU: string;

    declare removePlayer: HasManyRemoveAssociationMixin<User, number>;
    declare addPlayer: HasManyRemoveAssociationMixin<User, number>;
}
