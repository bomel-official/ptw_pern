import { Game } from "@constants";
import { BuildWeapon, BuildWeaponType, User } from "@core";
import {
    CreationOptional,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute
} from "sequelize";

export class Build
    extends Model<InferAttributes<Build>, InferCreationAttributes<Build>> {
    declare id: CreationOptional<number>;
    declare title?: CreationOptional<string>;
    declare gameVersion?: CreationOptional<Game>;
    declare attachments: CreationOptional<number[][]>;
    declare likes: CreationOptional<number[]>;
    declare likesCount: CreationOptional<number>;
    declare isMeta: CreationOptional<boolean>;

    declare userId: ForeignKey<User["id"]>;
    declare user: NonAttribute<User>;

    declare buildWeaponTypeId: ForeignKey<BuildWeaponType["id"]>;
    declare buildWeaponType: NonAttribute<BuildWeaponType>;

    declare buildWeaponId: ForeignKey<BuildWeapon["id"]>;
    declare buildWeapon: NonAttribute<BuildWeapon>;
}
