import React from "react";
import EuText from "../components/base/EuText";
import { Footer } from "../components/base/Footer";
import { Header } from "../components/base/Header";
import RuText from "../components/base/RuText";
import { __ } from "../multilang/Multilang";

const Contact = () => {
    return (
        <div className="shop__page header-padding full-height">
            <Header borderBottom={ true }/>
            <div className="shop pt64 pb104">
                <div className="container">
                    <h1 className="shop__header mb12">{ __( "Контакты" ) }</h1>
                    <p className="text">
                        <RuText>
                            Почта - Playtowin.bc@gmail.com<br/>
                            Дворцов Антон Николаевич<br/>
                            ИНН - 631109932425
                        </RuText>
                        <EuText>
                            Email - Playtowin.bc@gmail.com<br/>
                            Дворцов Антон Николаевич<br/>
                            INN - 631109932425
                        </EuText>
                    </p>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default Contact;
