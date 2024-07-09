import React from 'react';

const Loader = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" style={{
            margin: "auto",
            background: "#0D0E11",
            display: "block",
            shapeRendering: "auto"
        }} width="48px" height="48px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
            <circle cx="50" cy="50" r="41" strokeWidth="13" stroke="#f2360f" strokeDasharray="64.40264939859075 64.40264939859075" fill="none" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" keyTimes="0;1" values="0 50 50;360 50 50"/>
            </circle>
        </svg>
    );
};

export default Loader;
