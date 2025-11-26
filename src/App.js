
import React, { useState, useEffect } from 'react';
import {motion} from 'framer-motion';
import './App.css';
import GivenLink from './GivenLink';
import DisplayLink from './DisplayLink';
import RulesBanner from './RulesBanner';

import { words } from './words'; // Assuming this contains the words for each day

function App() {
  const [userGuess, setUserGuess] = useState(Array(6).fill([]));
  const [feedback, setFeedback] = useState(Array(6).fill([]));
  const [currentGuessIndex, setCurrentGuessIndex] = useState(0); // Start with word2 (index 1)
  const [currentDate, setCurrentDate] = useState('');
  const [currentWord, setCurrentWord] = useState({}); // Store the words for today
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [incorrectGuess, setIncorrectGuess] = useState(false);
  const [lockedRows, setLockedRows] = useState(Array(6).fill(false));
  
  const [activeRowIndex, setActiveRowIndex] = useState(0);



  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    // Fetch today's words based on the date (or from a static list of words)
    const wordForToday = words.find((entry) => entry.date === today);
    setCurrentWord(wordForToday || {}); // Store today's words
  }, []);


  // Handle input change for each word's letter boxes
  const handleInputChange = (value, letterIndex, rowIndex) => {
    const newGuess = [...userGuess];
    newGuess[rowIndex] = [...(newGuess[rowIndex] || [])];
    newGuess[rowIndex][letterIndex] = value.toLowerCase();
    setUserGuess(newGuess);
  };

  // Check the user's guess and provide feedback after pressing Enter
  const checkGuess = () => {
    const fullWord = currentWord[`word${currentGuessIndex + 2}`];
    if (!fullWord) return;
  
    const target = fullWord.toLowerCase();
    const guessLetters = userGuess[currentGuessIndex] || [];
    const guess = guessLetters.join('').toLowerCase();
    const wordToGuess = target.slice(1); // exclude first letter
  
    const guessLength = wordToGuess.length;
    const feedbackResult = Array(guessLength).fill(''); // 'correct', 'wrong-position', 'incorrect'
  
    const letterCounts = {};
  
    // Count frequencies of letters in the actual word (excluding the first letter)
    for (let letter of wordToGuess) {
      letterCounts[letter] = (letterCounts[letter] || 0) + 1;
    }
  
    // First pass — mark correct positions
    for (let i = 0; i < guessLength; i++) {
      if (guess[i] === wordToGuess[i]) {
        feedbackResult[i] = 'correct';
        letterCounts[guess[i]]--; // use up that letter
      }
    }
  
    // Second pass — mark wrong positions
    for (let i = 0; i < guessLength; i++) {
      if (feedbackResult[i] === '') {
        if (letterCounts[guess[i]] > 0) {
          feedbackResult[i] = 'wrong-position';
          letterCounts[guess[i]]--;
        } else {
          feedbackResult[i] = 'incorrect';
        }
      }
    }
  
    // Update feedback state
    const newFeedbackArray = [...feedback];
    newFeedbackArray[currentGuessIndex] = feedbackResult;
    setFeedback(newFeedbackArray);
  
    if (guess === wordToGuess) {
      const newLocked = [...lockedRows];
      newLocked[currentGuessIndex] = true;
      setLockedRows(newLocked);
  
      if (currentGuessIndex < 6) {
        setCurrentGuessIndex(prev => prev + 1);
      } else {
        setGameOver(true);
      }
    } else {
      setLives(prev => {
        //lives = lives -1;
        const newLives = prev - 1;
        if (newLives <= 0) {
          setGameOver(true);
          return;
        }
        return newLives;
      });
    }
    setActiveRowIndex(prev => prev + 1);
  };

  // Handle the Enter key press for submission
  const handleKeyPress = (event) => {
    if (event.key !== 'Enter') return;
  
    const currentGuess = userGuess[currentGuessIndex] || [];
    const fullWord = currentWord[`word${currentGuessIndex + 2}`];
    if (!fullWord) {
      return;
    }
    const expectedGuessLength = fullWord.length - 1; // excluding first letter
    const guessReady = currentGuess.length === expectedGuessLength && currentGuess.every((letter) => typeof letter === 'string' && letter.trim() !== '');
    if (guessReady) {
      checkGuess();
    } else {
      console.log("Guess incomplete. Not checking.");
    }
  };

  const resetGame = () => {
    setLives(3);
    setCurrentGuessIndex(0);
    setGameOver(false);
    setFeedback(Array(6).fill([])); // Reset feedback
    setUserGuess(Array(6).fill([])); // Reset guesses
  };

  return (
    <div className="App">
      {/* 1. Add the RulesBanner component here */}
      <RulesBanner title="Game Rules 🔗">
          <p>You are given the first word to a chain and the first letter of each of the words in the chain</p>
          <p>You need to guess which word comes next in the chain</p>
          <p>Each pair of words make a well known phrase, e.g. holiday home town</p>
          <p>Where "holiday home" and "home town" both are phrases</p>
          <p>The letters will go green if they are correct,</p>
          <p>yellow if that word contains that letter but in a different place,</p>
          <p>or grey if that word does not contain that letter</p>
      </RulesBanner>
      <h1>Chain Link Game</h1>
      <p>Lives: {lives}</p>
      <p>Guess Word {currentGuessIndex} of 5</p>

      <GivenLink/>
      {/* Render all 5 words, each with a DisplayLink */}
      {[0, 1, 2, 3, 4].map((rowIdx) => {
        const wordIndex = rowIdx + 2;
        return (
          <div key={wordIndex}>
            {currentWord[`word${wordIndex}`] && (
              <DisplayLink
                word={currentWord[`word${wordIndex}`]}
                userGuess={userGuess[rowIdx]}
                handleInputChange={handleInputChange}
                handleKeyPress={handleKeyPress}
                feedback={feedback[rowIdx]}
                wordIndex={wordIndex}
                rowIndex={rowIdx}
                locked={lockedRows[rowIdx]}
                isActiveRow={rowIdx === currentGuessIndex}
              />
            )}
          </div>
        );
      })}

    <div>
      {gameOver && (
          <button onClick={resetGame}>Try Again</button>
      )}
    </div>
    <p>Press Enter to Submit your Guess</p>
  </div>
  );
}


export default App;
