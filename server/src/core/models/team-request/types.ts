import {
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute
} from "sequelize";
import { Team } from "../team";

export class TeamRequest
    extends Model<InferAttributes<TeamRequest>, InferCreationAttributes<TeamRequest>> {
    declare id: number;

    declare teamId: ForeignKey<Team["id"]>;
    declare team: NonAttribute<Team>;
}
