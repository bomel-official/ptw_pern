import { User } from "@core";
import {
    CreationOptional,
    ForeignKey,
    HasManyRemoveAssociationMixin,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute
} from "sequelize";

export class Team
    extends Model<InferAttributes<Team, { omit: "capitan" | "players" }>,
        InferCreationAttributes<Team, { omit: "capitan" | "players" }>> {
    declare id: CreationOptional<number>;
    declare slug?: string;
    declare name?: string;
    declare avatar?: string;

    declare capitan: NonAttribute<User>;
    declare capitanId: ForeignKey<User["id"]>;
    declare players: NonAttribute<User[]>;

    declare addPlayer: HasManyRemoveAssociationMixin<User, number>;
    declare removePlayer: HasManyRemoveAssociationMixin<User, number>;
}
