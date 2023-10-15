import {NavLink} from "react-router-dom";

export const LoginWith = () => {
    return (
        <div className="auth__social flex pt12">
            <NavLink to={"discord"} className="auth__dsLink">
                <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.109 4.7012C15.0468 4.21378 13.9076 3.85467 12.7166 3.649C12.6949 3.64503 12.6732 3.65495 12.6621 3.67479C12.5156 3.93535 12.3533 4.27528 12.2396 4.54246C10.9586 4.35068 9.68416 4.35068 8.42939 4.54246C8.31573 4.26934 8.14756 3.93535 8.0004 3.67479C7.98923 3.65561 7.96756 3.64569 7.94587 3.649C6.75549 3.85401 5.61636 4.21312 4.55343 4.7012C4.54423 4.70516 4.53634 4.71178 4.5311 4.72038C2.37041 7.9484 1.77851 11.0971 2.06888 14.2067C2.07019 14.2219 2.07873 14.2365 2.09055 14.2458C3.51612 15.2927 4.89702 15.9282 6.25228 16.3495C6.27397 16.3561 6.29695 16.3482 6.31075 16.3303C6.63134 15.8925 6.91711 15.4309 7.16214 14.9454C7.1766 14.917 7.16279 14.8833 7.13324 14.872C6.67995 14.7001 6.24833 14.4904 5.83315 14.2524C5.80031 14.2332 5.79768 14.1862 5.82789 14.1637C5.91526 14.0983 6.00265 14.0301 6.08608 13.9614C6.10117 13.9488 6.12221 13.9462 6.13995 13.9541C8.86756 15.1994 11.8205 15.1994 14.5159 13.9541C14.5337 13.9455 14.5547 13.9481 14.5705 13.9607C14.6539 14.0295 14.7413 14.0983 14.8293 14.1637C14.8595 14.1862 14.8576 14.2332 14.8247 14.2524C14.4095 14.4951 13.9779 14.7001 13.524 14.8714C13.4944 14.8826 13.4813 14.917 13.4957 14.9454C13.746 15.4302 14.0318 15.8918 14.3465 16.3296C14.3596 16.3482 14.3832 16.3561 14.4049 16.3495C15.7668 15.9282 17.1477 15.2927 18.5732 14.2458C18.5857 14.2365 18.5936 14.2226 18.5949 14.2074C18.9424 10.6123 18.0128 7.48944 16.1307 4.72103C16.1261 4.71178 16.1182 4.70516 16.109 4.7012ZM7.56946 12.3133C6.74826 12.3133 6.07162 11.5594 6.07162 10.6335C6.07162 9.70758 6.73514 8.95366 7.56946 8.95366C8.41033 8.95366 9.08042 9.7142 9.06728 10.6335C9.06728 11.5594 8.40376 12.3133 7.56946 12.3133ZM13.1075 12.3133C12.2863 12.3133 11.6096 11.5594 11.6096 10.6335C11.6096 9.70758 12.2731 8.95366 13.1075 8.95366C13.9484 8.95366 14.6184 9.7142 14.6053 10.6335C14.6053 11.5594 13.9484 12.3133 13.1075 12.3133Z" fill="#6363E9"/>
                </svg>
                <span>Discord</span>
            </NavLink>
            <NavLink to={"google"} className="auth__ggLink">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.5483 6.98181C11.8574 6.3212 10.9786 5.98483 9.99978 5.98483C8.26372 5.98483 6.79422 7.15716 6.26974 8.73251C6.13641 9.13251 6.06065 9.56055 6.06065 9.99995C6.06065 10.4393 6.13641 10.8666 6.26974 11.2666C6.79403 12.8423 8.26346 14.0152 9.99978 14.0152C10.8968 14.0152 11.6604 13.7788 12.2574 13.3788C12.9634 12.9061 13.4334 12.1999 13.5879 11.3666H10V8.78782H16.2788C16.3576 9.22419 16.4001 9.67873 16.4001 10.1515C16.4001 12.1818 15.6728 13.8909 14.4122 15.0515C13.3091 16.0697 11.7998 16.6667 9.99978 16.6667C7.39372 16.6667 5.13917 15.1727 4.0422 12.9939C3.59085 12.0941 3.33337 11.0755 3.33337 9.99995C3.33337 8.92426 3.59092 7.90614 4.04237 7.00619C5.13935 4.82739 7.39372 3.33331 9.99978 3.33331C11.7968 3.33331 13.3059 3.99392 14.4604 5.06968L12.5483 6.98181Z" fill="#4285F4"/>
                </svg>
                <span>Google</span>
            </NavLink>
            <NavLink to={"twitch"} className="auth__twLink">
                <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.99999 1.66669L3.0238 4.64288V15.3572H6.59523V18.3334L9.57142 15.3572H11.9524L17.3095 10V1.66669H5.99999ZM16.119 9.40478L13.7381 11.7857H11.3571L9.2738 13.8691V11.7857H6.59523V2.85716H16.119V9.40478Z" fill="#9146FF"/>
                    <path d="M14.3333 4.9405H13.1429V8.51193H14.3333V4.9405Z" fill="#9146FF"/>
                    <path d="M11.0595 4.9405H9.86904V8.51193H11.0595V4.9405Z" fill="#9146FF"/>
                </svg>
                <span>Twitch</span>
            </NavLink>
        </div>
    )
}