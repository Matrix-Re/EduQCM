import { prisma } from '../src/config/database.js';

// Global configuration before all tests
beforeAll(async () => {
  // Connect to the test database
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_secret_key_for_testing_only';
  
  console.log('🔧 Configuration des tests...');
});

// Cleanup after each test
afterEach(async () => {
  try {
    // Clean tables in the correct order (FK constraints)
    await prisma.student.deleteMany();
    await prisma.teacher.deleteMany();
    await prisma.user.deleteMany();
  } catch (error) {
    console.log('Error during database cleanup:', error);
  }
});

// Close connection after all tests
afterAll(async () => {
  await prisma.$disconnect();
  console.log('✅ Tests completed, disconnected from the database');
});