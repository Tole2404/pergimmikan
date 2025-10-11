const db = require('../config/database');
const fs = require('fs');
const path = require('path');

async function createSavingsTable() {
  try {
    console.log('Checking if savings table exists...');
    
    // Check if table exists
    const [tables] = await db.execute("SHOW TABLES LIKE 'savings'");
    const tableExists = tables.length > 0;
    
    if (tableExists) {
      console.log('Savings table already exists.');
    } else {
      console.log('Savings table does not exist. Creating it now...');
      
      // Read the SQL file
      const sqlPath = path.join(__dirname, '..', 'database', 'savings_table.sql');
      const sql = fs.readFileSync(sqlPath, 'utf8');
      
      // Split and execute each statement
      const statements = sql.split(';').filter(stmt => stmt.trim());
      
      for (const statement of statements) {
        if (statement.trim()) {
          await db.execute(statement);
          console.log('Executed SQL statement.');
        }
      }
      
      console.log('Savings table created successfully.');
      
      // Insert dummy data
      console.log('Inserting dummy data...');
      const dummyPath = path.join(__dirname, '..', 'database', 'savings_dummy_data.sql');
      if (fs.existsSync(dummyPath)) {
        const dummySql = fs.readFileSync(dummyPath, 'utf8');
        await db.execute(dummySql);
        console.log('Dummy data inserted successfully.');
      } else {
        console.log('No dummy data file found.');
      }
    }
    
    console.log('Done!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

createSavingsTable();
