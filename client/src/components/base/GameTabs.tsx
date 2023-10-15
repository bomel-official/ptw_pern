import {useContext} from "react";
import {GameContext} from "../../context/GameContext";
import {Games, IGameObject} from "../../data/Games";

export const GameTabs = (props: {transparentBg?: boolean}) => {
    const {game, setGame} = useContext(GameContext)
    return (
        <div
            className={props.transparentBg ? "tabs tabs-2" : "tabs tabs-2 fill-bg"}
        >
            {Object.values(Games).map((gameObject: IGameObject, index: number) => (
                <button
                    className={(game === gameObject.id) ? "tab active" : "tab"}
                    onClick={() => setGame(gameObject.id)}
                    key={index}
                >
                    <img src={gameObject.icon} alt=""/>
                </button>
            )) }
        </div>
    )
}