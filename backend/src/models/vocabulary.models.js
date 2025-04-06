import mongoose from "mongoose";
import { VOCABULARYTAGS,DIFFICULTIES,LABELS } from "./enums.js";

    const vocabularySchema = new mongoose.Schema({
      id: {
        type: String,
        required: true,
        unique: true,
        match: /^vocab_[a-z_]+$/ // Pattern for "vocab_hola"
      },
      word: {
        type: String,
        required: true,
        trim: true
      },
      language: {
        type: String,
        enum: ['es', 'en'], // Spanish or English
        default: 'es'
      },
      meaning: {
        type: String,
        required: true,
        trim: true
      },
      synonyms: {
        type: String,
        required: true
      },
      difficulty: {
        type: String,
        required: true,
        enum: DIFFICULTIES
      },
      tags: {
        type: [String],
        required: true,
        enum: VOCABULARYTAGS // Added category support
      },
      labels: {
        type: [String],
        default: [],
        enum: LABELS // Added label support
      },
      points: {
        type: Number,
        default: 1
      },
      options: {
        type: [String],
        required: true,
        validate: {
          validator: (v) => v.length >= 2 && v.length <= 5,
          message: 'A quiz must have between 2 and 5 options'
        }
      }
    }, {
      timestamps: true
    });



    vocabularySchema.index({ difficulty: 1 });
    // vocabularySchema.index({ tags: 1 }); // Added category index
    vocabularySchema.index({ labels: 1 }); // Added label index
    vocabularySchema.index({ id: 1 }); // Added label index

    const Vocabulary = mongoose.model('Vocabulary', vocabularySchema);

  export  {
      Vocabulary
    };