import { BuildAttachment } from "@core";
import {
    CreationOptional,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute
} from "sequelize";

export class BuildAttachmentType
    extends Model<InferAttributes<BuildAttachmentType>, InferCreationAttributes<BuildAttachmentType>> {
    declare id: CreationOptional<number>;
    declare title_RU?: string;
    declare title_EU?: string;

    declare buildAttachmentId: ForeignKey<BuildAttachment["id"]>;
    declare buildAttachment: NonAttribute<BuildAttachment>;
}
