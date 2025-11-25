import React from 'react';
import { motion } from 'framer-motion';

function DisplayLink4({ word, userGuess, handleInputChange, feedback, wordIndex }) {
    const wordArray = word.split('');

  // Handle letter box input changes
  const handleLetterChange = (event, index) => {
    handleInputChange(event.target.value, index, wordIndex);
  };

  // Function to determine the feedback for each letter
  const getLetterFeedback = (letter, index) => {
    if (feedback && feedback[index]) {
      const feedbackType = feedback[index];
      switch (feedbackType) {
        case 'correct':
          return { backgroundColor: 'green', color: 'white' };
        case 'wrong-position':
          return { backgroundColor: 'yellow', color: 'black' };
        case 'incorrect':
          return { backgroundColor: 'gray', color: 'white' };
        default:
          return {};
      }
    }
    return {};
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      {/* First letter always visible */}
      <span style={{ fontSize: '20px', marginRight: '10px' }}>{wordArray[0]}</span>

      {(
        <div
          className="letter-boxes"
          style={{display: 'inline-flex', alignItems: 'center' }}
        >
          {wordArray.slice(1).map((letter, index) => (
            <input
            type="text"
            maxLength="1"
            value={userGuess[index] || ''}
            onChange={(e) => handleLetterChange(e, index)}
            style={{
                width: '40px',
                height: '40px',
                textAlign: 'center',
                margin: '5px',
                fontSize: '18px',
                textTransform: 'uppercase',
                border: '2px solid #ccc',
                borderRadius: '5px',
                backgroundColor: getLetterFeedback(letter, index).backgroundColor || '#fff',
                color: getLetterFeedback(letter, index).color || 'black',
                }}
            autoFocus={index === userGuess.length} // Auto-focus next input
            readOnly={feedback.length > 0} // Lock inputs after feedback
              />
          ))}
        </div>
      )}
    </div>
  );
}

export default DisplayLink4;
