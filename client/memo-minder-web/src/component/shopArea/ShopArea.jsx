import React from 'react';
import './ShopArea.css';


const ShopArea = () => {
  return (
    <div className="shop-page">
      <div className="background-image"></div>
      <div className="product-container">
        {/*--Products start--*/}
        <div className="product">
            {/*stick*/}
            <img src="/stick.png" alt=""/>
            <div className="product-info">
                <h3>Stick</h3>
                <p>15 coins</p>
                <button>Buy</button>
            </div>
        </div>
        <div className="product">
            {/*sword*/}
            <img src="/sword.png" alt=""/>
            <div className="product-info">
                <h3>Sword</h3>
                <p>30 coins</p>
                <button>Buy</button>
             </div>
        </div>
        <div className="product">
            {/*book*/}
            <img src="/book.png" alt=""/>
            <div className="product-info">
                <h3>MagicBook</h3>
                <p>40 coins</p>
                <button>Buy</button>
            </div>
        </div>
           {/*--Products end--*/}
      </div>
    </div>
  );
};

export default ShopArea;
