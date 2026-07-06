import React from "react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/base/Footer";
import { Header } from "@/components/base/Header";
import { __ } from "@/multilang/Multilang";

const NotFoundPage = () => (
    <div className="full-height header-padding">
        <Header/>
        <div className="container pt64 pb104" style={ { textAlign: "center" } }>
            <h1 className="mb24" style={ { fontSize: "48px" } }>404</h1>
            <p className="mb24">{ __( "Страница не найдена" ) }</p>
            <Link className="button-both-accent" to="/">{ __( "На главную" ) }</Link>
        </div>
        <Footer/>
    </div>
);

export default NotFoundPage;
