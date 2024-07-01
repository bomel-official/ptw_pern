export enum CompetitionRequestTypeId {
    ALL = "all",
    OWN = "own",
    OWN_INCLUDED = "own-included"
}

export interface CompetitionRequestType {
    id: CompetitionRequestTypeId;
    label: string;
    authRestricted: boolean;
}

export const COMPETITION_REQUEST_TYPES: Record<CompetitionRequestTypeId, CompetitionRequestType> = {
    [CompetitionRequestTypeId.ALL]: {
        id: CompetitionRequestTypeId.ALL,
        label: "Все",
        authRestricted: false
    },
    [CompetitionRequestTypeId.OWN_INCLUDED]: {
        id: CompetitionRequestTypeId.OWN_INCLUDED,
        label: "Вы участвуете",
        authRestricted: true
    },
    [CompetitionRequestTypeId.OWN]: {
        id: CompetitionRequestTypeId.OWN,
        label: "Ваши турниры",
        authRestricted: true
    },
};
