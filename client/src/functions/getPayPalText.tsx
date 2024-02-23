import React from 'react';
import {__} from "../multilang/Multilang";
import PayPalData from "../data/PayPalData";

const getPayPalText = (amount: number, isWithUrl: boolean = true) => {
    return (<>
        <span>
            {
                __('Чтобы принять участие в турнире вам необходимо перести') + ' ' +
                amount + '€ ' +
                __('на PayPal аккаунт') +
                PayPalData.email + '. ' +
                __('После оплаты напишите любому PTW Administrator в нашем Discord, который онлайн.\nНаш Discord') + ' - '
            }
        </span>
        <a href={process.env.REACT_APP_DISCORD_LINK_URL || 'https://discord.gg/ptw'}>{process.env.REACT_APP_DISCORD_LINK_URL || 'https://discord.gg/ptw'}</a>
        <br/>
        {isWithUrl && <span>
            {
                __('Для оплаты перейдите по ссылке') + ': '
            }
        </span>}
    </>);
};

export default getPayPalText;