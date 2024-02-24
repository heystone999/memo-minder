import React from 'react';
import "./Header.css"

const Header = ({health, experience, level}) =>{
    
    return(
        <div className="header">
            <div className="user-character">
                <img className="user-character-pic" src="/user-pic.JPG" alt=""/>
            </div>
            <div className="user-character-info">
                <div className="username">Ray</div>
                <div className="user-data">
                    {/* health bar */}
                    <div className="health">
                        <img src="/heart.png" alt=""/>
                        <div className="health-bar">
                            <div className="health-level" style={{ width: `${health}%` }}></div>
                        </div>
                        <span>{health}/100</span>
                    </div>
                    {/* level bar */}
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
    )
}
export default Header;