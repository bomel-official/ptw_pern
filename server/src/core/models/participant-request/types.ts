import { Participant } from "@core";
import {
    CreationOptional,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute
} from "sequelize";

export class ParticipantRequest
    extends Model<InferAttributes<ParticipantRequest>, InferCreationAttributes<ParticipantRequest>> {
    declare id: CreationOptional<number>;
    declare dataArray: number[][];
    declare places: number[][];
    declare approveUrl: string;
    declare status: CreationOptional<string>;

    declare participantId: ForeignKey<Participant["id"]>;
    declare participant: NonAttribute<Participant>;
}
