import {__, _f} from "../../multilang/Multilang";
import {NavLink} from "react-router-dom";
import {IResultStatus, ResultStatuses} from "../../data/ResultStatuses";
import {getFile} from "../../functions/getFile";
import {getDateString} from "../../functions/getDateString";

export const TournamentPreview = ({item, status, columns}: {item: any, status: IResultStatus | undefined, columns: number}) => {
    const dateBegin = new Date(item.dateBegin)
    const dateEnd = new Date(item.dateEnd)
    return (
        <li className={`previewVertical c${columns} ${(new Date(Date.now()) <= dateEnd) ? 'active' : 'finished'}`}>
            <div className="previewVertical__top">
                <img src={getFile(item.previewImg)} alt="Tournament name" className="previewVertical__img"/>
                <span className="previewVertical__status active">{status ? ResultStatuses[status].previewName : ResultStatuses['active'].previewName}</span>
            </div>
            <div className="previewVertical__bottom">
                <h3 className="previewVertical__title">{_f(item, 'title')}</h3>
                {/*<h4 className="previewVertical__subtitle">Ranked custom + solo</h4>*/}
                <div className="previewVertical__date flex">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.3333 1.66663V4.99996M6.66667 1.66663V4.99996M2.5 8.33329H17.5M4.16667 3.33329H15.8333C16.7538 3.33329 17.5 4.07948 17.5 4.99996V16.6666C17.5 17.5871 16.7538 18.3333 15.8333 18.3333H4.16667C3.24619 18.3333 2.5 17.5871 2.5 16.6666V4.99996C2.5 4.07948 3.24619 3.33329 4.16667 3.33329Z" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{getDateString(dateBegin, 'dd.mm.yyyy h:i')} – {getDateString(dateEnd, 'dd.mm.yyyy h:i')}</span>
                </div>
                <div className="previewVertical__users">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.3333 17.5V15.8333C13.3333 14.9493 12.9821 14.1014 12.357 13.4763C11.7319 12.8512 10.884 12.5 9.99999 12.5H4.99999C4.11593 12.5 3.26809 12.8512 2.64297 13.4763C2.01785 14.1014 1.66666 14.9493 1.66666 15.8333V17.5M18.3333 17.5V15.8333C18.3328 15.0948 18.087 14.3773 17.6345 13.7936C17.182 13.2099 16.5484 12.793 15.8333 12.6083M13.3333 2.60833C14.0503 2.79192 14.6859 3.20892 15.1397 3.79359C15.5935 4.37827 15.8399 5.09736 15.8399 5.8375C15.8399 6.57764 15.5935 7.29673 15.1397 7.88141C14.6859 8.46608 14.0503 8.88308 13.3333 9.06667M10.8333 5.83333C10.8333 7.67428 9.34094 9.16667 7.49999 9.16667C5.65904 9.16667 4.16666 7.67428 4.16666 5.83333C4.16666 3.99238 5.65904 2.5 7.49999 2.5C9.34094 2.5 10.8333 3.99238 10.8333 5.83333Z" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{Math.max(item.players.length, item.participantsList.length)} / {item.maxUsers} {__('участников')}</span>
                </div>
                <div className="previewVertical__buttons pt32">
                    <div className="previewVertical__fund">{item.prizes} ₽</div>
                    <NavLink to={`/tournament/${item.slug}/about`} className="previewVertical__link">{__('Подробнее')}</NavLink>
                </div>
            </div>
        </li>
    )
}

