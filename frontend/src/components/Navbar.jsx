import "../App.css";
import "../styles/Navbar.css";
function Navbar() {
  return (
    <>
      {/* Navigation Menu */}
      <nav className='navigation-menu'>
        <h1 className='logo'>Detect Anything</h1>
        <ul className='nav-links'>
          <a href='#usage'>
            <li className='home'>Usage</li>
          </a>
          <a>
            <li className='about'>Github</li>
          </a>
        </ul>
      </nav>
    </>
  );
}
export default Navbar;
