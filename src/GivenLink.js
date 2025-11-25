import React, { useEffect, useState } from 'react';
import { words } from './words';

function GivenLink() {
  // State to store the current value of the guess box
  const [givenValue, setGivenValue] = useState('');

  const currentDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const currentWord = words.find((entry)  => entry.date === currentDate)?.word1  ||  'defaultWord';
    setGivenValue(currentWord);
  }, [currentDate]);
  return (
    <div>
      <p><strong>{givenValue}</strong></p>
    </div>
  );
}
export default GivenLink;