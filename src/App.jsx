
import { useState , useEffect} from 'react'
import './App.css'
import { languages } from './languages'
import clsx from 'clsx';
import {getFarewellText , randomWord} from './utils'
import confetti from 'canvas-confetti';

function App() {
  //State Values
  const [currentWord , setCurrentWord] = useState(() => randomWord())
  const [guessLetter , setGuessedLetters] = useState([])
  console.log(currentWord)
  //Derived Values

  const WrongGuessCount = guessLetter.filter(letter => !currentWord.includes(letter)).length;
  const numGuessLeft = languages.length - 1 -WrongGuessCount
  const isGameWon = currentWord.split("").every(letter => guessLetter.includes(letter))
  const isGameLost = WrongGuessCount >= languages.length - 1 
  const isGameOver = isGameWon || isGameLost
  const lastGuessedLetter = guessLetter[guessLetter.length-1]
  const isLastGuessedIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)
  

  //Static Values
  const alphabet = "abcdefghijklmnopqrstuvwxyz"

  const languageElements = languages.map((language ,index) => {
    
    const isLost = index <WrongGuessCount ;
    const className =clsx(
      "language"  ,
      {lost: isLost}
    ) 
    return(
    <span
      className= {className}
      style={{
        backgroundColor: language.backgroundColor,
        color: language.color,
        position: "relative",
      }}
    >
      {language.name}
    </span>
    )
  }
    

  );




  const letterElements = currentWord.split("").map((letter , index) => {
    const letterClassName= clsx(
      isGameLost && !guessLetter.includes(letter) && "missed-letter"
    )
    return <span key={index} className={letterClassName} >
      {guessLetter.includes(letter) || isGameLost ? letter.toLocaleUpperCase() : ""}
    </span> 
  })

  

  const keyboardElemets = alphabet.split("").map(letter => {
    const isGuessed = guessLetter.includes(letter)
    const isCorrect = isGuessed && currentWord.includes(letter)
    const isWrong = isGuessed && !currentWord.includes(letter)
    const className = clsx({
      correct : isCorrect ,
      wrong : isWrong ,
    })

    return (<button 
        className={className}
        key={letter}
        disabled ={isGameOver}
        aria-disabled = {guessLetter.includes(letter)}
        aria-label = {`Letter ${letter}`}
        onClick={() => addGuessedLetter(letter)}>
        {letter.toLocaleUpperCase()}
        </button>)
  })



  function addGuessedLetter(letter){
    setGuessedLetters(prevLetters => 
        prevLetters.includes(letter) ? prevLetters : [...prevLetters , letter]
    )
  }

  const gameStatusClass = clsx("game-status" ,{
    won : isGameWon ,
    lost : isGameLost,
    farewell : isLastGuessedIncorrect && !isGameOver
  })

  function renderGameStatus(){
    if(!isGameOver && isLastGuessedIncorrect){
      return(
        <>
          <p className='farewell-msg'>{getFarewellText(languages[WrongGuessCount - 1].name)}</p>
        </>
      )
    }



    if(isGameWon){
      return(
                  <>
                    <h2>You Win!</h2>
                    <p>Well Done!🎉</p>
                  </>
                  
      )
    }
    
    if(isGameLost){
        return(
          <>
                      <h2>Game Over!</h2>
                      <p>You lose! Better start learning Assembly 😭</p>
          </>  
        )           
    
    }


    return null

  }

  function newGame(){
    setCurrentWord(() => randomWord())
    setGuessedLetters([])
  }

  useEffect(() => {
  if (isGameWon) {
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 }
    });
  }
}, [isGameWon]);

  return (
    <>
      <main>
          <header>
              <h1>Assembly:Endgame</h1>
              <p>Guess the word within 8 attempts to keep the 
              programming world safe from Assembly!</p>
          </header>

          <div aria-live='polite' role='status' className={gameStatusClass}>
                {renderGameStatus()}
          </div>

          <div className="languages-container">
              {languageElements}
          </div>

          <div aria-live='polite' role='status' className='word'>
            {letterElements}
          </div>


        <div aria-live='polite' role='status' className='sr-only'>
          <p>
            {currentWord.includes(lastGuessedLetter) ?
              `Correct !!! The letter ${lastGuessedLetter} is in the word` :
              `Sorry , The letter ${lastGuessedLetter} is not in the word` 
            }
            You have {numGuessLeft} attempts left
          </p>
          <p>
            Current Word : 
            {
            currentWord.split("")
              .map(letter => guessLetter.includes(letter) ? letter + "." : "blank").join(" ")
            }
          </p>
        </div>

          <div className="keyboard">
              {keyboardElemets}
          </div>

          {isGameOver &&<button onClick={newGame} className="new-game">New Game</button>}
      </main>
    </>
  )
}

export default App
