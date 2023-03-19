import { useState, useEffect } from "react";
import mockQuestions from "./mockQuestions.json";

export function Question() {
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState({});
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [isReady, setIsReady] = useState(false);
  const [answersList, setAnswersList] = useState([])

  async function fetchQuestion() {
    return Promise.resolve(mockQuestions);
  }

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((timeLeft) => timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isReady]);


  useEffect(() => {
    fetchQuestion().then((data) => {
      setQuestion(data);
      setIsReady(true);
    });
  }, []);

  function handleAnswerChange(event) {
    setAnswer(event.target.value);
  }

  function handlePreviousClick() {
    // TODO: Implement previous button functionality
  }

  async function handleNextClick() {
    
    // Save the current answer and question to local storage
    const updatedAnswers = [...answersList]
    updatedAnswers[question] = 'Some answer'
    localStorage.setItem('quiz-answers', JSON.stringify(updatedAnswers))

    await fetchQuestion();
  }
  function formatTimeLeft() {
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
    const seconds = (timeLeft % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  if (!question) {
    return <p>Loading question...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-12">
      {/* Timer */}
      <div className="text-right text-sm text-gray-500 mb-4">
        Time left: {formatTimeLeft()}
      </div>
      {/* Question */}
      <h2 className="text-2xl font-medium mb-4">{question.text}</h2>

       {/* Choices */}
       <div className="grid grid-cols-1 gap-4">
        {question.choices.map((choice) => (
          <div
            key={choice.id}
            className={`border rounded-md p-4 flex items-center justify-between cursor-pointer ${
              answer[choice.id] ? "bg-indigo-100" : ""
            }`}
            onClick={() =>
              setAnswer((prevAnswer) => ({
                ...prevAnswer,
                [choice.id]: !prevAnswer[choice.id],
              }))
            }
          >
            <label className="flex items-center w-full">
              <input
                type="checkbox"
                className="form-checkbox text-indigo-600 h-5 w-5"
                name="answer"
                value={choice.id}
                checked={answer[choice.id] || false}
                onChange={handleAnswerChange}
              />
              <span className="ml-2 text-gray-700">{choice.text}</span>
            </label>
          </div>
        ))}
      </div>


      {/* Navigation buttons */}
      <div className="mt-6 flex justify-between">
        <button
          type="button"
          className="py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          onClick={handlePreviousClick}
        >
          Previous
        </button>
        <button
          type="button"
          className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={handleNextClick}
        >
          Next
        </button>
      </div>
    </div>
  );
}
