import mongoose, { Schema } from "mongoose";

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    required: true,
  },
  criteria: {
    type: {
      type: String,
      required: true,
      enum: ['lectures', 'quizzes', 'streaks', 'points']
    },
    threshold: {
      type: Number,
      required: true,
      min: 1
    }
  }
}, {
  timestamps: true
});

// Indexes
badgeSchema.index({ 'criteria.type': 1 });

const Badge = mongoose.model('Badge', badgeSchema);

export { 
  Badge
}