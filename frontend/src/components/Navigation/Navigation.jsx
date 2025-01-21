import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';


function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const navigate = useNavigate();


  return (
    <ul>
      <li>
        <NavLink to="/"><img className= 'Logo' src='/images/Logo.png'></img></NavLink>
      </li>
      {isLoaded && (
        <div className="nav-right">
          {sessionUser && (
            <li>
              <button 
                onClick={() => navigate('/spots/new')}
                className="create-spot-button"
              >
                Create a New Spot
              </button>
            </li>
          )}
          <li>
            <ProfileButton user={sessionUser} />
          </li>
        </div>
      )}
    </ul>
  );
}

export default Navigation;