import {ITournament, IUser} from "../StoreTypes";
import {JSX} from "react";
import {isUserAdmin} from "./isUserAdmin";
import {NavLink} from "react-router-dom";
import {getTournamentAdditionalFields} from "./getTournamentAdditionalFields";
import {__} from "../multilang/Multilang";

export const getRegisterHTML = (tournament: ITournament | null | undefined, user: IUser | null | undefined, onClick: () => void): JSX.Element => {
    if (tournament && tournament.isRegisterOn) {
        const {isUserRegistered} = getTournamentAdditionalFields(tournament, user)
        const dateBegin = new Date(tournament.dateBegin)

        if (isUserAdmin(user)) {
            return (<button className="side__top-register" onClick={onClick}>
                {__('Добавить участника')}
            </button>) // () => setIsRegisterFormActive(true)
        } else if (!user) {
            return (<NavLink to="/auth" className="side__top-register">
                {__('Принять участие')}
            </NavLink>)
        } else if (isUserRegistered) {
            return (<button className="side__top-unregister" onClick={onClick}>
                {__('Изменить заявку')}
            </button>) // unregisterParticipant
        } else if (dateBegin.getTime() > Date.now() && !isUserRegistered) {
            return (<button className="side__top-register" onClick={onClick}>
                {__('Принять участие')}
            </button>) // () => setIsRegisterFormActive(true)
        }
    }
    return (<span className="side__top-reg-inactive">Регистрация закрыта</span>)
}