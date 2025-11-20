#!/usr/bin/env node

/**
 * Generate password hashes for database recovery
 * Run: node generate-passwords.js
 */

import bcrypt from 'bcryptjs';

const passwords = [
  { username: 'admin', password: 'admin123', role: 'administrator' },
  { username: 'doctor01', password: 'doctor123', role: 'doctor' },
  { username: 'nurse01', password: 'nurse123', role: 'nurse' },
  { username: 'reception01', password: 'reception123', role: 'receptionist' },
  { username: 'accountant01', password: 'accountant123', role: 'accountant' }
];

console.log('🔐 Generating password hashes...\n');

async function generateHashes() {
  for (const user of passwords) {
    const hash = await bcrypt.hash(user.password, 10);
    console.log(`Username: ${user.username}`);
    console.log(`Password: ${user.password}`);
    console.log(`Hash: ${hash}`);
    console.log(`Role: ${user.role}`);
    console.log('');
  }

  console.log('\n✅ Copy these hashes to RECOVERY_FOR_PGADMIN.sql');
  console.log('Replace the $2a$10$YourHashedPasswordHere1, etc.');
}

generateHashes().catch(console.error);
