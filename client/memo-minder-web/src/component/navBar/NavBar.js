import { Link } from "react-router-dom";
import "./NavBar.css"
import React, {useState} from "react";


function Navbar(){

    const [open, setOpen] = useState(false);

    return(
        <nav>
            <div class="nav-left">
                <Link class="logo" to="/"><span>MEMO MINDER</span></Link>
                <Link to="/"><span>Tasks</span></Link>
                <Link to="/"><span>Shops</span></Link>
                <Link to="/"><span>Party</span></Link>
                <Link to="/"><span>Group</span></Link>
                <Link to="/"><span>Challenges</span></Link>
                <Link to="/"><span>Help</span></Link>
            </div>
            <div class="nav-middle"></div>
            <div class="nav-right">
                <div className="user">
                    <img className="user-pic" src="/user-pic.JPG" alt="" onClick={()=>{setOpen(!open)}}/>
                    <span className="user-name">Ray</span>
                </div>
            </div>
            {/* User dropdown menu */}
            <div className={`user-menu ${open? 'active' : 'inactive'}`}>
                <ul>
                    <UserMenu text = {"Log Out"}/>
                </ul>
            </div>
        </nav>
    )
}

function UserMenu(props){
    return(
        <li className="user-menu-item">
            <a> {props.text} </a>
        </li>
    );
}

export default Navbar;