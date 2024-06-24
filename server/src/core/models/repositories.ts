import { Database } from "@db";
import { BuildAttachmentType } from "./build-attachment-type/types";
import { BuildAttachment } from "./build-attachment/types";
import { BuildMode } from "./build-mode/types";
import { BuildWeaponType } from "./build-weapon-type/types";
import { BuildWeapon } from "./build-weapon/types";
import { Build } from "./build/types";
import { FriendRequest } from "./friend-request/types";
import { Invoice } from "./invoice/types";
import { ParticipantRequest } from "./participant-request/types";
import { ParticipantUser } from "./participant-user/types";
import { Participant } from "./participant/types";
import { ProductCat } from "./product-cat/types";
import { Product } from "./product/types";
import { Question } from "./question/types";
import { TeamRequest } from "./team-request/types";
import { Team } from "./team/types";
import { TournamentUser } from "./tournament-user/types";
import { Tournament } from "./tournament/types";
import { User } from "./user/types";

export const UserRepository = Database.getRepository( User );

export const TournamentRepository = Database.getRepository( Tournament );

export const TournamentUserRepository = Database.getRepository( TournamentUser );

export const TeamRepository = Database.getRepository( Team );

export const TeamRequestRepository = Database.getRepository( TeamRequest );

export const QuestionRepository = Database.getRepository( Question );

export const ProductRepository = Database.getRepository( Product );

export const ProductCatRepository = Database.getRepository( ProductCat );

export const ParticipantRepository = Database.getRepository( Participant );

export const ParticipantUserRepository = Database.getRepository( ParticipantUser );

export const ParticipantRequestRepository = Database.getRepository( ParticipantRequest );

export const InvoiceRepository = Database.getRepository( Invoice );

export const FriendRequestRepository = Database.getRepository( FriendRequest );

export const BuildRepository = Database.getRepository( Build );

export const BuildWeaponRepository = Database.getRepository( BuildWeapon );

export const BuildWeaponTypeRepository = Database.getRepository( BuildWeaponType );

export const BuildModeRepository = Database.getRepository( BuildMode );

export const BuildAttachmentRepository = Database.getRepository( BuildAttachment );

export const BuildAttachmentTypeRepository = Database.getRepository( BuildAttachmentType );
