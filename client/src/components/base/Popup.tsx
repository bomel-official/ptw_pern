import {ReactChildren} from "../../ReactTypes";

export const Popup = ({children, isActive, onHide, title, width, height, overflow}: {children: ReactChildren, isActive: boolean, onHide: () => void, title: string, width?: string, height?: string, overflow?: string}) => {
    return (
        <div className={isActive ? "popup active" : "popup"}>
            <div className="popup__wrapper" style={{width: width ?? '440px', height: height ?? 'auto', display: 'flex', flexDirection: 'column', overflow: overflow ?? 'visible' }}>
                <div className="popup__header flex">
                    <h2 className="popup__title">{title}</h2>
                    <button
                        className="popup__cross"
                        onClick={onHide}
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 5L10 10M10 10L5 15M10 10L5 5M10 10L15 15" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}