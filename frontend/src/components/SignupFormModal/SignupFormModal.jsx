import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

    // ... your existing state declarations ...
  
    // Add validation checks
    const isFormValid = () => {
      // Check if all fields have values
      const fieldsNotEmpty = email.length > 0 && 
                            username.length > 0 && 
                            firstName.length > 0 && 
                            lastName.length > 0 && 
                            password.length > 0 && 
                            confirmPassword.length > 0;
  
      // Check for minimum lengths (you can adjust these requirements)
      const validUsername = username.length >= 4;
      const validPassword = password.length >= 6;
  
      // Check if there are no errors
      //const noErrors = Object.keys(errors).length === 0;
  
      // Return true only if all conditions are met
      return fieldsNotEmpty && 
             validUsername && 
             validPassword;
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (password === confirmPassword) {
        setErrors({});
        return dispatch(
          sessionActions.signup({
            email,
            username,
            firstName,
            lastName,
            password
          })
        )
          .then(closeModal)
          .catch(async (error) => {
            // The errors are now directly available
            if (error.errors) {
              setErrors(error.errors);
            }
          });
      }
      return setErrors({
        confirmPassword: "Confirm Password field must be the same as the Password field"
      });
    };

  return (
    <>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
      <label>
            <input
              type="text"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
      </label>
      {errors.email && <p>{errors.email}</p>}
      <label>
          <input
            type="text"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
      </label>
      {errors.username && <p>{errors.username}</p>}
      <label>
          <input
            type="text"
            value={firstName}
            placeholder="First Name"
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
      </label>
      {errors.firstName && <p>{errors.firstName}</p>}
      <label>
          <input
            type="text"
            value={lastName}
            placeholder="Last Name"
            onChange={(e) => setLastName(e.target.value)}
            required
          />
      </label>
      {errors.lastName && <p>{errors.lastName}</p>}
      <label>
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
      </label>
      {errors.password && <p>{errors.password}</p>}
      <label>
          <input
            type="password"
            value={confirmPassword}
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
      </label>
          {errors.confirmPassword && (
          <p>{errors.confirmPassword}</p>
          )}
           <button 
          type="submit"
          disabled={!isFormValid()}
          className="form-button"
        >
          Sign Up
        </button>
      </form>
    </>
  );
}

export default SignupFormModal;