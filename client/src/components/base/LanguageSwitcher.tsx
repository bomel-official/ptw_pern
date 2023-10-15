import {useContext} from "react";
import {LanguageContext} from "../../context/LanguageContext";

export const LanguageSwitcher = () => {
    const {language, setLanguage} = useContext(LanguageContext)
    return (
        <div className="language__wrapper flex">
            <div className="ds">
                <button
                    className={language === 'RU' ? "language active" : "language"}
                    onClick={() => setLanguage('RU')}
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 2C0 0.895429 0.895431 0 2 0H18C19.1046 0 20 0.89543 20 2V6.66667H0V2Z" fill="white"/>
                        <path d="M0 6.66667H20V13.3333H0V6.66667Z" fill="#012AA6"/>
                        <path d="M0 13.3333H20V18C20 19.1046 19.1046 20 18 20H2C0.895431 20 0 19.1046 0 18V13.3333Z" fill="#D30A10"/>
                    </svg>
                    <p className="language__text">RU</p>
                </button>
            </div>
            <div className="ds">
                <button
                    className={language === 'EU' ? "language active" : "language"}
                    onClick={() => setLanguage('EU')}
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="20" height="20" rx="2" fill="#333588"/>
                        <path d="M10.2148 16.1934L10.4394 16.8843H11.1659L10.5781 17.3114L10.8026 18.0024L10.2148 17.5753L9.62706 18.0024L9.85157 17.3114L9.26379 16.8843H9.99033L10.2148 16.1934Z" fill="#FECA12"/>
                        <path d="M13.7148 15.1934L13.9394 15.8843H14.6659L14.0781 16.3114L14.3026 17.0024L13.7148 16.5753L13.1271 17.0024L13.3516 16.3114L12.7638 15.8843H13.4903L13.7148 15.1934Z" fill="#FECA12"/>
                        <path d="M16.2148 12.6934L16.4394 13.3843H17.1659L16.5781 13.8114L16.8026 14.5024L16.2148 14.0753L15.6271 14.5024L15.8516 13.8114L15.2638 13.3843H15.9903L16.2148 12.6934Z" fill="#FECA12"/>
                        <path d="M15.9698 9.93446L16.6953 9.89644L16.8833 9.19465L17.1437 9.87294L17.8693 9.83492L17.3046 10.2921L17.565 10.9704L16.9557 10.5747L16.391 11.032L16.5791 10.3302L15.9698 9.93446Z" fill="#FECA12"/>
                        <path d="M14.9698 6.43446L15.6953 6.39644L15.8833 5.69465L16.1437 6.37294L16.8693 6.33492L16.3046 6.79214L16.565 7.47043L15.9557 7.07473L15.391 7.53195L15.5791 6.83017L14.9698 6.43446Z" fill="#FECA12"/>
                        <path d="M12.4737 3.93446L13.1992 3.89644L13.3873 3.19465L13.6476 3.87294L14.3732 3.83492L13.8085 4.29214L14.0689 4.97043L13.4596 4.57473L12.8949 5.03195L13.083 4.33017L12.4737 3.93446Z" fill="#FECA12"/>
                        <path d="M4.19241 9.93468L3.58308 10.3304L3.77113 11.0322L3.2065 10.5749L2.59717 10.9706L2.85754 10.2924L2.29291 9.83513L3.01845 9.87315L3.27882 9.19487L3.46687 9.89665L4.19241 9.93468Z" fill="#FECA12"/>
                        <path d="M5.19241 13.4347L4.58308 13.8304L4.77113 14.5322L4.2065 14.0749L3.59717 14.4706L3.85754 13.7924L3.29291 13.3351L4.01845 13.3732L4.27882 12.6949L4.46687 13.3967L5.19241 13.4347Z" fill="#FECA12"/>
                        <path d="M7.68069 15.9347L7.07136 16.3304L7.25941 17.0322L6.69478 16.5749L6.08545 16.9706L6.34582 16.2924L5.78119 15.8351L6.50673 15.8732L6.7671 15.1949L6.95515 15.8967L7.68069 15.9347Z" fill="#FECA12"/>
                        <path d="M10.4148 4.19958L9.82064 3.78148L9.23939 4.21739L9.45341 3.52308L8.85922 3.10498L9.58568 3.09398L9.7997 2.39968L10.0347 3.08718L10.7611 3.07617L10.1799 3.51208L10.4148 4.19958Z" fill="#FECA12"/>
                        <path d="M6.90335 5.20639L6.31174 4.78467L5.72783 5.217L5.9461 4.52402L5.35448 4.1023L6.08099 4.09574L6.29926 3.40276L6.53 4.09168L7.25652 4.08512L6.67261 4.51746L6.90335 5.20639Z" fill="#FECA12"/>
                        <path d="M4.40823 7.70511L3.8132 7.28821L3.23283 7.7253L3.44545 7.03056L2.85041 6.61367L3.57685 6.60119L3.78946 5.90645L4.02581 6.59348L4.75225 6.581L4.17188 7.01808L4.40823 7.70511Z" fill="#FECA12"/>
                    </svg>
                    <p className="language__text">EU</p>
                </button>
            </div>
            <div className="mb">
                <button
                    className="language"
                    onClick={() => (language === 'RU' ? setLanguage('EU') : setLanguage('RU'))}
                >
                    <i className="language__icon">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_119_4790)">
                                <path d="M18.3333 9.99999C18.3333 14.6024 14.6023 18.3333 9.99996 18.3333M18.3333 9.99999C18.3333 5.39762 14.6023 1.66666 9.99996 1.66666M18.3333 9.99999H1.66663M9.99996 18.3333C5.39759 18.3333 1.66663 14.6024 1.66663 9.99999M9.99996 18.3333C12.0844 16.0514 13.2689 13.09 13.3333 9.99999C13.2689 6.91002 12.0844 3.94862 9.99996 1.66666M9.99996 18.3333C7.91556 16.0514 6.731 13.09 6.66663 9.99999C6.731 6.91002 7.91556 3.94862 9.99996 1.66666M1.66663 9.99999C1.66663 5.39762 5.39759 1.66666 9.99996 1.66666" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_119_4790">
                                    <rect width="20" height="20" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                    </i>
                    <p className="language__text">{language}</p>
                </button>
            </div>
        </div>
    )
}