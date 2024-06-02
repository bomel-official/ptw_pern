import { Participant, User } from "@core";
import {
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model
} from "sequelize";

export class ParticipantUser
    extends Model<InferAttributes<ParticipantUser>, InferCreationAttributes<ParticipantUser>> {
    declare id: number;

    declare userId: ForeignKey<User["id"]>;
    declare participantId: ForeignKey<Participant["id"]>;
}
