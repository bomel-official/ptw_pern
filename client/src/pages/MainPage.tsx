import {NavLink} from "react-router-dom";
import {__} from "../multilang/Multilang";

import {Header} from "../components/base/Header";
import {Footer} from "../components/base/Footer";

import HeroRoundsImg from "./../static/images/rounds.png"
import HeroCharacterImg from "./../static/images/main-hero-character.png"
import HeroCharacterShadowImg from "./../static/images/main-hero-character-shadow.png"
import HeroBackgroundImg from "./../static/images/main-hero.jpg"

import {GameTabs} from "../components/base/GameTabs";
import {TournamentsList} from "../components/tournament/TournamentsList";
import {useContext} from "react";
import {AuthContext} from "../context/AuthContext";


export const MainPage = () => {
    const {isAuthenticated} = useContext(AuthContext)
    return (
        <div className="MainPage full-height">
            <Header borderBottom={true}/>
            <div className="hero">
                <img src={HeroBackgroundImg} alt="Hero background" className="hero__bg"/>
                <GameTabs transparentBg={true}/>
                <div className="container">
                    <h1 className="hero__title">{__('Организуем турниры \nи развиваем киберспорт')}</h1>
                    <h3 className="hero__subtitle">{__(`Наша платформа — это трамплин для старта в мире киберспорта. \nДаем возможность каждому зарабатывать на своем хобби.`)}</h3>
                    <NavLink to={isAuthenticated ? '/tournaments' : '/auth'} className={'hero__callToCation'}>
                        <div>{__('Присоединяйся!')}</div>
                    </NavLink>
                </div>
                <div className="hero__character">
                    <img src={HeroCharacterShadowImg} alt="Main character shadow" className="hero__characterShadowImg"/>
                    <img src={HeroRoundsImg} alt="Background rounds" className="hero__roundsImg"/>
                    <img src={HeroCharacterImg} alt="Main character" className="hero__characterImg"/>
                </div>
            </div>
            <div className="recent">
                <div className="container">
                    <h2 className="recent__title">{__('Участвуй в наших турнирах')}</h2>
                    <h3 className="recent__subtitle">{__('Lorem ipsum dolor sit amet consectetur. Pellentesque felis lorem ornare volutpat accumsan eu gravida nec tincidunt.')}</h3>

                    <TournamentsList status={'active'} columns={3}/>

                    <h2 className="recent__second-title">{__('Прошедшие турниры')}</h2>

                    <TournamentsList status={'finished'} columns={3}/>
                </div>
            </div>

            <Footer/>
        </div>
    )
}