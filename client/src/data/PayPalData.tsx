import React from 'react';
import getPayPalText from "../functions/getPayPalText";

const PayPalData = {
    url: process.env.REACT_APP_PAYPAL_URL || 'https://paypal.me/FilippSkatershchikov?country.x=ES&locale.x=en_US',
    email: process.env.REACT_APP_PAYPAL_EMAIL || 'philipp@skaterschikov.com',
    getText: getPayPalText
};

export default PayPalData;