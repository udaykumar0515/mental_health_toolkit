import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { 
  findUserByEmail, 
  findUserById, 
  createUser as dbCreateUser,
  updateUser as dbUpdateUser 
} from './database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRY = '7d';

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePasswords = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const registerUser = async (email, password, full_name, age, gender) => {
  // Check if user already exists
  if (findUserByEmail(email)) {
    throw new Error('User already exists');
  }

  // Validate password strength
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = {
    id: `user_${Date.now()}`,
    email,
    password: hashedPassword,
    full_name,
    age: age || 0,
    gender: gender || 'prefer-not-to-say',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    // streak tracking
    current_streak: 0,
    longest_streak: 0,
    last_streak_date: null
  };

  dbCreateUser(user);

  return {
    token: generateToken(user.id),
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      age: user.age,
      gender: user.gender,
      created_at: user.created_at
    }
  };
};

export const loginUser = async (email, password) => {
  const user = findUserByEmail(email);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await comparePasswords(password, user.password);
  
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  return {
    token: generateToken(user.id),
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      age: user.age || 0,
      gender: user.gender || 'prefer-not-to-say',
      created_at: user.created_at
    }
  };
};

export const getUserData = (userId) => {
  const user = findUserById(userId);
  
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    age: user.age || 0,
    gender: user.gender || 'prefer-not-to-say',
    created_at: user.created_at
  };
};

export { verifyToken };
