import mongoose, { Schema } from "mongoose";
import { CATEGORIES, DIFFICULTIES, LABELS } from "./enums.js";

  const lectureSchema = new mongoose.Schema({
    lectureId: {
      type: String,
      required: true,
      unique: true,
      match: /^lecture_[a-z]+_[a-z_]+$/ // Example pattern for "lecture_spanish_greetings"
    },
    language: {
      type: String,
      enum: ['es', 'en'], // Spanish or English
      default: 'es'
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    videoUrl: {
      type: String,
      required: true,
    },
    quizzes: [
      {
          type: Schema.Types.ObjectId,
          ref: "Quizz"
      }
    ],
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
    duration: {
      type: Number,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
      enum: DIFFICULTIES
    },
    points: {
      type: Number,
      required: true,
      min: 10,
      max: 30,
      validate: {
        validator: function(v) {
          // Validate points based on difficulty
          const difficultyPoints = {
            'A1': [10, 12],
            'A2': [13, 15],
            'B1': [16, 20],
            'B2': [21, 24],
            'C1': [25, 28],
            'C2': [29, 30]
          };
          return v >= difficultyPoints[this.difficulty][0] && 
                v <= difficultyPoints[this.difficulty][1];
        },
        message: props => `Points value ${props.value} is not valid for difficulty level ${props.difficulty}!`
      }
    }
  }, {
    timestamps: true
  });


lectureSchema.index({ language: 1, categories: 1 });
lectureSchema.index({ difficulty: 1 }); // todo: remove it if not required
lectureSchema.index({ lectureId: 1 });

const Lecture = mongoose.model('Lecture', lectureSchema);

export{  Lecture};