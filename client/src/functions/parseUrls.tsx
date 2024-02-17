import {NavLink} from "react-router-dom";

export function parseUrls(text: any): any {
    const urlRegex = /(https?:\/\/[^\s]+)/g;// Разделение текста на части по URL

    const parts = text.split(urlRegex);

    return parts.map((part: any, index: number) =>
        urlRegex.test(part) ? (
            <NavLink key={part + index} to={part} target="_blank" rel="noopener noreferrer">
                {part}
            </NavLink>
        ) : (
            <span key={index}>{part}</span>
        )
    );
}