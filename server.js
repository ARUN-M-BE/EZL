import express from 'express';
import sqlite3 from 'sqlite3';

import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // In prod, use .env

app.use(cors());
app.use(express.json());

// Database Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

function initializeDatabase() {
    db.serialize(() => {
        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('learner', 'instructor', 'admin')),
      location TEXT,
      vehicle TEXT,
      price INTEGER,
      bio TEXT,
      image TEXT,
      languages TEXT,
      transmission TEXT,
      experience INTEGER,
      licence_number TEXT,
      address TEXT,
      transmission_preference TEXT,
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive'))
    )`);

        // Reviews Table
        db.run(`CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      booking_id TEXT,
      instructor_id TEXT NOT NULL,
      learner_id TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (instructor_id) REFERENCES users(id),
      FOREIGN KEY (learner_id) REFERENCES users(id)
    )`);

        // Progress Table
        db.run(`CREATE TABLE IF NOT EXISTS progress (
      id TEXT PRIMARY KEY,
      learner_id TEXT NOT NULL,
      skill TEXT NOT NULL,
      percentage INTEGER DEFAULT 0,
      FOREIGN KEY (learner_id) REFERENCES users(id)
    )`);

        // Bookings Table
        db.run(`CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      learner_id TEXT NOT NULL,
      instructor_id TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL,
      package_id TEXT,
      accepted INTEGER DEFAULT 0,
      FOREIGN KEY (learner_id) REFERENCES users(id),
      FOREIGN KEY (instructor_id) REFERENCES users(id)
    )`);

        // Prompts Table (Requested Schema)
        db.run(`CREATE TABLE IF NOT EXISTS prompts (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      command TEXT NOT NULL,
      response TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`);

        console.log('Database tables initialized');
    });
}

// Helper to wrap db.all in promise
const dbAll = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

// Helper to wrap db.get in promise
const dbGet = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

// Helper to wrap db.run in promise
const dbRun = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, changes: this.changes });
        });
    });
};


// --- Auth Routes ---

app.post('/api/auth/register', async (req, res) => {
    const { name, email, password, role, location, vehicle, price, bio, image, address, transmission_preference } = req.body;

    try {
        const existingUser = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Prevent multiple admins
        if (role === 'admin') {
            const existingAdmin = await dbGet('SELECT * FROM users WHERE role = ?', ['admin']);
            if (existingAdmin) {
                return res.status(400).json({ message: 'An admin user already exists' });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const id = Math.random().toString(36).substr(2, 9);

        await dbRun(
            `INSERT INTO users (id, name, email, password, role, location, vehicle, price, bio, image, address, transmission_preference)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, name, email, hashedPassword, role, location, vehicle, price, bio, image, address, transmission_preference]
        );

        const token = jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token, user: { id, name, email, role } });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin Route to get ALL users
app.get('/api/users', async (req, res) => {
    try {
        const users = await dbAll('SELECT id, name, email, role, location FROM users');
        res.json(users);
    } catch (error) {
        console.error('Error in /api/users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// --- User Profile Routes ---
app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const allowedFields = ['name', 'location', 'vehicle', 'price', 'bio', 'image', 'languages', 'transmission', 'experience', 'licence_number', 'address', 'transmission_preference'];

    const fields = Object.keys(updates).filter(key => allowedFields.includes(key));
    if (fields.length === 0) return res.status(400).json({ message: 'No valid fields to update' });

    const clauses = fields.map(key => `${key} = ?`).join(', ');
    const values = fields.map(key => updates[key]);

    try {
        await dbRun(`UPDATE users SET ${clauses} WHERE id = ?`, [...values, id]);
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ message: 'Error updating profile' });
    }
});

app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await dbGet("SELECT id, name, email, role, location, vehicle, price, bio, image, languages, transmission, experience, licence_number, address, transmission_preference FROM users WHERE id = ?", [req.params.id]);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user' });
    }
});

