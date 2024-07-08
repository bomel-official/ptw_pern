import {
    CompetitionDTO,
    CompetitionParticipant,
    CompetitionTable,
    Team,
    IUser,
    CompetitionTableDTO
} from "../../StoreTypes";

export const COMPETITION_ITEM_EMPTY_INDEX = -1;

export const COMPETITION_ITEM_DEFAULT: CompetitionParticipant<IUser | Team> = {
    index: COMPETITION_ITEM_EMPTY_INDEX,
    items: [],
    points: 0,
};

export const COMPETITION_ITEM_NUMBER_DEFAULT: CompetitionParticipant<number> = {
    index: COMPETITION_ITEM_EMPTY_INDEX,
    items: [],
    points: 0,
};

export const COMPETITION_DEFAULT: CompetitionDTO = {
    title: "",
    competitionTable: {
        itemsInTeam: 1,
        allowShuffle: true,
        type: "user",
        parentType: "competition",
        participantsUsers: [],
        isOutsiders: false,
        outsidersUsers: [],
        users: [],
        teams: []
    }
};

export const TOURNAMENT_COMPETITION_TABLE_DEFAULT: CompetitionTableDTO = {
    itemsInTeam: 1,
    allowShuffle: true,
    type: "team",
    parentType: "tournament",
    participantsUsers: [],
    isOutsiders: false,
    outsidersUsers: [],
    users: [],
    teams: []
}

export const COMPETITION_TYPE_OPTIONS: Array<{ value: CompetitionTable["type"], text: string }> = [
    {
        text: "Пользователи",
        value: "user"
    },
    {
        text: "Команды",
        value: "team"
    },
];
