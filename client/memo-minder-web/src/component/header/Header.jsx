import React, { useEffect, useState } from 'react';
import "./Header.css";

const defaultProducts = [
  { id: 'stick', name: 'Stick', price: 15, imgSrc: '/stick.png', soldSrc: '/stick.png' },
  { id: 'sword', name: 'Sword', price: 30, imgSrc: '/sword.png', soldSrc: '/sword.png' },
  { id: 'magicBook', name: 'MagicBook', price: 40, imgSrc: '/book.png', soldSrc: '/book.png' },
];

const Header = ({ health, experience, level, products = defaultProducts }) => {
    const [boughtProducts, setBoughtProducts] = useState([]);

    useEffect(() => {
        // update state
        const updateBoughtProducts = () => {
            const boughtItems = JSON.parse(localStorage.getItem('boughtItems') || '{}');
            const updatedBoughtProducts = products.filter(product => boughtItems[product.id]);
            setBoughtProducts(updatedBoughtProducts);
        };

        // get bought products
        updateBoughtProducts();

        const handleLocalStorageChange = () => {
            updateBoughtProducts();
        };

        window.addEventListener('localStorageChanged', handleLocalStorageChange);

        return () => {
            window.removeEventListener('localStorageChanged', handleLocalStorageChange);
        };
    }, [products]); 

    return(
        <div className="header">
            <div className="user-character">
                <img className="user-character-pic" src="/user-pic.JPG" alt=""/>
            </div>
            <div className="user-character-info">
                <div className="username">Ray</div>
                <div className="user-data">
                    <div className="health">
                        <img src="/heart.png" alt=""/>
                        <div className="health-bar">
                            <div className="health-level" style={{ width: `${health}%` }}></div>
                        </div>
                        <span>{health}/100</span>
                    </div>
                    <div className="level">
                        <img src="/star.png" alt=""/>
                        <div className="level-bar">
                            <div className="level-level" style={{ width: `${experience}%` }}></div>
                        </div>
                        <span>Level {level}: {experience}/100</span>
                    </div>
                </div>
            </div>
            <div className="bought-items-images">
                {boughtProducts.map(product => (
                    <img key={product.id} src={product.soldSrc} alt={product.name} title={`Bought: ${product.name}`} />
                ))}
            </div>
        </div>
    );
};

export default Header;
