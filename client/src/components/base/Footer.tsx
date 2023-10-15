import {NavLink} from "react-router-dom";

import FooterLogo from '../../static/icons/logo-footer.png'
import {__} from "../../multilang/Multilang";
import {socialItems} from "../../data/Links";

export const Footer = () => {
    return (
        <footer className="footer" id="footer">
            <div className="container">
                <div className="flex flex-mb-column">
                    <NavLink to="/" className="footer__logo flex">
                        <img src={FooterLogo} alt="Logo" width="88" height="88"/>
                        <h3 className="footer__logo-title">Play to win</h3>
                    </NavLink>
                    <p className="footer__text mb">Lorem ipsum dolor sit amet consectetur.</p>
                    <div className="footer__social flex">
                        { socialItems.map((value, index) => (
                            <NavLink
                                className="footer__social-item"
                                to={value.to}
                                key={index}
                                target="_blank"
                            >
                                <img src={value.icon} alt={`Our ${value.name} channel`} width="20" height="20"/>
                            </NavLink>
                        )) }
                    </div>
                    <button
                        className="footer__up"
                        onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
                    >
                        <span className="mb">{__('Наверх')}</span>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.99996 15.8334V4.16675M9.99996 4.16675L4.16663 10.0001M9.99996 4.16675L15.8333 10.0001" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        </footer>
    )
}