import { Game } from "@constants";
import { BuildWeaponType } from "@core";
import {
    CreationOptional,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute
} from "sequelize";

export class BuildWeapon
    extends Model<InferAttributes<BuildWeapon>, InferCreationAttributes<BuildWeapon>> {
    declare id: CreationOptional<number>;
    declare gameVersion?: CreationOptional<Game>;
    declare image?: CreationOptional<string>;
    declare allowedAttachments: CreationOptional<number[]>;

    declare title_RU?: string;
    declare title_EU?: string;

    declare buildWeaponTypeId: ForeignKey<BuildWeaponType["id"]>;
    declare buildWeaponType: NonAttribute<BuildWeaponType>;
}
