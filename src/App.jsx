//Components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

//Horks
import { useCallback, useEffect, useState } from 'react';

//CSS
import './App.css';

// Data
import { wordsList } from './data/words';

const stages = [
  { id: 1, name: 'start' },
  { id: 2, name: 'game' },
  { id: 3, name: 'end' },
];

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState('');
  const [pickedCategory, setPickedCategory] = useState('');
  const [letters, setLetters] = useState(['']);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(3);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];

    const word =
      words[category][Math.floor(Math.random() * words[category].length)];

    return { category, word };
  }, [words]);

  const handleStartGame = useCallback(() => {
    const { category, word } = pickWordAndCategory();

    let wordLetters = word.split('');

    wordLetters = wordLetters.map(l => l.toLowerCase());

    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);
    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  const veryRetry = letterGame => {
    const noemalizedLetter = letterGame.toLowerCase();

    if (
      guessedLetters.includes(noemalizedLetter) ||
      wrongLetters.includes(noemalizedLetter)
    ) {
      alert('Essa letra já foi utilizada!');
      return;
    }

    if (letters.includes(noemalizedLetter)) {
      setGuessedLetters(actualGuessedLetters => [
        ...actualGuessedLetters,
        noemalizedLetter,
      ]);
    } else {
      setWrongLetters(actualWrongLetters => [
        ...actualWrongLetters,
        noemalizedLetter,
      ]);
      setGuesses(actualGuesses => actualGuesses - 1);
    }
  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };

  useEffect(() => {
    if (guesses <= 0) {
      clearLetterStates();
      setGameStage(stages[2].name);
    }
  }, [guesses]);

  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    if (guessedLetters.length === uniqueLetters.length) {
      setScore(actualScore => (actualScore = actualScore + 100));
      handleStartGame();
      clearLetterStates();
    }
  }, [letters, guessedLetters, handleStartGame]);

  const retry = () => {
    setScore(0);
    setGuesses(3);
    setGameStage(stages[0].name);
  };

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={handleStartGame} />}
      {gameStage === 'game' && (
        <Game
          veryRetry={veryRetry}
          pickedCategory={pickedCategory}
          pickedWord={pickedWord}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === 'end' && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
