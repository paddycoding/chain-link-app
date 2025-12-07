
import React, { useState, useEffect } from 'react';
import {motion} from 'framer-motion';
import './App.css';
import GivenLink from './GivenLink';
import DisplayLink from './DisplayLink';
import RulesBanner from './RulesBanner';
import GameOverBanner from './GameOverBanner';

import { words } from './words'; // Assuming this contains the words for each day

const GAME_STORAGE_KEY = 'chainLinkProgress';
const todayDateString = new Date().toDateString();

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
  const [hintPosition, setHintPosition] = useState(-1);
  const [revealedHintIndices, setRevealedHintIndices] = useState([]);
  

  const saveProgress = (
    currentGuess, 
    currentFeedback, 
    currentIndex, 
    currentLives, 
    isOver,
    wordData
  ) => {
    const dataToSave = {
      lastPlayedDate: todayDateString,
      currentProgress: {
        userGuess: currentGuess,
        feedback: currentFeedback,
        currentGuessIndex: currentIndex,
        lives: currentLives,
        gameOver: isOver,
        currentWord: wordData
      }
    };
    localStorage.setItem(GAME_STORAGE_KEY, JSON.stringify(dataToSave));
  };

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    // Fetch today's words based on the date (or from a static list of words)
    const wordForToday = words.find((entry) => entry.date === today);
    setCurrentWord(wordForToday || {}); // Store today's words

    const storedData = localStorage.getItem(GAME_STORAGE_KEY);
    
    if (storedData) {
      const data = JSON.parse(storedData);

      // 🔑 Check if the stored date matches today's date
      if (data.lastPlayedDate === todayDateString) {
        
        // Resume Game: Load all stored progress
        const p = data.currentProgress;
        
        // Only load if the puzzle ID matches (using currentWord as the ID)
        if (JSON.stringify(p.currentWord) === JSON.stringify(wordForToday)) {
            setUserGuess(p.userGuess);
            setFeedback(p.feedback);
            setCurrentGuessIndex(p.currentGuessIndex);
            setLives(p.lives);
            setGameOver(p.gameOver);
            setActiveRowIndex(p.currentGuessIndex);
            console.log("Resuming today's game.");
            return; // Exit the function after loading progress
        }
      }
      
      // If dates don't match, or puzzle IDs don't match, reset
      localStorage.removeItem(GAME_STORAGE_KEY);
    }
  }, []);

  


  // Handle input change for each word's letter boxes
  const handleInputChange = (value, letterIndex, rowIndex) => {
    const newGuess = [...userGuess];
    newGuess[rowIndex] = [...(newGuess[rowIndex] || [])];
    newGuess[rowIndex][letterIndex] = value.toLowerCase();
    setUserGuess(newGuess);
    saveProgress(
      userGuess, 
      feedback, 
      currentGuessIndex, 
      lives, 
      lives <= 0,
      currentWord
    );
  };

  // Check the user's guess and provide feedback after pressing Enter
const checkGuess = () => {
    const fullWord = currentWord[`word${currentGuessIndex + 2}`];
    if (!fullWord) return;
  
    const target = fullWord.toLowerCase();
    const guessLetters = userGuess[currentGuessIndex] || [];
    const wordToGuess = target.slice(1); // exclude first letter
    const guessLength = wordToGuess.length;
    
    // 1. Identify all incorrect indices
    const incorrectIndices = [];
    let isCorrect = true;

    for (let i = 0; i < guessLength; i++) {
        if (guessLetters[i] !== wordToGuess[i]) {
            incorrectIndices.push(i);
            isCorrect = false;
        }
    }
  
    // 2. Core Game Flow
    if (isCorrect) {
        // Correct Guess: Lock row, move to next word, reset hint tracking
        const newLocked = [...lockedRows];
        newLocked[currentGuessIndex] = true;
        setLockedRows(newLocked);
        
        // Advance to the next word
        if (currentGuessIndex < 5) { // Assuming 5 guessable words max
            setCurrentGuessIndex(prev => prev + 1);
            setActiveRowIndex(prev => prev + 1);
        } else {
            setGameOver(true);
        }
        
        // Reset hint state for the new word
        setRevealedHintIndices([]); 

    } else {
        // Incorrect Guess: Deduct life and give ONE NEW hint

        // Find incorrect indices that have NOT yet been revealed as a hint
        const unrevealedMistakes = incorrectIndices.filter(
            index => !revealedHintIndices.includes(index)
        );

        if (unrevealedMistakes.length > 0) {
            // Select the first unrevealed mistake index to give as a hint
            const newHintIndex = unrevealedMistakes[0]; 
            
            // Add the new hint index to the state
            setRevealedHintIndices(prev => [...prev, newHintIndex]);

        } else {
            // SCENARIO: The user made an incorrect guess, but every incorrect spot
            // has ALREADY been revealed as a hint. This means the user has 
            // the full word revealed but still submitted a wrong guess (or missed the last one).
            // You can decide how to handle this, but for simplicity, we treat it as 
            // a lost life without adding a new hint (since there are no more new hints to give).
            console.log("No new hints available for this word.");
        }
        
        // Deduct Life and check for Game Over
        setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) {
                setGameOver(true);
                return 0;
            }
            return newLives;
        });
    }

    // 3. Update Feedback State
    // Now, feedback only needs to mark letters that were *correctly* guessed 
    // OR if the entire word was guessed correctly. The hint logic is primarily 
    // driven by revealedHintIndices state, not the feedback array itself.
    const newFeedbackArray = Array(guessLength).fill(null).map((_, i) => {
        if (isCorrect) return 'correct';
        if (guessLetters[i] === wordToGuess[i]) return 'correct';
        return null; // Don't mark incorrect spots; the UI will use revealedHintIndices
    });

    setFeedback(newFeedbackArray);

    // Save Progress (You should also save revealedHintIndices)
    saveProgress(
        userGuess, 
        newFeedbackArray, 
        isCorrect ? currentGuessIndex + 1 : currentGuessIndex,
        isCorrect ? lives : lives - 1,
        lives <= 1,
        currentWord,
        revealedHintIndices // **Make sure to update saveProgress to accept and save this state**
    );
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
                isGameOver = {gameOver}
                revealedHintIndices={currentGuessIndex === rowIdx ? revealedHintIndices : []}
              />
            )}
          </div>
        );
      })}

    <div>
      {gameOver && (
      <GameOverBanner title = "GAME OVER">
        <p>Thanks for playing!</p>
        <p>Unfortunately you failed to find all the links</p>
        <p>but be back tomorrow to try again!</p>
      </GameOverBanner>
      )}
    </div>
    <p>Press Enter to Submit your Guess</p>
  </div>
  );
}


export default App;
