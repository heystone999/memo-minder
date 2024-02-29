import React, { useEffect, useState } from 'react';
import "./Header.css";

const defaultProducts = [
  { id: 'stick', name: 'Stick', price: 15, imgSrc: '/stick.png', soldSrc: '/stick.png' },
  { id: 'sword', name: 'Sword', price: 30, imgSrc: '/sword.png', soldSrc: '/sword.png' },
  { id: 'magicBook', name: 'MagicBook', price: 40, imgSrc: '/book.png', soldSrc: '/book.png' },
];

const Header = ({ health, experience, level, products = defaultProducts }) => {
    const [boughtProducts, setBoughtProducts] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        // update state
        const updateBoughtProducts = () => {
            const boughtItems = JSON.parse(localStorage.getItem('boughtItems') || '{}');
            const updatedBoughtProducts = products.filter(product => boughtItems[product.id]);
            setBoughtProducts(updatedBoughtProducts);
        };

        // get bought products
        updateBoughtProducts();

        // 尝试从 localStorage 读取保存的选中物品
        const savedSelectedItem = localStorage.getItem('selectedItem');
        if (savedSelectedItem) {
            setSelectedItem(JSON.parse(savedSelectedItem));
        } 
        const handleLocalStorageChange = () => {
            updateBoughtProducts();
        };
        window.addEventListener('localStorageChanged', handleLocalStorageChange);
        return () => {
            window.removeEventListener('localStorageChanged', handleLocalStorageChange);
        };
    }, [products]); 

    const handleItemClick = (product) => {
        setSelectedItem(product);
        localStorage.setItem('selectedItem', JSON.stringify(product));
    };


    return(
        <div className="header">
            {/*-------- User Start --------*/}
            <div className="user">
                <div className="user-character">
                    <img className="user-character-pic" src="/male.png" alt=""/>
                    {/* show if a weaspon is selected, else show nothing*/}
                    {selectedItem ? (
                        <img className="selected-weapon" src={selectedItem.imgSrc} alt={selectedItem.name} />
                    ) : null 
                    }
                </div>
                <div className="user-character-info">
                    <div className="username">Ray</div>
                    <div className="user-data">
                        {/*- Health Bar -*/}
                        <div className="health">
                            <img src="/heart.png" alt=""/>
                            <div className="health-bar">
                                <div className="health-level" style={{ width: `${health}%` }}></div>
                            </div>
                            <span>{health}/100</span>
                        </div>
                        {/*- Level Bar -*/}
                        <div className="level">
                            <img src="/star.png" alt=""/>
                            <div className="level-bar">
                                <div className="level-level" style={{ width: `${experience}%` }}></div>
                            </div>
                            <span>Level {level}: {experience}/100</span>
                        </div>
                    </div>
                </div>
            </div>
            {/*-------- User End --------*/}
            {/*-------- Bag Start --------*/}
            <div className="bag">
                <div className="bag-name">Bag</div>
                <div className="bought-items-images">
                    {boughtProducts.map(product => (
                        <img
                            key={product.id}
                            src={product.soldSrc}
                            alt={product.name}
                            title={`Bought: ${product.name}`}
                            onClick={() => handleItemClick(product)}
                            style={selectedItem && selectedItem.id === product.id ? { backgroundColor: '#f75d5d' } : {}}
                        />
                    ))}
                </div>
            </div>
            
            {/*-------- Bag End --------*/}
        </div>
    );
};

export default Header;
