import { getEnv } from "@libs";

import { Sequelize } from "sequelize-typescript";
import { BuildAttachmentType } from "./core/models/build-attachment-type/types";
import { BuildAttachment } from "./core/models/build-attachment/types";
import { BuildMode } from "./core/models/build-mode/types";
import { BuildWeaponType } from "./core/models/build-weapon-type/types";
import { BuildWeapon } from "./core/models/build-weapon/types";
import { Build } from "./core/models/build/types";
import { CompetitionTable } from "./core/models/competition-table/types";
import { CompetitionTeam } from "./core/models/competition-team/types";
import { CompetitionUser } from "./core/models/competition-user/types";
import { Competition } from "./core/models/competition/types";
import { FriendRequest } from "./core/models/friend-request/types";
import { Invoice } from "./core/models/invoice/types";
import { ParticipantRequest } from "./core/models/participant-request/types";
import { ParticipantUser } from "./core/models/participant-user/types";
import { Participant } from "./core/models/participant/types";
import { ProductCat } from "./core/models/product-cat/types";
import { Product } from "./core/models/product/types";
import { Question } from "./core/models/question/types";
import { TeamRequest } from "./core/models/team-request/types";
import { Team } from "./core/models/team/types";
import { TournamentUser } from "./core/models/tournament-user/types";
import { Tournament } from "./core/models/tournament/types";
import { User } from "./core/models/user/types";

export const Database = new Sequelize(
    getEnv( process.env.DB_NAME ),
    getEnv( process.env.DB_USER ),
    getEnv( process.env.DB_PASSWORD ),
    {
        models: [ User, TournamentUser, Tournament, TeamRequest, Team, Question, ProductCat, Product, ParticipantUser,
            ParticipantRequest, Participant, Invoice, FriendRequest, BuildWeaponType, BuildWeapon, BuildMode,
            BuildAttachmentType, BuildAttachment, Build, Competition, CompetitionUser, CompetitionTeam,
            CompetitionTable ],
        repositoryMode: true,
        dialect: "postgres",
        host: getEnv( process.env.DB_HOST ),
        port: parseInt( getEnv( process.env.DB_PORT ) )
    }
);
