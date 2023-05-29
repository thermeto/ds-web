import React, { FC, useState, useEffect } from "react";
import "./Main.css";
import { Link } from 'react-router-dom';
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
                            <Link to="/create-delivery">
                                <img src={shipSignImage} alt="Your description" className="ship-sign" />
                            </Link>
                            <img src={driveSignImage} alt="Your description" className="drive-sign" />
                        </div>
                    </div>
                </div>
                <div className="presentation-container">
                    <div className="presentation-point">
                        <div className="point-header">
                            <img src={shipmentIcon} alt="Icon description" className="point-icon" />
                            <h2 className="point-title">Dispatch your <span className={isChanging ? 'flash' : 'appeared'}>{currentText}</span> shipment order</h2>
                        </div>
                        <p className="point-descr">Travel-savvy drivers en-route to your destination will take up the task of delivering it directly to the recipient - all within the same day. Enjoy the cost-effectiveness with no charges for round-trip overheads.</p>
                    </div>
                    <div className="presentation-point">
                        <div className="point-header">
                            <img src={routeIcon} alt="Icon description" className="point-icon" />
                            <h2 className="point-title">Share your planned journey with us</h2>
                        </div>
                        <p className="point-descr">We will recommend items you can conveniently pick up and deliver on your way. Experience an effortless extension to your existing trip with minimal additions to distance and time.</p>
                    </div>
                    <div className="presentation-point">
                        <div className="point-header">
                            <img src={calmIcon} alt="Icon description" className="point-icon" />
                            <h2 className="point-title">Enjoy peace of mind</h2>
                        </div>
                        <p className="point-descr">As a sender, keep track of your shipment in real-time and maintain open communication with the driver.</p>
                        <p className="point-descr">For our drivers, we assure complete transparency and safety of packages - because your peace of mind is our top priority.</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Main;
