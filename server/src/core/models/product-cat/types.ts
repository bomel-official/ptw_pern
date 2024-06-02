import { InferAttributes, InferCreationAttributes, Model } from "sequelize";

export class ProductCat
    extends Model<InferAttributes<ProductCat>, InferCreationAttributes<ProductCat>> {
    declare id: number;
    declare title: string;
    declare slug: string;
}
