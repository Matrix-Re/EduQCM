// tests/setup.js
import { prisma } from '../src/config/database.js';

// Configuration globale avant tous les tests
beforeAll(async () => {
  // Connexion à la base de données de test
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_secret_key_for_testing_only';
  
  console.log('🔧 Configuration des tests...');
});

// Nettoyage après chaque test
afterEach(async () => {
  try {
    // Nettoyer les tables dans le bon ordre (contraintes FK)
    await prisma.student.deleteMany();
    await prisma.teacher.deleteMany();
    await prisma.user.deleteMany();
  } catch (error) {
    console.log('Erreur lors du nettoyage de la base de données:', error);
  }
});

// Fermeture après tous les tests
afterAll(async () => {
  await prisma.$disconnect();
  console.log('✅ Tests terminés, déconnexion de la base de données');
});