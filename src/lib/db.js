import { v4 as uuidv4 } from 'uuid';

/**
 * DB wrapper using localStorage for the Valentine App
 */
const DB_KEY_QUIZZES = 'valentine_quizzes';
const DB_KEY_ATTEMPTS = 'valentine_attempts';

const getFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading ${key} from storage:`, error);
    return [];
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
  }
};

// --- Quizzes ---

export const getQuizzes = () => getFromStorage(DB_KEY_QUIZZES);

export const getQuizById = (id) => {
  const quizzes = getQuizzes();
  return quizzes.find(q => q.id === id) || null;
};

export const createQuiz = (creatorName, spouseName, questions) => {
  const quizzes = getQuizzes();
  const newQuiz = {
    id: uuidv4(),
    creatorName,
    spouseName,
    questions, // Array of { id, text, options: [], correctOptionIndex }
    createdAt: new Date().toISOString()
  };
  quizzes.push(newQuiz);
  saveToStorage(DB_KEY_QUIZZES, quizzes);
  return newQuiz;
};

// --- Attempts ---

export const getAttempts = () => getFromStorage(DB_KEY_ATTEMPTS);

export const getAttemptsByQuizId = (quizId) => {
  const attempts = getAttempts();
  return attempts.filter(a => a.quizId === quizId);
};

export const getAttemptById = (attemptId) => {
  const attempts = getAttempts();
  return attempts.find(a => a.id === attemptId) || null;
};

export const submitAttempt = (quizId, submitterName, answers) => {
  const attempts = getAttempts();
  const quiz = getQuizById(quizId);
  
  if (!quiz) {
    throw new Error("Quiz not found");
  }

  // Calculate score
  let score = 0;
  const gradedAnswers = answers.map((ans) => {
    const question = quiz.questions.find(q => q.id === ans.questionId);
    if (!question) return { ...ans, isCorrect: false };
    
    const isCorrect = question.correctOptionIndex === ans.selectedOptionIndex;
    if (isCorrect) score += 1;
    
    return {
      ...ans,
      isCorrect,
      correctOptionIndex: question.correctOptionIndex
    };
  });

  const newAttempt = {
    id: uuidv4(),
    quizId,
    submitterName,
    answers: gradedAnswers,
    score,
    totalQuestions: quiz.questions.length,
    submittedAt: new Date().toISOString()
  };

  attempts.push(newAttempt);
  saveToStorage(DB_KEY_ATTEMPTS, attempts);
  return newAttempt;
};

// --- Letters ---
const DB_KEY_LETTERS = 'valentine_letters';
const DB_KEY_REPLIES = 'valentine_replies';

export const getLetters = () => getFromStorage(DB_KEY_LETTERS);

export const getLetterById = (id) => {
  const letters = getLetters();
  return letters.find(l => l.id === id) || null;
};

export const createLetter = (creatorName, recipientName, message) => {
  const letters = getLetters();
  const newLetter = {
    id: uuidv4(),
    creatorName,
    recipientName,
    message,
    createdAt: new Date().toISOString()
  };
  letters.push(newLetter);
  saveToStorage(DB_KEY_LETTERS, letters);
  return newLetter;
};

export const getReplies = () => getFromStorage(DB_KEY_REPLIES);

export const getReplyByLetterId = (letterId) => {
  const replies = getReplies();
  return replies.find(r => r.letterId === letterId) || null;
};

export const submitReply = (letterId, responseType, customMessage = "") => {
  const replies = getReplies();
  const letter = getLetterById(letterId);
  
  if (!letter) {
    throw new Error("Letter not found");
  }

  // Remove existing reply if any, assuming 1 reply per letter
  const filteredReplies = replies.filter(r => r.letterId !== letterId);

  const newReply = {
    id: uuidv4(),
    letterId,
    responseType, // 'yes', 'no', 'custom'
    customMessage,
    submittedAt: new Date().toISOString()
  };

  filteredReplies.push(newReply);
  saveToStorage(DB_KEY_REPLIES, filteredReplies);
  return newReply;
};
