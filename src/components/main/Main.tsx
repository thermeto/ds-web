import React, { FC, useState, useEffect } from "react";
import "./Main.css";
import Header from '../header/Header';
import hitchhikerImage from './resources/home_hitchhiker.png';
import shipSignImage from './resources/ship_sign.png';
import driveSignImage from './resources/drive_sign.png';
import shipmentIcon from './resources/ship.png';
import calmIcon from './resources/calm.png';
import routeIcon from './resources/route.png';

const Main: FC = () => {
    const [isChanging, setIsChanging] = useState(false);
    const [currentText, setCurrentText] = useState('Mom\'s jars');
    const texts = ['Mom\'s jars', 'Father\'s tools', 'sealed docs', 'warm boots', 'Berdichevske beer', 'warm clothes', 'Kherson\'s watermelon', 'Lviv\'s coffee'];

    useEffect(() => {
        const timer = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * texts.length);
            setCurrentText(texts[randomIndex]);
        }, 3000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * texts.length);
            setCurrentText(texts[randomIndex]);
            setIsChanging(true);

            setTimeout(() => {
                setIsChanging(false);
            }, 1000);
        }, 3000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <>
            <Header />
            <div className="main-container">
                <div className="image-text-container">
                    <div className="image-overlay-container">
                        <img src={hitchhikerImage} alt="Your description" className="image" />
                        <div className="overlay-text">
                            <h2>Hitchhike stuff !</h2>
                        </div>
                        <div className="overlay-sign">
                            <img src={shipSignImage} alt="Your description" className="ship-sign" />
                            <img src={driveSignImage} alt="Your description" className="drive-sign" />
                        </div>
                    </div>
                </div>
                <div className="presentation-container">
                    <div className="presentation-point">
                        <div className="point-header">
                            <img src={shipmentIcon} alt="Icon description" className="point-icon" />
                            <h2 className="point-title">Post your <span className={isChanging ? 'flash' : 'appeared'}>{currentText}</span> shipment order</h2>
                        </div>
                        <p className="point-descr">Drivers heading in the same direction will pick it up and deliver it directly to the recipient. Same day. No round-trip price overhead.</p>
                    </div>
                    <div className="presentation-point">
                        <div className="point-header">
                            <img src={routeIcon} alt="Icon description" className="point-icon" />
                            <h2 className="point-title">Post your driving route</h2>
                        </div>
                        <p className="point-descr">We will suggest stuff that you can easily pick up and drop on your way. With minimal distance and time extension to existing trip.</p>
                    </div>
                    <div className="presentation-point">
                        <div className="point-header">
                            <img src={calmIcon} alt="Icon description" className="point-icon" />
                            <h2 className="point-title">Enjoy peace of mind</h2>
                        </div>
                        <p className="point-descr">As a sender, track your shipment progress, communicate with driver at any moment.</p>
                        <p className="point-descr">As a driver, we guarantee package transparency and safety.</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Main;
