import request from "supertest";
import app from "../../src/server.js";
import { prisma } from '../../src/config/database.js';
import jwt from 'jsonwebtoken';
import { jest } from '@jest/globals';

describe('Auth E2E Tests', () => {
  
  describe('POST /api/auth/register', () => {
    const validStudent = {
      lastname: 'DUPONT',
      firstname: 'Jean',
      username: 'jdupont',
      password: 'Password123',
      role: 'student'
    };

    it('Should successfully create a new student', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(validStudent)
        .expect(200);

      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('access_token');
      expect(res.body.username).toBe(validStudent.username);
      expect(res.body.role).toBe('student');
      expect(res.body).not.toHaveProperty('password');
      expect(res.body).not.toHaveProperty('refresh_token');
      
      // Check refresh_token cookie
      expect(res.headers['set-cookie']).toBeDefined();
      expect(res.headers['set-cookie'][0]).toContain('refresh_token');

      // Check in DB
      const user = await prisma.user.findUnique({
        where: { username: validStudent.username }
      });
      expect(user).toBeTruthy();
      expect(user.refresh_token).toBeTruthy();
      expect(user.refresh_token_expires_at).toBeTruthy();

      const student = await prisma.student.findUnique({
        where: { id: user.id }
      });
      expect(student).toBeTruthy();
      expect(student.completed_qcm_count).toBe(0);
    });

    it('Should successfully create a new teacher', async () => {
      const validTeacher = {
        ...validStudent,
        username: 'jdupont_teacher',
        role: 'teacher'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(validTeacher)
        .expect(200);

      expect(res.body.role).toBe('teacher');

      const teacher = await prisma.teacher.findUnique({
        where: { id: res.body.id }
      });
      expect(teacher).toBeTruthy();
      expect(teacher.created_qcm_count).toBe(0);
    });

    it('Should fail if lastname is missing', async () => {
      const invalidData = { ...validStudent };
      delete invalidData.lastname;

      const res = await request(app)
        .post('/api/auth/register')
        .send(invalidData)
        .expect(400);

      expect(res.body.message).toBe('All fields are required');
    });

    it('Should fail if firstname is missing', async () => {
      const invalidData = { ...validStudent };
      delete invalidData.firstname;

      const res = await request(app)
        .post('/api/auth/register')
        .send(invalidData)
        .expect(400);

      expect(res.body.message).toBe('All fields are required');
    });

    it('Should fail if username is missing', async () => {
      const invalidData = { ...validStudent };
      delete invalidData.username;

      const res = await request(app)
        .post('/api/auth/register')
        .send(invalidData)
        .expect(400);

      expect(res.body.message).toBe('All fields are required');
    });

    it('Should fail if password is missing', async () => {
      const invalidData = { ...validStudent };
      delete invalidData.password;

      const res = await request(app)
        .post('/api/auth/register')
        .send(invalidData)
        .expect(400);

      expect(res.body.message).toBe('All fields are required');
    });

    it('Should fail if role is missing', async () => {
      const invalidData = { ...validStudent };
      delete invalidData.role;

      const res = await request(app)
        .post('/api/auth/register')
        .send(invalidData)
        .expect(400);

      expect(res.body.message).toBe('All fields are required');
    });

    it('Should fail if the password is too short', async () => {
      const weakPassword = {
        ...validStudent,
        username: 'jdupont2',
        password: 'Pass1'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(weakPassword)
        .expect(400);

      expect(res.body.message).toContain('Password must be at least 8 characters');
    });

    it('Should fail if the password does not have an uppercase letter', async () => {
      const weakPassword = {
        ...validStudent,
        username: 'jdupont3',
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(weakPassword)
        .expect(400);

      expect(res.body.message).toContain('Password must be at least 8 characters');
    });

    it('Should fail if the password does not have a lowercase letter', async () => {
      const weakPassword = {
        ...validStudent,
        username: 'jdupont4',
        password: 'PASSWORD123'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(weakPassword)
        .expect(400);

      expect(res.body.message).toContain('Password must be at least 8 characters');
    });

    it('Should fail if the password does not have a digit', async () => {
      const weakPassword = {
        ...validStudent,
        username: 'jdupont5',
        password: 'PasswordOnly'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(weakPassword)
        .expect(400);

      expect(res.body.message).toContain('Password must be at least 8 characters');
    });

    it('Should fail if the username already exists', async () => {
      // Create first user
      await request(app)
        .post('/api/auth/register')
        .send(validStudent);

      // Try to create again with same username
      const res = await request(app)
        .post('/api/auth/register')
        .send(validStudent)
        .expect(409);

      expect(res.body.message).toBe('This username already exists.');
    });

    it('Should handle unexpected errors (500)', async () => {
      // Mock Prisma error
      const originalCreate = prisma.user.create;
      prisma.user.create = jest.fn().mockRejectedValue(new Error('Database error'));

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          ...validStudent,
          username: 'error_test'
        })
        .expect(500);

      expect(res.body.message).toBe('Database error');

      // Restore
      prisma.user.create = originalCreate;
    });
  });

  describe('POST /api/auth/login', () => {
    const userData = {
      lastname: 'MARTIN',
      firstname: 'Sophie',
      username: 'smartin',
      password: 'Password123',
      role: 'student'
    };

    beforeEach(async () => {
      // Create a user for login tests
      await request(app)
        .post('/api/auth/register')
        .send(userData);
    });

    it('Should login successfully', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: userData.username,
          password: userData.password
        })
        .expect(200);

      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('access_token');
      expect(res.body.username).toBe(userData.username);
      expect(res.body.role).toBe('student');
      expect(res.body).not.toHaveProperty('password');
      expect(res.body).not.toHaveProperty('refresh_token');
      
      // Check refresh_token cookie
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('Should fail with an invalid username', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'wronguser',
          password: userData.password
        })
        .expect(404);

      expect(res.body.message).toBe('User not found.');
    });

    it('Should fail with an invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: userData.username,
          password: 'WrongPassword123'
        })
        .expect(401);

      expect(res.body.message).toBe('Invalid password.');
    });

    it('Should fail if username is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ password: userData.password })
        .expect(400);

      expect(res.body.message).toBe('Username and password are required');
    });

    it('Should fail if password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: userData.username })
        .expect(400);

      expect(res.body.message).toBe('Username and password are required');
    });

    it('Should handle unexpected errors (500)', async () => {
      const originalFindUnique = prisma.user.findUnique;
      prisma.user.findUnique = jest.fn().mockRejectedValue(new Error('Database connection lost'));

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: userData.username,
          password: userData.password
        })
        .expect(500);

      expect(res.body.message).toBe('Database connection lost');

      prisma.user.findUnique = originalFindUnique;
    });
  });

  describe('GET /api/auth/current_session', () => {
    let accessToken;
    let userId;

    beforeEach(async () => {
      // Create and login a user
      const registerRes = await request(app)
        .post('/api/auth/register')
        .send({
          lastname: 'BERNARD',
          firstname: 'Paul',
          username: 'pbernard',
          password: 'Password123',
          role: 'student'
        });
      
      accessToken = registerRes.body.access_token;
      userId = registerRes.body.id;
    });

    it('Should return the current session with a valid token', async () => {
      const res = await request(app)
        .get('/api/auth/current_session')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('id', userId);
      expect(res.body).toHaveProperty('username', 'pbernard');
      expect(res.body).toHaveProperty('role', 'student');
    });

    it('Should fail without a token', async () => {
      const res = await request(app)
        .get('/api/auth/current_session')
        .expect(401);

      expect(res.body.message).toBe('No token provided');
    });

    it('Should fail with an invalid token (JsonWebTokenError)', async () => {
      const res = await request(app)
        .get('/api/auth/current_session')
        .set('Authorization', 'Bearer invalid_token_here')
        .expect(401);

      expect(res.body.message).toBe('Invalid or expired token');
    });

    it('Should fail with an expired token (TokenExpiredError)', async () => {
      // Create an expired token
      const expiredToken = jwt.sign(
        { id: userId, role: 'student' },
        process.env.JWT_SECRET,
        { expiresIn: '-1s' }
      );

      const res = await request(app)
        .get('/api/auth/current_session')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(res.body.message).toBe('Invalid or expired token');
    });

    it('Should fail with a malformed token (missing Bearer)', async () => {
      const res = await request(app)
        .get('/api/auth/current_session')
        .set('Authorization', 'InvalidFormat')
        .expect(401);

      expect(res.body.message).toBe('Invalid or expired token');
    });

    it('Should fail if the user no longer exists in the DB', async () => {
      // Delete the user
      await prisma.student.delete({ where: { id: userId } });
      await prisma.user.delete({ where: { id: userId } });

      const res = await request(app)
        .get('/api/auth/current_session')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);

      expect(res.body.message).toBe('User not found');
    });

    it('Should handle unexpected JWT errors (500)', async () => {
      const originalVerify = jwt.verify;
      jwt.verify = jest.fn().mockImplementation(() => {
        throw new Error('Unexpected JWT error');
      });

      const res = await request(app)
        .get('/api/auth/current_session')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(500);

      expect(res.body.message).toBe('Unexpected JWT error');

      jwt.verify = originalVerify;
    });

    it('Should handle DB errors (500)', async () => {
      const originalFindUnique = prisma.user.findUnique;
      prisma.user.findUnique = jest.fn().mockRejectedValue(new Error('DB timeout'));

      const res = await request(app)
        .get('/api/auth/current_session')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(500);

      expect(res.body.message).toBe('DB timeout');

      prisma.user.findUnique = originalFindUnique;
    });

    it('Should fail if the token does not contain an id (empty id)', async () => {
        // Valid token but without id
        const tokenWithoutId = jwt.sign(
            { role: 'student' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const res = await request(app)
            .get('/api/auth/current_session')
            .set('Authorization', `Bearer ${tokenWithoutId}`)
            .expect(400);

        expect(res.body.message).toBe('User ID is required');
    });
  });

  describe('GET /api/auth/refresh', () => {
    let refreshToken;
    let userId;

    beforeEach(async () => {
      // Create a user and get the refresh token
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          lastname: 'PETIT',
          firstname: 'Marie',
          username: 'mpetit',
          password: 'Password123',
          role: 'teacher'
        });

      userId = res.body.id;
      
      // Extract refresh token from cookie
      const cookies = res.headers['set-cookie'];
      const refreshCookie = cookies.find(c => c.startsWith('refresh_token='));
      refreshToken = refreshCookie.split(';')[0].split('=')[1];
    });

    it('Should generate a new access token with a valid refresh token', async () => {
      const res = await request(app)
        .get('/api/auth/refresh')
        .set('Cookie', [`refresh_token=${refreshToken}`])
        .expect(200);

      expect(res.body).toHaveProperty('access_token');
      expect(res.body).toHaveProperty('id', userId);
      expect(res.body.role).toBe('teacher');
      expect(res.body).not.toHaveProperty('refresh_token');
      
      // Check new refresh_token cookie
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('Should fail without a refresh token', async () => {
      const res = await request(app)
        .get('/api/auth/refresh')
        .expect(401);

      expect(res.body.message).toBe('Refresh token required');
    });

    it('Should fail with an invalid refresh token', async () => {
      const res = await request(app)
        .get('/api/auth/refresh')
        .set('Cookie', ['refresh_token=invalid_token'])
        .expect(401);

      expect(res.body.message).toBe('Invalid or expired refresh token.');
    });

    it('Should fail with an expired refresh token', async () => {
      // Manually modify the expiration date in DB
      await prisma.user.update({
        where: { id: userId },
        data: {
          refresh_token_expires_at: new Date(Date.now() - 1000)
        }
      });

      const res = await request(app)
        .get('/api/auth/refresh')
        .set('Cookie', [`refresh_token=${refreshToken}`])
        .expect(401);

      expect(res.body.message).toBe('Invalid or expired refresh token.');
    });

    it('Should handle DB errors (500)', async () => {
      const originalFindFirst = prisma.user.findFirst;
      prisma.user.findFirst = jest.fn().mockRejectedValue(new Error('Connection lost'));

      const res = await request(app)
        .get('/api/auth/refresh')
        .set('Cookie', [`refresh_token=${refreshToken}`])
        .expect(500);

      expect(res.body.message).toBe('Connection lost');

      prisma.user.findFirst = originalFindFirst;
    });

    it('Should return 500 if updateRefreshToken fails', async () => {
    // Create a user
    const res = await request(app)
        .post('/api/auth/register')
        .send({
        lastname: 'ERROR',
        firstname: 'REFRESH',
        username: 'refresh_update_fail',
        password: 'Password123',
        role: 'student'
        });

    const cookies = res.headers['set-cookie'];
    const refreshCookie = cookies.find(c => c.startsWith('refresh_token='));
    const refreshToken = refreshCookie.split(';')[0].split('=')[1];

    // Mock Prisma error on update
    const originalUpdate = prisma.user.update;
    prisma.user.update = jest.fn().mockRejectedValue(
        new Error('Failed to update refresh token.')
    );

    const refreshRes = await request(app)
        .get('/api/auth/refresh')
        .set('Cookie', [`refresh_token=${refreshToken}`])
        .expect(500);

    expect(refreshRes.body.message).toBe('Failed to update refresh token.');

    // Restore
    prisma.user.update = originalUpdate;
    });
  });

  describe('Full authentication flow', () => {
    it('Should complete a full cycle: register -> login -> current_session -> refresh', async () => {
      // 1. Register
      const registerRes = await request(app)
        .post('/api/auth/register')
        .send({
          lastname: 'DURAND',
          firstname: 'Luc',
          username: 'ldurand',
          password: 'Password123',
          role: 'student'
        })
        .expect(200);

      const userId = registerRes.body.id;
      const accessToken1 = registerRes.body.access_token;

      // 2. Check current_session with the token from register
      await request(app)
        .get('/api/auth/current_session')
        .set('Authorization', `Bearer ${accessToken1}`)
        .expect(200);

      // 3. Login
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'ldurand',
          password: 'Password123'
        })
        .expect(200);

      const accessToken2 = loginRes.body.access_token;

      // 4. Check current_session with the new token
      const sessionRes = await request(app)
        .get('/api/auth/current_session')
        .set('Authorization', `Bearer ${accessToken2}`)
        .expect(200);

      expect(sessionRes.body.id).toBe(userId);

      // 5. Refresh token
      const cookies = loginRes.headers['set-cookie'];
      const refreshCookie = cookies.find(c => c.startsWith('refresh_token='));
      const refreshToken = refreshCookie.split(';')[0].split('=')[1];

      const refreshRes = await request(app)
        .get('/api/auth/refresh')
        .set('Cookie', [`refresh_token=${refreshToken}`])
        .expect(200);

      expect(refreshRes.body.access_token).toBeDefined();
      expect(refreshRes.body.id).toBe(userId);

      // 6. Use the new token
      const finalSession = await request(app)
        .get('/api/auth/current_session')
        .set('Authorization', `Bearer ${refreshRes.body.access_token}`)
        .expect(200);

      expect(finalSession.body.id).toBe(userId);
    });
  });

  describe('Edge cases', () => {
    it('Should handle empty cookies correctly', async () => {
      const res = await request(app)
        .get('/api/auth/refresh')
        .set('Cookie', [''])
        .expect(401);

      expect(res.body.message).toBe('Refresh token required');
    });

    it('Should handle empty Authorization headers correctly', async () => {
      const res = await request(app)
        .get('/api/auth/current_session')
        .set('Authorization', '')
        .expect(401);

      expect(res.body.message).toBe('No token provided');
    });

    it('Should create a user without a defined teacher/student role in DB', async () => {
      // Create a user without student/teacher
      const user = await prisma.user.create({
        data: {
          lastname: 'TEST',
          firstname: 'NoRole',
          username: 'norole_user',
          password: '$2b$10$abcdefghijk',
        }
      });

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      const res = await request(app)
        .get('/api/auth/current_session')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.role).toBe('unknown');
    });
  });
});