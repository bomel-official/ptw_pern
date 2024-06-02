import {
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model
} from "sequelize";
import { Tournament } from "../tournament";
import { User } from "../user";

export class TournamentUser extends Model<InferAttributes<TournamentUser>,
    InferCreationAttributes<TournamentUser>> {
    declare id: number;

    declare userId: ForeignKey<User["id"]>;
    declare tournamentId: ForeignKey<Tournament["id"]>;
}
