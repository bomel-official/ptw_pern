import {
    CreationOptional,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute
} from "sequelize";
import { User } from "../user";

export class FriendRequest
    extends Model<InferAttributes<FriendRequest>, InferCreationAttributes<FriendRequest>> {
    declare id: CreationOptional<number>;
    declare isAccepted: boolean;

    declare userFromId: ForeignKey<User["id"]>;
    declare user_from: NonAttribute<User>;

    declare userToId: ForeignKey<User["id"]>;
    declare user_to: NonAttribute<User>;
}
