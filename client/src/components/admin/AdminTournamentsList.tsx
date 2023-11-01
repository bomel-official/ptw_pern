import {useCallback, useContext, useEffect, useState} from "react";
import {__} from "../../multilang/Multilang";
import {GameContext, IGame} from "../../context/GameContext";
import {useHttp} from "../../hooks/http.hook";
import {ITournament} from "../../StoreTypes";
import {AdminTournamentPreview} from "./AdminTournamentPreview";

export const AdminTournamentsList = ({columns}: {columns: number}) => {
    const [col] = useState<number>(columns)
    const [data, setData] = useState<Array<ITournament>>([])
    const [isShowMore, setIsShowMore] = useState<boolean>(false)

    const {game} = useContext(GameContext)
    const {request} = useHttp()

    const fetchData = useCallback(async (numberPost: number, game: IGame) => {
        const {tournaments} = await request(`/api/tournament/get-all?numberPosts=${numberPost}&game=${game}`, 'GET')
        setIsShowMore(col - tournaments.length === 0)
        setData(tournaments)
    }, [])

    useEffect(() => {
        if (game) {
            fetchData(col, game).catch(() => {})
        }
    }, [col, fetchData, game])

    const fetchAllPosts = () => {
        fetchData(-1, game).catch(() => {})
        setIsShowMore(false)
    }

    return (
        <ul className={`tournamentsList`}>
            {data.map((item) => (
                <AdminTournamentPreview item={item} columns={col} key={item.id}/>
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