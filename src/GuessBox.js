/*import React, { useState } from 'react';

function GuessBox() {
  // State to store the current value of the guess box
  const [guessValue, setGuessValue] = useState('');

  // Event handler for guess change
  const handleGuessChange = (event) => {
    setGuessValue(event.target.value);  // Update state with the typed value
  };

  return (
    <div>
      <h2>Enter guess here</h2>


      <input 
        type="text"          // Specifies the guess type as text
        value={guessValue}   // Controlled guess: value is controlled by React state
        onChange={handleGuessChange}  // Event handler for guess change
        placeholder="Type something..."  // Optional placeholder text
      />
      <p>You typed: {guessValue}</p>   {/* Display the current value of guess }
    </div>
  );
}

export default GuessBox;
*/

import React from 'react';

function GuessBox({ userGuess, setUserGuess, handleSubmit }) {
  // Handle user input change
  const handleGuessChange = (event) => {
    setUserGuess(event.target.value);  // Update the guess in the parent component
  };

  // Handle submission of the guess (e.g., when Enter is pressed)
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();  // Trigger the submit logic when Enter is pressed
    }
  };

  return (
    <div>
      <h2>Enter your guess</h2>
      
      {/* Input field for the user to type their guess */}
      <input
        type="text"
        value={userGuess}
        onChange={handleGuessChange} // Update state as user types
        onKeyPress={handleKeyPress}  // Submit guess when Enter is pressed
        placeholder="Type your guess here"
      />
      
      {/* Button to manually submit the guess (optional) */}
      <button onClick={handleSubmit}>Submit Guess</button>
    </div>
  );
}

export default GuessBox;
