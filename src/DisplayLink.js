import React, {useRef, useEffect} from 'react';
import { motion } from 'framer-motion';

function DisplayLink({ 
    word, 
    userGuess, 
    handleInputChange, 
    feedback, 
    wordIndex, 
    rowIndex, 
    handleKeyPress, 
    locked, 
    isActiveRow, 
    isGameOver 
}) {
    // Note: wordArray[0] is the first (given) letter. wordArray.slice(1) are the guessable letters.
    const wordArray = word.split(''); 
    const targetWordLetters = wordArray.slice(1); // The letters the user is guessing
    const inputRefs = useRef([]);

    useEffect(() => {
      // Focus the first input of the active, unlocked row
      if (inputRefs.current[0] && isActiveRow && !locked && !isGameOver) {
        inputRefs.current[0].focus();
      }
    }, [wordIndex, isActiveRow, locked, isGameOver]);

    // Handle letter box input changes
    const handleLetterChange = (event, index) => {
        if (!event || !event.target) {
            console.error("Event or event.target is undefined!", { event });
            return;
        }  
        const value = event.target.value;  
        handleInputChange(value, index, rowIndex);
      
        // Move to next input if a value was entered and it's not the last box
        if (value && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };

    // Function to determine the style and state for each letter
    const getLetterFeedback = (index) => {
        if (!feedback || !feedback[index]) {
            return { style: {}, isHint: false };
        }

        const feedbackType = feedback[index];
        
        switch (feedbackType) {
            case 'correct':
                // Letters that were correctly entered before a mistake was made
                return { style: { backgroundColor: 'green', color: 'white' }, isHint: false };
            case 'hint':
                // The position of the first mistake
                return { style: { backgroundColor: '#ADD8E6', color: 'black', border: '2px solid #0000FF' }, isHint: true }; // Light Blue/Black for hint
            // No need for 'wrong-position' or 'incorrect' anymore
            default:
                return { style: {}, isHint: false };
        }
    };

    return (
        <div 
            style={{ 
                display: 'flex',
                alignItems: 'center',
                marginBottom: '20px',
                justifyContent: 'center'
            }}
            // Add onKeyDown to the container to catch Enter key press even when focus shifts
            onKeyDown={isActiveRow ? handleKeyPress : undefined}
            tabIndex={isActiveRow ? 0 : -1} // Make container focusable when active
        >
            {/* First letter always visible (the link) */}
            <span style={{ fontSize: '20px', marginRight: '10px', alignItems: 'center',justifyContent: 'center'}}>{wordArray[0]}</span>

            <div
                className="letter-boxes"
                style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
            >
                {/* Iterate over the guessable letters */}
                {targetWordLetters.map((correctLetter, index) => {
                    const { style: feedbackStyle, isHint } = getLetterFeedback(index);
                    
                    // 🔑 New Logic for Input Value
                    const boxValue = isHint 
                        ? correctLetter // Display the correct letter when it's a hint
                        : userGuess[index] || ''; // Otherwise, display user input or blank
                    
                    // 🔑 New Logic for ReadOnly
                    const isReadOnly = locked || isGameOver || isHint;

                    return (
                        <input
                            key={index}
                            type="text"
                            maxLength="1"
                            value={boxValue}
                            onChange={(e) => handleLetterChange(e, index)}
                            // We moved handleKeyPress to the parent div
                            style={{
                                width: '40px',
                                height: '40px',
                                textAlign: 'center',
                                margin: '5px',
                                fontSize: '18px',
                                textTransform: 'lowercase',
                                border: '2px solid #ccc',
                                borderRadius: '5px',
                                // Apply the style returned by the feedback function
                                backgroundColor: feedbackStyle.backgroundColor || '#fff',
                                color: feedbackStyle.color || 'black',
                                ...feedbackStyle // Spread any other styles (like border)
                            }}
                            autoFocus={false} 
                            ref={(el) => inputRefs.current[index] = el}
                            // Only allow input if the row is active AND it's not locked/game over AND it's not a hint box
                            readOnly={isReadOnly} 
                            disabled={!isActiveRow} // Visually disable if not active row
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default DisplayLink;