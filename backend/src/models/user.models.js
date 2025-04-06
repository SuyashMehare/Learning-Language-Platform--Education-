import mongoose, {Schema} from 'mongoose';
import { CATEGORIES, DIFFICULTIES, LABELS } from './enums.js';

const progressSchema = new Schema({
  streaks: {
    current: { type: Number, default: 0, min: 0 },
    longest: { type: Number, default: 0, min: 0 }
  },
  trackCurrentDayGoal: {
    completedMinutes:{
      type: Number,
      default: 0
    },
    lastUpdateAt: {
      type: Date,
      default: Date.now()
    }
  },
  badges: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: "Quiz"
    }],
    default: [],
    validate: {
      validator: (v) => v.every(id => id.startsWith('badge_')),
      message: 'All badge IDs must start with "badge_"'
    }
  },
  points: {
    lectures: { type: Number, default: 0, min: 0 },
    quizzes: { type: Number, default: 0, min: 0 },
    vocabulary: { type: Number, default: 0, min: 0 },
    speaking: { type: Number, default: 0, min: 0 },
    writing: { type: Number, default: 0, min: 0 },
    total: { type: Number, default: 0, min: 0 }
  },
  completed: {
    lectures: {
      type: [String],
      default: [],
      validate: {
        validator: (v) => v.every(id => id.startsWith('lecture_')),
        message: 'All lecture IDs must start with "lecture_"'
      }
    },
    quizzes: {
      type: [String],
      default: [],
      validate: {
        validator: (v) => v.every(id => id.startsWith('quiz_')),
        message: 'All quiz IDs must start with "quiz_"'
      }
    },
    vocabulary: {
      type: [String],
      default: [],
      validate: {
        validator: (v) => v.every(id => id.startsWith('vocab_')),
        message: 'All vocabulary IDs must start with "vocab_"'
      }
    }
  },
  repetition : {
    vocabulary: {
      type: [String],
      default: [],
      validate: {
        validator: (v) => v.every(id => id.startsWith('lecture_')),
        message: 'All lecture IDs must start with "lecture_"'
      }
    },
    quizzes: {
      type: [String],
      default: [],
      validate: {
        validator: (v) => v.every(id => id.startsWith('quiz_')),
        message: 'All quiz IDs must start with "quiz_"'
      }
    },
  },
  proficiency: {
    vocabulary: { type: Number, default: 0, min: 0, max: 100 },
    grammar: { type: Number, default: 0, min: 0, max: 100 },
    speaking: { type: Number, default: 0, min: 0, max: 100 },
    listening: { type: Number, default: 0, min: 0, max: 100 },
    writing: { type: Number, default: null, min: 0, max: 100 }
  },
}, { _id: false });


const userSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    match: /^user_[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    validate: {
      validator: (v) => /.+@.+\..+/.test(v),
      message: props => `${props.value} is not a valid email!`
    }
  },
  preferences: {
    language: {
      type: String,
      enum: ['es', 'en'],
      default: 'es'
    },
    dailyGoalMinutes: {
      type: Number,
      enum: [10, 20, 30, 60],
      default: 20
    },
    targetLabels: {
      type: [String],
      enum: LABELS,
      default: []
    },
    targetCategories: {
      type: [String],
      enum: CATEGORIES,
      default: []
    },
    difficulty: {
      type: String,
      enum: DIFFICULTIES,
      default: 'A1'
    }
  },
  progress: progressSchema
}, {
  timestamps: true
});

// Indexes
userSchema.index({ userId: 1 });
userSchema.index({ email: 1 }, {sparse: true });


userSchema.pre('save', function(next) {
  this.progress.points.total = 
    (this.progress.points.lectures || 0) +
    (this.progress.points.quizzes || 0) +
    (this.progress.points.vocabulary || 0) +
    (this.progress.points.speaking || 0) +
    (this.progress.points.writing || 0);
  next();
});


const User = mongoose.model('User', userSchema);
export {
  User
};