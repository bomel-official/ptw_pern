import {IResultStatus} from "../../data/ResultStatuses";
import {TournamentPreview} from "./TournamentPreview";
import {useCallback, useContext, useEffect, useState} from "react";
import {__} from "../../multilang/Multilang";
import {GameContext} from "../../context/GameContext";

export type ITournament = {
    id: number
}

export const TournamentsList = ({status, columns}: {status: IResultStatus, columns: number}) => {
    const [col] = useState<number>(columns)
    const [data, setData] = useState<Array<ITournament>>([])
    const [isShowMore, setIsShowMore] = useState<boolean>(false)

    const {game} = useContext(GameContext)

    const fetchData = useCallback((numberPost: number) => {
        const res = []
        if (numberPost === -1) {
            for (let i = 0; i < 10; i++) {
                res.push({id: i})
            }
        } else {
            for (let i = 0; i < numberPost; i++) {
                res.push({id: i})
            }
        }
        return res
    }, [])

    useEffect(() => {
        const newData = fetchData(col)
        setIsShowMore(col - newData.length === 0)
        setData(newData)
    }, [status, game, col, fetchData])

    const fetchAllPosts = () => {
        const newData = fetchData(-1)
        setIsShowMore(false)
        setData(newData)
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