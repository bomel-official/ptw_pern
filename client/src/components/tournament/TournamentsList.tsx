import {IResultStatus} from "../../data/ResultStatuses";
import {TournamentPreview} from "./TournamentPreview";
import {useCallback, useContext, useEffect, useState} from "react";
import {__} from "../../multilang/Multilang";
import {GameContext, IGame} from "../../context/GameContext";
import {useHttp} from "../../hooks/http.hook";
import {ITournament} from "../../StoreTypes";

export const TournamentsList = ({status, columns, type = 'tournament'}: {status?: IResultStatus, columns: number, type?: 'tournament'|'hub'}) => {
    const [col] = useState<number>(columns)
    const [data, setData] = useState<Array<ITournament>>([])
    const [isShowMore, setIsShowMore] = useState<boolean>(false)

    const {game} = useContext(GameContext)
    const {request} = useHttp()

    const fetchData = useCallback(async (numberPost: number, status: IResultStatus | undefined, game: IGame, type: 'tournament'|'hub') => {
        const {tournaments} = await request(`/api/tournament/get-all?status=${status || ''}&numberPosts=${numberPost}&game=${game}&type=${type}`, 'GET')
        setIsShowMore(col - tournaments.length === 0)
        setData(tournaments)
    }, [])

    useEffect(() => {
        if (game) {
            fetchData(col, status, game, type).catch(() => {})
        }
    }, [col, fetchData, status, game, type])

    const fetchAllPosts = () => {
        fetchData(-1, status, game, type).catch(() => {})
        setIsShowMore(false)
    }

    return (
        <ul className={`tournamentsList ${status}`}>
            {data.map((item) => (
                <TournamentPreview item={item} status={status} columns={col} key={item.id}/>
            ))}

            { isShowMore &&
                <button
                    className="tournamentsList__showMore"
                    onClick={fetchAllPosts}
                >
                    {__('Показать все турниры')}
                </button>
            }
        </ul>
    )
}