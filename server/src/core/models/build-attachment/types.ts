import { Game } from "@constants";
import {
    CreationOptional,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute
} from "sequelize";
import { BuildAttachmentType } from "../build-attachment-type";

export class BuildAttachment
    extends Model<InferAttributes<BuildAttachment>, InferCreationAttributes<BuildAttachment>> {
    declare id: CreationOptional<number>;
    declare gameVersion?: Game;
    declare image?: string;

    declare title_RU?: string;
    declare title_EU?: string;

    declare buildAttachmentTypeId: ForeignKey<BuildAttachmentType["id"]>;
    declare buildAttachmentType: NonAttribute<BuildAttachmentType>;
}
