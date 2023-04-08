/* eslint-disable @next/next/no-page-custom-font */
import { useState, useRef, useEffect, useCallback } from "react";
import Head from "next/head";

import styles from "@/styles/Home.module.css";
import PlayingField from "@/components/PlayingField/PlayingField";
import HiddenInput from "@/components/HiddenInput/HiddenInput";

interface notFoundLetters {
  [key: string]: number;
}

const validationState = {
  correct: "correct",
  incorrect: "incorrect",
  partiallyCorrect: "partiallyCorrect",
};

const getRandomWord = async () => {
  const data = await (
    await fetch("https://random-word-api.herokuapp.com/word?number=1&length=5")
  ).json();

  const word = data[0];

  return word;
};

const saveRandomWordWithDate = (word: string) => {
  const date = new Date();
  localStorage.setItem("randomWord", word);
  localStorage.setItem("randomWordDate", date.toString());
};

const getNewRandomWord = async () => {
  const word = await getRandomWord();
  saveRandomWordWithDate(word);
};

const getGameSettings = async () => {
  const maxTries = 6;
  const wordLength = 5;
  const debugMode = false;

  if (localStorage.getItem("randomWord") === undefined) {
    await getNewRandomWord();
  } else {
    const date = new Date();
    const savedDate = new Date(localStorage.getItem("randomWordDate") || "");
    const diff = Math.abs(date.getTime() - savedDate.getTime());
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24));

    if (diffDays > 1) {
      await getNewRandomWord();
    }
  }

  const currentWord = localStorage.getItem("randomWord") || "";

  return { maxTries, wordLength, currentWord, debugMode };
};

export default function Home() {
  const initValues = [[{ state: "", value: "" }]];

  const [debugMode, setDebugMode] = useState(false);
  const [maxTries, setMaxTries] = useState(6);
  const [wordLength, setWordLength] = useState(5);
  const [currentWord, setCurrentWord] = useState("hello");
  const [values, setValues] = useState(initValues);
  const [currentTry, setCurrentTry] = useState(0);

  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const [hiddenInputValue, setHiddenInputValue] = useState("");

  const fetchGameSettings = useCallback(async () => {
    const { maxTries, wordLength, currentWord, debugMode } =
      await getGameSettings();

    setMaxTries(maxTries);
    setWordLength(wordLength);
    setCurrentWord(currentWord);
    setDebugMode(debugMode);
  }, []);

  useEffect(() => {
    fetchGameSettings().catch((err) => console.log(err));
  }, [fetchGameSettings]);

  const validateWord = () => {
    const wordToValidate = values[currentTry];
    const currentWordArray = currentWord.split("");

    let notFoundLetters: notFoundLetters = {};

    // First compare current word with input word, mark correct letters and add not found letters to notFoundLetters object
    for (let i = 0; i < currentWordArray.length; i++) {
      const letterToCheck = currentWordArray[i];

      if (wordToValidate[i].value === letterToCheck) {
        wordToValidate[i].state = validationState.correct;
      } else {
        notFoundLetters[letterToCheck] =
          (notFoundLetters[letterToCheck] || 0) + 1;
      }
    }

    // Now compare input word with current word, mark partially correct letters and mark incorrect letters
    for (let i = 0; i < wordToValidate.length; i++) {
      const letterToCheck = wordToValidate[i].value;

      if (letterToCheck !== currentWordArray[i]) {
        if (notFoundLetters[letterToCheck]) {
          notFoundLetters[letterToCheck] -= 1;
          wordToValidate[i].state = validationState.partiallyCorrect;
        } else {
          wordToValidate[i].state = validationState.incorrect;
        }
      }
    }

    // Save validated word to values
    const newValues = [...values];
    newValues[currentTry] = wordToValidate;
    setValues(newValues);
  };

  const renderWordToPlayingField = (word: String) => {
    const wordArray = word.split("");

    const newValues = [...values];

    const wordWithState = wordArray.map((letter) => {
      return { state: "", value: letter };
    });

    if (values[currentTry] === undefined) {
      newValues.push(wordWithState);
    } else {
      newValues[currentTry] = wordWithState;
    }

    setValues(newValues);
  };

  const onHiddenInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;

    if (inputVal.length <= wordLength) {
      setHiddenInputValue(e.target.value);
      renderWordToPlayingField(inputVal);
    }
  };

  const onClickPlayingField = () => {
    hiddenInputRef.current?.focus();
  };

  const clearHiddenInput = () => {
    setHiddenInputValue("");
  };

  const handlePressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (hiddenInputValue.length === wordLength) {
        validateWord();
        clearHiddenInput();
        setCurrentTry(currentTry + 1);
      }
    }
  };

  return (
    <>
      <Head>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <HiddenInput
          ref={hiddenInputRef}
          value={hiddenInputValue}
          onChange={onHiddenInputChange}
          debug={debugMode}
          onKeyDown={handlePressEnter}
        />
        <PlayingField
          rows={maxTries}
          columns={wordLength}
          values={values}
          onClick={onClickPlayingField}
        />
      </main>
    </>
  );
}
