import mongoose from "mongoose";
import { CATEGORIES, DIFFICULTIES, LABELS }  from "./enums.js";

const quizSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    match: /^quiz_[a-z_]+$/ // Pattern for "quiz_hola"
  },
  language: {
    type: String,
    enum: ['es', 'en'], // Spanish or English
    default: 'en'
  },
  question: {
    type: String,
    required: true,
    trim: true,
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: (v) => v.length >= 2 && v.length <= 5,
      message: 'A quiz must have between 2 and 5 options'
    }
  },
  answer: {
    type: String,
    required: true,
    validate: {
      validator: function(v) { return this.options.includes(v) },
      message: 'Answer must be one of the provided options'
    }
  },
  categories: {
    type: [String],
    required: true,
    enum: CATEGORIES
  },
  labels: {
    type: [String],
    default: [],
    enum: LABELS
  },
  difficulty: {
    type: String,
    required: true,
    enum: DIFFICULTIES
  },
  points: {
    type: Number,
    required: true,
    min: 5,
    max: 20,
    validate: {
      validator: function(v) {
        const difficultyPoints = {
          'A1': [5, 7],
          'A2': [8, 10],
          'B1': [11, 13],
          'B2': [14, 16],
          'C1': [17, 19],
          'C2': [20, 20]
        };
        return v >= difficultyPoints[this.difficulty][0] && 
               v <= difficultyPoints[this.difficulty][1];
      },
      message: props => `Points value ${props.value} is not valid for difficulty level ${props.difficulty}!`
    }
  },
  feedback: {
    type: String,
    trim: true,
    default: null
  }
}, {
  timestamps: true
});


quizSchema.index({ difficulty: 1 });
quizSchema.index({ points: 1 });
quizSchema.index({ labels: 1, categories: 1 });

const Quiz = mongoose.model('Quiz', quizSchema);

export {
  Quiz
};