import { useState } from "react";

export default function App() {
  const [word, setWord] = useState("");
  const [wordData, setWordData] = useState(null);
  const [translated, setTranslated] = useState(false);

  async function fetchWordData() {
    if (!word.trim()) return alert("Please enter a word!");

    setWordData(null);
    setTranslated(false);

    const dictionaryAPI = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    const translateMeaningAPI = `https://api.mymemory.translated.net/get?q=${word}&langpair=en|tr`;

    try {
      // Dictionary API - Anlam ve Örnek Cümle
      const dictRes = await fetch(dictionaryAPI);
      const dictData = await dictRes.json();
      const meaning =
        dictData[0]?.meanings[0]?.definitions[0]?.definition ||
        "No definition found.";
      const example =
        dictData[0]?.meanings[0]?.definitions[0]?.example ||
        "No example available.";

      // Türkçeye çeviri API'si
      const translateMeaningRes = await fetch(
        `https://api.mymemory.translated.net/get?q=${meaning}&langpair=en|tr`
      );
      const translateExampleRes = await fetch(
        `https://api.mymemory.translated.net/get?q=${example}&langpair=en|tr`
      );
      const translatedMeaning = await translateMeaningRes.json();
      const translatedExample = await translateExampleRes.json();

      setWordData({
        word,
        meaning,
        example,
        translatedMeaning: translatedMeaning.responseData.translatedText,
        translatedExample: translatedExample.responseData.translatedText,
      });
    } catch (error) {
      alert("Error fetching data. Please try another word.");
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold">Vocabulary Card Generator</h1>
      <input
        type="text"
        value={word}
        onChange={(e) => setWord(e.target.value)}
        className="p-2 border border-gray-300 rounded-md w-64"
        placeholder="Enter a word"
      />
      <button
        onClick={fetchWordData}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Generate Card
      </button>

      {wordData && (
        <div
          className="bg-white shadow-lg rounded-lg p-4 w-80 text-center mt-6 cursor-pointer"
          onClick={() => setTranslated(!translated)}
        >
          <h2 className="text-xl font-bold">{wordData.word}</h2>
          <p className="mt-2">
            {translated ? "Türkçe Anlam: " : "Meaning: "}{" "}
            {translated ? wordData.translatedMeaning : wordData.meaning}
          </p>
          <p className="italic mt-2">
            {translated ? "Türkçe Cümle: " : "Example: "} "
            {translated ? wordData.translatedExample : wordData.example}"
          </p>
        </div>
      )}
    </div>
  );
}