// Delete user (admin only)
app.delete('/api/users/:id', async (req, res) => {
    try {
        const user = await dbGet('SELECT role FROM users WHERE id = ?', [req.params.id]);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Prevent deleting the last admin
        if (user.role === 'admin') {
            const adminCount = await dbGet('SELECT COUNT(*) as count FROM users WHERE role = ?', ['admin']);
            if (adminCount.count <= 1) {
                return res.status(400).json({ message: 'Cannot delete the only admin user' });
            }
        }

        await dbRun('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Error deleting user' });
    }
});

// Update user status (active/inactive) - Admin only
app.put('/api/users/:id/status', async (req, res) => {
    const { status } = req.body;
    try {
        if (!['active', 'inactive'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }
        await dbRun('UPDATE users SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ message: 'User status updated successfully' });
    } catch (error) {
        console.error('Status update error:', error);
        res.status(500).json({ message: 'Error updating user status' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// --- Instructor Routes ---

app.get('/api/instructors', async (req, res) => {
    try {
        const instructors = await dbAll("SELECT id, name, location, vehicle, price, bio, image FROM users WHERE role = 'instructor'");
        // Add mock performance data for now as it's not in DB schema yet, or fetch if added later
        const enhancedInstructors = instructors.map(inst => ({
            ...inst,
            rating: 4.8, // Mock default
            reviews: 0,
            performance: { punctuality: 95, clarity: 95, patience: 95, knowledge: 95, safety: 95 }
        }));
        res.json(enhancedInstructors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching instructors' });
    }
});

app.get('/api/instructors/:id', async (req, res) => {
    try {
        const instructor = await dbGet("SELECT * FROM users WHERE id = ? AND role = 'instructor'", [req.params.id]);
        if (!instructor) return res.status(404).json({ message: 'Instructor not found' });

        // Add mock fields
        instructor.rating = 4.8;
        instructor.reviews = 0;
        instructor.performance = { punctuality: 95, clarity: 95, patience: 95, knowledge: 95, safety: 95 };

        res.json(instructor);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching instructor' });
    }
});

app.get('/api/instructors/:id/reviews', async (req, res) => {
    try {
        const reviews = await dbAll(`
            SELECT r.*, u.name as author_name 
            FROM reviews r 
            JOIN users u ON r.learner_id = u.id 
            WHERE r.instructor_id = ? 
            ORDER BY r.created_at DESC`,
            [req.params.id]
        );
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews' });
    }
});


// --- Learner Routes ---

app.get('/api/learners', async (req, res) => {
    try {
        // Fetch only safe fields for public listing
        const learners = await dbAll("SELECT id, name, location, bio, image, transmission_preference FROM users WHERE role = 'learner'");
        res.json(learners);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching learners' });
    }
});

// --- Booking Routes ---

app.post('/api/bookings', async (req, res) => {
    const { learner_id, instructor_id, date, package_id } = req.body;
    const id = Math.random().toString(36).substr(2, 9);

    try {
        await dbRun(
            `INSERT INTO bookings (id, learner_id, instructor_id, date, status, package_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [id, learner_id, instructor_id, date, 'confirmed', package_id]
        );
        res.status(201).json({ message: 'Booking created', id });
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ message: 'Error creating booking' });
    }
});

app.get('/api/bookings/user/:userId', async (req, res) => {
    try {
        const bookings = await dbAll(
            `SELECT b.*, u.name as instructor_name, u.vehicle 
       FROM bookings b 
       JOIN users u ON b.instructor_id = u.id 
       WHERE b.learner_id = ?`,
            [req.params.userId]
        );
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings' });
    }
});

// Get bookings for instructor
app.get('/api/bookings/instructor/:instructorId', async (req, res) => {
    try {
        const bookings = await dbAll(
            `SELECT b.*, u.name as learner_name 
       FROM bookings b 
       JOIN users u ON b.learner_id = u.id 
       WHERE b.instructor_id = ?`,
            [req.params.instructorId]
        );
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching instructor bookings' });
    }
});

// Update booking status
app.put('/api/bookings/:id/status', async (req, res) => {
    const { status } = req.body;
    try {
        await dbRun('UPDATE bookings SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ message: 'Booking status updated' });
    } catch (error) {
        console.error('Status update error:', error);
        res.status(500).json({ message: 'Error updating booking status' });
    }
});

// Accept booking (instructor)
app.put('/api/bookings/:id/accept', async (req, res) => {
    try {
        await dbRun('UPDATE bookings SET accepted = 1 WHERE id = ?', [req.params.id]);
        res.json({ message: 'Booking accepted' });
    } catch (error) {
        console.error('Accept booking error:', error);
        res.status(500).json({ message: 'Error accepting booking' });
    }
});

// Reject booking (instructor)
app.put('/api/bookings/:id/reject', async (req, res) => {
    try {
        await dbRun('UPDATE bookings SET accepted = -1 WHERE id = ?', [req.params.id]);
        res.json({ message: 'Booking rejected' });
    } catch (error) {
        console.error('Reject booking error:', error);
        res.status(500).json({ message: 'Error rejecting booking' });
    }
});

// Get all bookings (admin)
app.get('/api/bookings/all', async (req, res) => {
    try {
        const bookings = await dbAll(
            `SELECT b.*, 
                    u1.name as learner_name, 
                    u2.name as instructor_name,
                    u2.vehicle
             FROM bookings b 
             JOIN users u1 ON b.learner_id = u1.id 
             JOIN users u2 ON b.instructor_id = u2.id 
             ORDER BY b.date DESC`
        );
        res.json(bookings);
    } catch (error) {
        console.error('Fetch all bookings error:', error);
        res.status(500).json({ message: 'Error fetching bookings' });
    }
});

// Delete booking (admin)
app.delete('/api/bookings/:id', async (req, res) => {
    try {
        await dbRun('DELETE FROM bookings WHERE id = ?', [req.params.id]);
        res.json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error('Delete booking error:', error);
        res.status(500).json({ message: 'Error deleting booking' });
    }
});

// --- Review & Progress Routes ---

app.post('/api/reviews', async (req, res) => {
    const { booking_id, instructor_id, learner_id, rating, comment } = req.body;
    const id = Math.random().toString(36).substr(2, 9);
    try {
        await dbRun(
            `INSERT INTO reviews (id, booking_id, instructor_id, learner_id, rating, comment) VALUES (?, ?, ?, ?, ?, ?)`,
            [id, booking_id, instructor_id, learner_id, rating, comment]
        );
        res.status(201).json({ message: 'Review saved', id });
    } catch (error) {
        console.error('Review error', error);
        res.status(500).json({ message: 'Error saving review' });
    }
});

app.get('/api/progress/:userId', async (req, res) => {
    try {
        const progress = await dbAll('SELECT * FROM progress WHERE learner_id = ?', [req.params.userId]);
        // Return default structure if empty
        if (progress.length === 0) {
            return res.json([
                { skill: 'Parking', percentage: 0 },
                { skill: 'Highway Driving', percentage: 0 },
                { skill: 'Night Driving', percentage: 0 },
                { skill: 'Traffic Rules', percentage: 0 }
            ]);
        }
        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching progress' });
    }
});

app.post('/api/progress', async (req, res) => {
    const { learner_id, skill, percentage } = req.body;
    // Simple upsert logic simulation
    try {
        const existing = await dbGet('SELECT * FROM progress WHERE learner_id = ? AND skill = ?', [learner_id, skill]);
        if (existing) {
            await dbRun('UPDATE progress SET percentage = ? WHERE id = ?', [percentage, existing.id]);
        } else {
            const id = Math.random().toString(36).substr(2, 9);
            await dbRun('INSERT INTO progress (id, learner_id, skill, percentage) VALUES (?, ?, ?, ?)', [id, learner_id, skill, percentage]);
        }
        res.json({ message: 'Progress updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating progress' });
    }
});


app.post('/api/prompts', async (req, res) => {
    const { user_id, command, response } = req.body;
    const id = Math.random().toString(36).substr(2, 9);

    try {
        await dbRun(
            `INSERT INTO prompts (id, user_id, command, response) VALUES (?, ?, ?, ?)`,
            [id, user_id, command, response]
        );
        res.status(201).json({ message: 'Prompt saved', id });
    } catch (error) {
        console.error('Prompt save error:', error);
        res.status(500).json({ message: 'Error saving prompt' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
