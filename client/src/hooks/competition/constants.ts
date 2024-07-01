import { CompetitionDTO } from "../../StoreTypes";

export const COMPETITION_EMPTY_NUMBER_VALUE = -1;

export const COMPETITION_DEFAULT: CompetitionDTO = {
    title: "",
    participants: [],
    participantsAmount: 0,
    participantsUsers: [],
    isOutsiders: false,
    outsiders: [],
    outsidersUsers: [],
};

export const COMPETITION_PARTICIPANT_AMOUNT_OPTIONS: Array<{ value: any, text: string }> = [
    {
        text: '2',
        value: 2
    },
    {
        text: '4',
        value: 4
    },
    {
        text: '8',
        value: 8
    },
    {
        text: '16',
        value: 16
    },
    {
        text: '32',
        value: 32
    },
    {
        text: '64',
        value: 64
    },
    {
        text: '128',
        value: 128
    },
    {
        text: '256',
        value: 256
    },
]
