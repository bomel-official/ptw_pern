import {
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model
} from "sequelize";
import { Participant } from "../participant";
import { User } from "../user";

export class ParticipantUser
    extends Model<InferAttributes<ParticipantUser>, InferCreationAttributes<ParticipantUser>> {
    declare id: number;

    declare userId: ForeignKey<User["id"]>;
    declare participantId: ForeignKey<Participant["id"]>;
}
