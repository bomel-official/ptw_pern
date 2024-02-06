import {socialItems} from "../../data/Links";
import {NavLink} from "react-router-dom";
import {__} from "../../multilang/Multilang";

export const SideMenu = (props: {menu: Array<{to: string, name: string, icon: string, isMarginBottom: boolean}>}) => {
    const menu = props.menu
    return (
        <aside className="side__left ds">
            <div className="side__left-flex">
                <ul className="side__left-items">
                    { menu.map((value, index) => {
                        return <li className={value.isMarginBottom ? "side__left-item mb12" : "side__left-item"} key={index}>
                            <NavLink to={value.to}>
                                <img src={value.icon} alt={value.name} width="20" height="20"/>
                                <span>{__(value['name'])}</span>
                            </NavLink>
                        </li>
                    }) }
                </ul>
                <div className="side__left-bottom">
                    <h3 className="side__left-title">Play to win</h3>
                    <h4 className="side__left-subtitle">The best Warzone tournament organizer since 2021.</h4>
                    <div className="side__left-social flex">
                        { socialItems.map((value, index) => (
                            <NavLink
                                className="side__left-social-item"
                                to={value.to}
                                key={index}
                                target="_blank"
                            >
                                <img src={value.icon} alt={`Our ${value.name} channel`} width="20" height="20"/>
                            </NavLink>
                        )) }
                    </div>
                </div>
            </div>
        </aside>
    )
}