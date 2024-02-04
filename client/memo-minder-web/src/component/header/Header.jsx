import "./Header.css"

const Header = () =>{
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
                            <div className="health-level"></div>
                        </div>
                    </div>
                    <div className="level">
                        <img src="/star.png" alt=""/>
                        <div className="level-bar">
                            <div className="level-level"></div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}
export default Header;