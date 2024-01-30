import "./NavBar.css"

function Navbar(){
    return(
        <nav>
            <div class="nav-left">
                <a className="logo" href="index.html">MEMO MINDER LOGO</a>
            </div>
            <div class="nav-middle">
                <a href="">占位4</a>
            </div>
            <div class="nav-right">
                <a href="">占位1</a>
                <a href="">占位2</a>
                <a href="">占位3</a>
            </div>
        </nav>
    )
}

export default Navbar;