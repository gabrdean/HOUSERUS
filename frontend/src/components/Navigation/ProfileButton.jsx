import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import { useNavigate } from 'react-router-dom';
import './Navigation.css'

function ProfileButton({ user }) {
  // Initialize hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ulRef = useRef();
  
  // Local state for dropdown menu visibility
  const [showMenu, setShowMenu] = useState(false);

  // Event handler for menu button click
  const toggleMenu = (e) => {
    e.stopPropagation(); // Prevent event from reaching document click handler
    setShowMenu(!showMenu);
  };

  // Handle closing menu when clicking outside
  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current?.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  // Menu state management
  const closeMenu = () => setShowMenu(false);

  // Navigation handlers
  const handleNavigation = {
    // Logout handler: dispatches logout action and redirects to home
    logout: (e) => {
      e.preventDefault();
      dispatch(sessionActions.logout());
      closeMenu();
      navigate('/');
    },
    
    // Manage spots handler: navigates to user's spots management page
    manageSpots: (e) => {
      e.preventDefault();
      closeMenu();
      navigate('/current');
    }
  };

  // Dynamic class name for dropdown menu visibility
  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  // Render authentication modals for non-authenticated users
  const AuthButtons = () => (
    <>
      <li>
        <OpenModalButton
          buttonText="Sign Up"
          onButtonClick={closeMenu}
          modalComponent={<SignupFormModal />}
        />
      </li>
      <li>
        <OpenModalButton
          buttonText="Log In"
          onButtonClick={closeMenu}
          modalComponent={<LoginFormModal />}
        />
      </li>
    </>
  );

  // Render user menu for authenticated users
  const UserMenu = () => (
    <>
      <li>Hello, {user.firstName}</li>
      <li>{user.email}</li>
      <li>
        <button onClick={handleNavigation.logout}>Log Out</button>
      </li>
      <li>
        <button onClick={handleNavigation.manageSpots}>Manage Spots</button>
      </li>
    </>
  );

  return (
    <>
      {/* Profile button with conditional icon rendering */}
      <button className='profile-button' onClick={toggleMenu}>
        {user ? (
          <>
            <FaBars className='icons' />
            <FaUserCircle className='icons' />
          </>
        ) : (
          <FaBars className='icons' />
        )}
      </button>

      {/* Dropdown menu */}
      <ul className={ulClassName} ref={ulRef}>
        {user ? <UserMenu /> : <AuthButtons />}
      </ul>
    </>
  );
}

export default ProfileButton;