import {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
    Model
} from "sequelize";

export class BuildWeaponType
    extends Model<InferAttributes<BuildWeaponType>, InferCreationAttributes<BuildWeaponType>> {
    declare id: CreationOptional<number>;
    declare title_RU?: string;
    declare title_EU?: string;
}
