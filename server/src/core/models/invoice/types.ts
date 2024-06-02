import { Participant } from "@core";
import {
    CreationOptional,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute
} from "sequelize";

export class Invoice
    extends Model<InferAttributes<Invoice>, InferCreationAttributes<Invoice>> {
    declare id: CreationOptional<number>;
    declare enotId?: CreationOptional<string>;
    declare url?: CreationOptional<string>;
    declare amount: number;
    declare currency: CreationOptional<string>;
    declare status: CreationOptional<string>;
    declare expired?: CreationOptional<string>;

    declare participantId?: ForeignKey<Participant["id"]>;
    declare participant: NonAttribute<Participant>;
}
