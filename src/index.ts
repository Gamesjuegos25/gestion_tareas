import { getTasksByStatus, closePool } from './db';

function printUsage() {
  console.log('Uso: npm run dev -- <estado>');
}

function parseArgs() {
  const args = process.argv.slice(2);
  return args[0] || undefined;
}

async function main() {
  const status = parseArgs();
  if (!status) {
    printUsage();
    process.exit(1);
  }

  try {
    const tasks = await getTasksByStatus(status);
    console.log(JSON.stringify(tasks, null, 2));
  } catch (e: any) {
    console.error('Error:', e.message || e);
  } finally {
    await closePool();
  }
}

main();
