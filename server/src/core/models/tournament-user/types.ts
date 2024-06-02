import { Tournament, User } from "@core";
import {
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model
} from "sequelize";

export class TournamentUser extends Model<InferAttributes<TournamentUser>,
    InferCreationAttributes<TournamentUser>> {
    declare id: number;

    declare userId: ForeignKey<User["id"]>;
    declare tournamentId: ForeignKey<Tournament["id"]>;
}
