import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, NonAttribute } from "sequelize";
import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Participant } from "../participant";

@Table( {
    tableName: "invoices",
    freezeTableName: true
} )
export class Invoice
    extends Model<InferAttributes<Invoice>, InferCreationAttributes<Invoice>> {

    @Column( {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    } )
    declare id: CreationOptional<number>;

    @Column( {
        type: DataTypes.STRING, allowNull: true
    } )
    declare enotId?: CreationOptional<string>;

    @Column( {
        type: DataTypes.STRING, allowNull: true
    } )
    declare url?: CreationOptional<string>;

    @Column( {
        type: DataTypes.FLOAT, allowNull: false
    } )
    declare amount: number;

    @Column( {
        type: DataTypes.STRING, defaultValue: "EUR"
    } )
    declare currency: CreationOptional<string>;

    @Column( {
        type: DataTypes.STRING, defaultValue: "created"
    } )
    declare status: CreationOptional<string>;

    @Column( {
        type: DataTypes.DATE, allowNull: true
    } )
    declare expired?: CreationOptional<string>;

    @ForeignKey( () => Participant ) @Column( {
        type: DataTypes.INTEGER, allowNull: true
    } )
    declare participantId?: number;

    @BelongsTo( () => Participant )
    declare participant?: NonAttribute<Participant>;
}
