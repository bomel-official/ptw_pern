import {useState} from "react";

export const PreLoader = () => {
    const [isLoading, setIsLoading] = useState(false)

    window.onload = function() {
        setIsLoading(false)
    }

    const styles = `
    .preLoader {
      transition: opacity .09s ease-out,
                    visibility .09s ease-out,
                    z-index .09s ease-out;
                    
      background: rgba(13,13,13,.9);
      -webkit-backdrop-filter: blur(16px);
      backdrop-filter: blur(16px);
    
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: -400px;
      z-index: 1000;
    }
    .preLoader.hidden {
        opacity: 0;
        visibility: hidden;
        z-index: -1;
    }
    
    .preLoader__center {
      width: 392px;
      max-width: calc(100vw - 32px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: stretch;
      position: absolute;
      left: 50%;
      top: calc(50% - 200px);
      transform: translate(-50%, -50%);
    }
    
    .preLoader__center svg {
      width: 135px;
      height: 120px;
      margin-bottom: 48px;
    }
    
    .preLoader__progress {
      width: 100%;
      position: relative;
    }
    
    .preLoader__progress-bar {
      background-color: #1C1D21;
      height: 8px;
      width: 100%;
      position: relative;
      z-index: 2;
    }
    .preLoader__progress-barValue {
      width: 50%;
      position: absolute;
      top: 0;
      height: 8px;
      background-color: #D92632;
      z-index: 3;
      transition: width .05s ease-in-out;
    }
    .preLoader__progress-text {
      margin-top: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: "Inter", sans-serif;
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
      letter-spacing: 0;
      text-align: left;
      color: rgba(255,255,255,.5);
    }
    .lds-ring {
      display: inline-block;
      position: relative;
      width: 80px;
      height: 80px;
    }
    .lds-ring div {
      box-sizing: border-box;
      display: block;
      position: absolute;
      width: 64px;
      height: 64px;
      margin: 8px;
      border: 8px solid #D92632;
      border-radius: 50%;
      animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
      border-color: #D92632 transparent transparent transparent;
    }
    .lds-ring div:nth-child(1) {
      animation-delay: -0.45s;
    }
    .lds-ring div:nth-child(2) {
      animation-delay: -0.3s;
    }
    .lds-ring div:nth-child(3) {
      animation-delay: -0.15s;
    }
    @keyframes lds-ring {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
    `
    return (
        <div className="preLoader__wrapper">
            <style>{styles}</style>
            <div className={isLoading ? "preLoader" : "preLoader hidden"}>
                <div className="preLoader__center">
                    <div className="lds-ring">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    {/*<svg width="136" height="120" viewBox="0 0 136 120" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                    {/*    <path d="M97.6041 52.5001L124.25 0H11.75L38.3959 52.4999L42.1459 30L36.4164 15L60.4999 15.0001V112.5L68.0001 120L75.4999 112.5V15L99.5835 15.0001L93.8541 30.0001L97.6041 52.5001Z" fill="#D92632"/>*/}
                    {/*    <path d="M41.75 89.9999L53 77.1427V97.4999L38 112.5L0.5 37.5V7.49999L41.75 89.9999Z" fill="#D92632"/>*/}
                    {/*    <path d="M97.9999 112.5L82.9999 97.4999V77.1428L94.2499 89.9999L135.5 7.49999V37.5L97.9999 112.5Z" fill="#D92632"/>*/}
                    {/*</svg>*/}
                    {/*<div className="preLoader__progress">*/}
                    {/*    <div className="preLoader__progress-bar"></div>*/}
                    {/*    <div className="preLoader__progress-barValue"></div>*/}
                    {/*    <div className="preLoader__progress-text">*/}
                    {/*        <div className="preLoader__progress-textLeft">Загрузка:</div>*/}
                    {/*        <div className="preLoader__progress-textRight">0%</div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>
    )
}
