import React, {useRef, useEffect} from 'react';
import { motion } from 'framer-motion';

function DisplayLink({ word, userGuess, handleInputChange, feedback, wordIndex, rowIndex, handleKeyPress, locked, isActiveRow }) {
    const wordArray = word.split('');
    const inputRefs = useRef([]);

    useEffect(() => {
      console.log('Trying to focus input in row:', wordIndex);
      if (inputRefs.current[0] && isActiveRow && !locked) {
        inputRefs.current[0].focus();
      }
    }, [wordIndex, isActiveRow, locked]);

  // Handle letter box input changes
  const handleLetterChange = (event, index) => {
    if (!event || !event.target) {
      console.error("Event or event.target is undefined!", { event });
      return;
    }  
    const value = event.target.value;  
    handleInputChange(value, index, rowIndex);
  
    // Move to next input if not last
    if (value && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
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
            onKeyDown={handleKeyPress}
            style={{
                width: '40px',
                height: '40px',
                textAlign: 'center',
                margin: '5px',
                fontSize: '18px',
                textTransform: 'lowercase',
                border: '2px solid #ccc',
                borderRadius: '5px',
                backgroundColor: getLetterFeedback(letter, index).backgroundColor || '#fff',
                color: getLetterFeedback(letter, index).color || 'black',
                }}
            autoFocus={false} // Auto-focus next input
            ref={(el) => inputRefs.current[index] = el}
            readOnly={locked} // Lock inputs after feedback
              />
          ))}
        </div>
      )}
    </div>
  );
}

export default DisplayLink;
