import { Invoice, Team, Tournament, User } from "@core";
import {
    CreationOptional,
    ForeignKey,
    HasManyAddAssociationMixin,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute
} from "sequelize";

export class Participant
    extends Model<InferAttributes<Participant>, InferCreationAttributes<Participant, { omit: "invoice" | "team" | "tournament" | "users" }>> {
    declare id: CreationOptional<number>;
    declare points: CreationOptional<number>;
    declare dataArray: CreationOptional<number[][]>;
    declare places: CreationOptional<number[][]>;
    declare isRoundsHidden: CreationOptional<boolean[]>;
    declare roomNumber: CreationOptional<number>;
    declare invoiceUrl?: CreationOptional<string>;
    declare payMethod: CreationOptional<string>;
    declare isPaid: CreationOptional<boolean>;
    declare priority: CreationOptional<number>;

    declare users: NonAttribute<User[]>;

    declare teamId: ForeignKey<Team["id"]>;
    declare team: NonAttribute<Team>;

    declare tournamentId: ForeignKey<Tournament["id"]>;
    declare tournament: NonAttribute<Tournament>;

    declare invoiceId: CreationOptional<ForeignKey<Invoice["id"]>>;
    declare invoice: NonAttribute<Invoice>;

    declare addUser: HasManyAddAssociationMixin<User, number>;
    declare removeUser: HasManyAddAssociationMixin<User, number>;
}
