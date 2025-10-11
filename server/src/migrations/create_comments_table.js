const db = require('../config/database');

async function up() {
  const createCommentsTable = `
    CREATE TABLE IF NOT EXISTS comments (
      id INT PRIMARY KEY AUTO_INCREMENT,
      content_type VARCHAR(50) NOT NULL COMMENT 'journey, gallery, activity',
      content_id INT NOT NULL COMMENT 'ID of the content being commented on',
      user_id INT NOT NULL,
      parent_id INT NULL COMMENT 'For nested replies',
      comment TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_content (content_type, content_id),
      INDEX idx_user (user_id),
      INDEX idx_parent (parent_id),
      INDEX idx_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  const createReactionsTable = `
    CREATE TABLE IF NOT EXISTS reactions (
      id INT PRIMARY KEY AUTO_INCREMENT,
      content_type VARCHAR(50) NOT NULL COMMENT 'journey, gallery, activity, comment',
      content_id INT NOT NULL COMMENT 'ID of the content being reacted to',
      user_id INT NOT NULL,
      reaction_type VARCHAR(20) NOT NULL COMMENT 'like, love, laugh, wow, sad, angry',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE KEY unique_reaction (content_type, content_id, user_id),
      INDEX idx_content (content_type, content_id),
      INDEX idx_user (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  try {
    await db.execute(createCommentsTable);
    console.log('✅ Comments table created successfully');
    
    await db.execute(createReactionsTable);
    console.log('✅ Reactions table created successfully');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
}

async function down() {
  try {
    await db.execute('DROP TABLE IF EXISTS reactions');
    console.log('✅ Reactions table dropped');
    
    await db.execute('DROP TABLE IF EXISTS comments');
    console.log('✅ Comments table dropped');
  } catch (error) {
    console.error('❌ Error dropping tables:', error);
    throw error;
  }
}

module.exports = { up, down };
