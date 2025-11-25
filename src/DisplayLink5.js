/*import React, { useEffect, useState } from 'react';
import { words } from './words';

function DisplayLink5() {

    const [displayLink5, setDisplayLink5] = useState('');

    const currentDate = new Date().toISOString().split('T')[0];


  useEffect(() => {
    const currentWord = words.find((entry)  => entry.date === currentDate)?.word6[0]  ||  'defaultWord';
    setDisplayLink5(currentWord);
  }, [currentDate]);
  return (
    <div>
      <p><strong>{displayLink5}</strong></p>
    </div>
  );
}
export default DisplayLink5;

import React from 'react';
import {motion} from 'framer-motion';

function DisplayLink5({ word, show }) {
    const wordArray = word.split("");

    const letterVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 1 , ease: "easeOut"}},
    };
  
    return (
        <div>
        <p></p>
        <span>
          {word[0]}
        </span>
        {show && (
          <motion.div className="correct-guess"
            initial="hidden"
            animate="visible"
            style={{display: 'inline'}}
            >
              {wordArray.slice(1).map((letter, index) => (
              <motion.span 
                key={index}
                variants={letterVariants}
                style={{display: 'inline' }}
              >
                {letter}
              </motion.span>
              ))}
            </motion.div>
          )}
        </div>
      );
    }

export default DisplayLink5;
*/

import React from 'react';
import {motion} from 'framer-motion';


function DisplayLink5({ word, userGuess, handleInputChange, show, feedback }) {
  const wordArray = word.split("");

  const letterVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 , ease: "easeOut"}},
  };

  const handleLetterChange = (event, index) => {
    handleInputChange(event.target.value, index);
  };
const getLetterFeedback = (letter, index) => {
  if (feedback && feedback[index]) {
    const feedbackType = feedback[index];
    switch (feedbackType) {
      case 'correct':
        return { backgroundColor: 'green', color: 'white' };
      case 'wrong-position':
        return { backgroundColor: 'yellow', color: 'black' };
      case 'incorrect':
        return {backgroundColor: 'gray', color: 'white' };
      
      default:
        return {};
    }
  }
  return {};
}

  return (
    <div style={{ marginBottom: '10px' }}>
      <span>{word[0]}</span>
      {show && (
        <motion.div className="correct-guess"
          initial="hidden"
          animate="visible"
          style={{display: 'inline'}}
          >
            {wordArray.slice(1).map((letter, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              style={{display: 'inline' }}
            >
              <input
                type="text"
                value={userGuess[index] || ''}
                maxLength="1"
                onChange={(e) => handleLetterChange(e, index)}
                style={{
                  width: '30px',
                  height: '30px',
                  textAlign: 'center',
                  border: '2px solid #ddd',
                  margin: '0 2px',
                  fontSize: '16px',
                  textTransform: 'uppercase',
                  backgroundColor: getLetterFeedback(letter, index).backgroundColor || '#fff',
                  color: getLetterFeedback(letter, index).color || 'black',
                  borderRadius: '5px',
                }}
                autoFocus = {index === userGuess.length}
                readOnly = {feedback.length > 0}
              />
            </motion.span>
            ))}
          </motion.div>
        )}
      </div>
    );
  }


export default DisplayLink5;