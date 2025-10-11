const bcrypt = require('bcryptjs');

async function generateHash(password) {
    const hash = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hash);
}

generateHash('password123');
