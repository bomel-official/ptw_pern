import { Device, Platform, UserRole } from "@constants";
import { Team } from "@core";
import {
    CreationOptional,
    HasManyAddAssociationMixin,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute
} from "sequelize";

export class User
    extends Model<InferAttributes<User, { omit: "own_teams" }>,
        InferCreationAttributes<User, { omit: "own_teams" }>> {
    declare id: CreationOptional<number>;
    declare nickname: CreationOptional<string>;
    declare email: string;
    declare password: CreationOptional<string>;
    declare role: CreationOptional<UserRole>;
    declare status: CreationOptional<string>;
    declare avatar?: CreationOptional<string>;

    declare twitch?: CreationOptional<string>;
    declare twitter?: CreationOptional<string>;
    declare steam?: CreationOptional<string>;
    declare vk?: CreationOptional<string>;
    declare youtube?: CreationOptional<string>;
    declare activisionId?: CreationOptional<string>;

    declare discord_id?: CreationOptional<string>;
    declare discord_username?: CreationOptional<string>;
    declare discord_avatar?: CreationOptional<string>;

    declare friends: CreationOptional<number[]>;
    declare platform: CreationOptional<Platform>;
    declare device: CreationOptional<Device>;

    declare statsToursPlayed: CreationOptional<number>;
    declare statsToursList: CreationOptional<number[]>;
    declare statsToursWon: CreationOptional<number>;
    declare statsToursTop3: CreationOptional<number>;
    declare statsAverageKills: CreationOptional<number>;
    declare statsAmountKills: CreationOptional<number>;

    declare own_teams: NonAttribute<Team>[];
    declare addOwn_team: HasManyAddAssociationMixin<Team, number>;
}

export interface JWTUserData {
    id: User["id"],
    email: User["email"],
    nickname: User["nickname"],
    role: User["role"],
}
