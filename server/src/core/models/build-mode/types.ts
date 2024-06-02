import { Game } from "@constants";
import { InferAttributes, InferCreationAttributes, Model } from "sequelize";

export class BuildMode
    extends Model<InferAttributes<BuildMode>, InferCreationAttributes<BuildMode>> {
    declare id: number;
    declare gameVersion?: Game;

    declare title_RU?: string;
    declare title_EU?: string;
}
