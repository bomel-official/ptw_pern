import React, {useState} from 'react';
import {Header} from "../components/base/Header";
import {Footer} from "../components/base/Footer";
import {__} from "../multilang/Multilang";
import ProductImage from "../static/images/product.jpg"

const cats = [
    'COD CP',
    'PS Plus'
]

const ShopPage = () => {
    const [currentCategory, setCurrentCategory] = useState('COD CP')
    return (
        <div className="shop__page header-padding full-height">
            <Header borderBottom={true}/>
            <div className="shop pt64 pb104">
                <div className="container">
                    <h1 className="shop__header mb12">{__("Магазин")}</h1>
                    <h2 className="shop__subheading mb24">{__("Lorem ipsum dolor sit amet consectetur. Leo viverra donec purus in neque facilisi dictum nisl eget.")}</h2>
                    <div className="side__tab-headings">
                        { cats.map((cat, index) => (
                            <button
                                key={index}
                                className={currentCategory === cat ? "side__tab-heading active": "side__tab-heading"}
                                onClick={() => setCurrentCategory(cat)}
                            >
                                {__(cat)}
                            </button>
                        )) }
                    </div>
                    <ul className="shop__products pt24">
                        <li className="shop__product">
                            <img src={ProductImage} alt="" className="shop__product-img"/>
                            <div className="shop__product-right">
                                <h3 className="shop__product-title mb12">{__("1100 COD points")}</h3>
                                <h4 className="shop__product-description mb24">{__("Описание товара")}</h4>
                                <button className="button-both-accent corner-margin"><span>{__("купить за")} 1099₽</span></button>
                            </div>
                        </li>
                        <li className="shop__product">
                            <img src={ProductImage} alt="" className="shop__product-img"/>
                            <div className="shop__product-right">
                                <h3 className="shop__product-title mb12">{__("1100 COD points")}</h3>
                                <h4 className="shop__product-description mb24">{__("Описание товара")}</h4>
                                <button className="button-both-accent corner-margin"><span>{__("купить за")} 1099₽</span></button>
                            </div>
                        </li>
                        <li className="shop__product">
                            <img src={ProductImage} alt="" className="shop__product-img"/>
                            <div className="shop__product-right">
                                <h3 className="shop__product-title mb12">{__("1100 COD points")}</h3>
                                <h4 className="shop__product-description mb24">{__("Описание товара")}</h4>
                                <button className="button-both-accent corner-margin"><span>{__("купить за")} 1099₽</span></button>
                            </div>
                        </li>
                        <li className="shop__product">
                            <img src={ProductImage} alt="" className="shop__product-img"/>
                            <div className="shop__product-right">
                                <h3 className="shop__product-title mb12">{__("1100 COD points")}</h3>
                                <h4 className="shop__product-description mb24">{__("Описание товара")}</h4>
                                <button className="button-both-accent corner-margin"><span>{__("купить за")} 1099₽</span></button>
                            </div>
                        </li>
                        <li className="shop__product">
                            <img src={ProductImage} alt="" className="shop__product-img"/>
                            <div className="shop__product-right">
                                <h3 className="shop__product-title mb12">{__("1100 COD points")}</h3>
                                <h4 className="shop__product-description mb24">{__("Описание товара")}</h4>
                                <button className="button-both-accent corner-margin"><span>{__("купить за")} 1099₽</span></button>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <Footer/>
        </div>
    )
};

export default ShopPage;