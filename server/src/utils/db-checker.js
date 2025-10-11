// Script sederhana untuk memeriksa struktur database
const db = require('../config/database');

async function checkTableStructure() {
  try {
    console.log("Checking tbl_loginadmin structure:");
    const [adminColumns] = await db.execute('SHOW COLUMNS FROM tbl_loginadmin');
    console.log(adminColumns);
    
    // Cek apakah ada user di tabel admin
    console.log("\nChecking tbl_loginadmin data:");
    const [adminRows] = await db.execute('SELECT id, username, role, status FROM tbl_loginadmin LIMIT 5');
    console.log(adminRows);
    
    // Done
    console.log("\nDatabase check completed.");
    process.exit(0);
  } catch (err) {
    console.error("Error checking database:", err);
    process.exit(1);
  }
}

checkTableStructure();
