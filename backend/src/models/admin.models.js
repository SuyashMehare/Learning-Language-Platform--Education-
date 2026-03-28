import mongoose, { Schema } from 'mongoose';

const adminSchema = new Schema({
  adminId: {
    type: String,
    required: true,
    unique: true,
    match: /^admin_[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'super_admin'],
    default: 'admin'
  },
  permissions: {
    type: [String],
    default: ['create_lecture', 'edit_lecture', 'delete_lecture', 'create_quiz', 'edit_quiz', 'delete_quiz', 'manage_users']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Update timestamps before saving
adminSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export const Admin = mongoose.model('Admin', adminSchema);
