import { Build } from "./build";
import { BuildAttachment } from "./build-attachment";
import { BuildAttachmentType } from "./build-attachment-type";
import { BuildWeapon } from "./build-weapon";
import { BuildWeaponType } from "./build-weapon-type";
import { FriendRequest } from "./friend-request";
import { Invoice } from "./invoice";
import { Participant } from "./participant";
import { ParticipantRequest } from "./participant-request";
import { ParticipantUser } from "./participant-user";
import { Product } from "./product";
import { ProductCat } from "./product-cat";
import { Team } from "./team";
import { TeamRequest } from "./team-request";
import { Tournament } from "./tournament";
import { TournamentUser } from "./tournament-user";
import { User } from "./user";

User.hasMany( Build, { foreignKey: "userId" } );
User.hasMany( Team, { as: "own_teams", foreignKey: "capitanId" } );
User.belongsToMany( Team, {
    as: "teams", through: TeamRequest, foreignKey: "userId", otherKey: "teamId"
} );
User.belongsToMany( Participant, {
    through: ParticipantUser, foreignKey: "userId", otherKey: "participantId"
} );
User.belongsToMany( Tournament,
    {
        as: "tournaments", through: TournamentUser, foreignKey: "userId",
        otherKey: "tournamentId"
    } );

Tournament.hasMany( Participant,
    { as: "participants", foreignKey: "tournamentId" } );
Tournament.belongsToMany( User, {
    as: "players", through: TournamentUser, foreignKey: "tournamentId",
    otherKey: "userId"
} );

Team.belongsTo( User, { as: "capitan", foreignKey: "capitanId" } );
Team.belongsToMany( User, {
    as: "players", through: TeamRequest, foreignKey: "teamId",
    otherKey: "userId"
} );
Team.hasOne( Participant, { foreignKey: "teamId" } );

ProductCat.hasMany( Product, { foreignKey: "productCatId" } );

Product.belongsTo( ProductCat, { foreignKey: "productCatId" } );

ParticipantRequest.belongsTo( Participant, { foreignKey: "participantId" } );

Participant.belongsToMany( User, {
    through: ParticipantUser, foreignKey: "participantId", otherKey: "userId"
} );
Participant.belongsTo( Team, { foreignKey: "teamId" } );
Participant.belongsTo( Tournament, { foreignKey: "tournamentId" } );
Participant.hasOne( ParticipantRequest, { foreignKey: "participantId" } );
Participant.belongsTo( Invoice, { foreignKey: "invoiceId" } );

Invoice.belongsTo( Participant, { foreignKey: "participantID" } );

FriendRequest.belongsTo( User, { as: "user_to", foreignKey: "userToId" } );
FriendRequest.belongsTo( User, { as: "user_from", foreignKey: "userFromId" } );

BuildWeaponType.hasMany( BuildWeapon, { foreignKey: "buildWeaponTypeId" } );
BuildWeaponType.hasMany( Build, { foreignKey: "buildWeaponTypeId" } );

BuildWeapon.belongsTo( BuildWeaponType, { foreignKey: "buildWeaponTypeId" } );
BuildWeapon.hasMany( Build, { foreignKey: "buildWeaponId" } );

BuildAttachmentType.hasMany( BuildAttachment, { foreignKey: "buildAttachmentTypeId" } );

BuildAttachment.belongsTo( BuildAttachmentType, { foreignKey: "buildAttachmentTypeId" } );

Build.belongsTo( User, { foreignKey: "userId" } );
Build.belongsTo( BuildWeaponType, { foreignKey: "buildWeaponTypeId" } );
Build.belongsTo( BuildWeapon, { foreignKey: "buildWeaponId" } );

export { Build };
export { BuildAttachment };
export { BuildAttachmentType };
export { BuildWeapon };
export { BuildWeaponType };
export { BuildMode } from "./build-mode";

export { Invoice };
export { Product };
export { ProductCat };
export { Question } from "./question";

export { Tournament };
export { Participant };
export { ParticipantRequest };
export { ParticipantUser };

export { Team };

export { User };

export { FriendRequest };
export { TeamRequest };
export { TournamentUser };
