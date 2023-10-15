export type IResultStatus = 'active' | 'finished'

export const ResultStatuses: Record<IResultStatus, {lowerName: string, upperName: string, previewName: string, id: IResultStatus}> = {
    'active': {
        lowerName: 'активные',
        upperName: 'Активные',
        previewName: 'Прием заявок',
        id: 'active'
    },
    'finished': {
        lowerName: 'завершенные',
        upperName: 'Завершенные',
        previewName: 'Закончился',
        id: 'finished'
    }
}