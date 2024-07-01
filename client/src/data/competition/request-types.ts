export enum CompetitionRequestTypeId {
    ALL = "all",
    OWN = "own",
    OWN_INCLUDED = "own-included"
}

export interface CompetitionRequestType {
    id: CompetitionRequestTypeId;
    label: string;
}

export const COMPETITION_REQUEST_TYPES: Record<CompetitionRequestTypeId, CompetitionRequestType> = {
    [CompetitionRequestTypeId.ALL]: {
        id: CompetitionRequestTypeId.ALL,
        label: "Все"
    },
    [CompetitionRequestTypeId.OWN_INCLUDED]: {
        id: CompetitionRequestTypeId.OWN_INCLUDED,
        label: "Вы учавствуете"
    },
    [CompetitionRequestTypeId.OWN]: {
        id: CompetitionRequestTypeId.OWN,
        label: "Ваши турниры"
    },
};
