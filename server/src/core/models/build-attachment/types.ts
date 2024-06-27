import { Game } from "@constants";
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, NonAttribute } from "sequelize";
import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { BuildAttachmentType } from "../build-attachment-type";

@Table( {
    tableName: "build_attachments",
    freezeTableName: true
} )
export class BuildAttachment
    extends Model<InferAttributes<BuildAttachment>, InferCreationAttributes<BuildAttachment>> {

    @Column( {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    } )
    declare id: CreationOptional<number>;

    @Column( {
        type: DataTypes.STRING, allowNull: true
    } )
    declare gameVersion?: Game;

    @Column( {
        type: DataTypes.STRING, allowNull: true
    } )
    declare title_RU?: string;

    @Column( {
        type: DataTypes.STRING, allowNull: true
    } )
    declare title_EU?: string;

    @Column( {
        type: DataTypes.STRING, allowNull: true
    } )
    declare image?: string;

    @ForeignKey( () => BuildAttachmentType ) @Column( {
        type: DataTypes.INTEGER, allowNull: true
    } )
    declare buildAttachmentTypeId: number;

    @BelongsTo( () => BuildAttachmentType )
    declare buildAttachmentType?: NonAttribute<BuildAttachmentType>;
}
