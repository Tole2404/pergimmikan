const bcrypt = require('bcryptjs');

async function generateHash(password) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  console.log('Password:', password);
  console.log('Generated hash:', hash);
  return hash;
}

// Generate hash untuk password 'admin123'
generateHash('admin123').then(hash => {
  console.log('\nCopy hash ini ke SQL migration:');
  console.log(hash);
});
