/**
 * CLI script to seed component libraries into database
 * Usage: npx tsx scripts/seed-libraries.ts [--dry-run]
 */

import { seedAllLibraries } from '../lib/seedComponentLibrary.js';

const dryRun = process.argv.includes('--dry-run');

async function main() {
  try {
    const result = await seedAllLibraries(dryRun);
    
    if (result.failed > 0) {
      console.error('\n❌ Seeding completed with errors');
      process.exit(1);
    } else {
      console.log('\n✅ Seeding completed successfully!');
      process.exit(0);
    }
  } catch (error) {
    console.error('\n💥 Fatal error during seeding:', error);
    process.exit(1);
  }
}

main();
