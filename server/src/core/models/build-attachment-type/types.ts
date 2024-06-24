import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, NonAttribute } from "sequelize";
import { Column, HasMany, Model, Table } from "sequelize-typescript";
import { BuildAttachment } from "../build-attachment";

@Table( {
    tableName: "build_attachment_type"
} )
export class BuildAttachmentType
    extends Model<InferAttributes<BuildAttachmentType>, InferCreationAttributes<BuildAttachmentType>> {

    @Column( {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    } )
    declare id: CreationOptional<number>;

    @Column( {
        type: DataTypes.STRING, allowNull: true
    } )
    declare title_RU?: string;

    @Column( {
        type: DataTypes.STRING, allowNull: true
    } )
    declare title_EU?: string;

    @HasMany( () => BuildAttachment, {
        foreignKey: 'buildAttachmentTypeId'
    } )
    declare buildAttachment: NonAttribute<BuildAttachment[]>;
}
