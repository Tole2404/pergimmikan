# 🔧 SQL SYNTAX ERROR FIX

## ❌ ERROR:

```sql
CREATE`team_members_view` AS SELECT ...
```

**Error Message:**
```
#1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near '`team_members_view`   AS SELECT ...' at line 1
```

---

## 🔍 MASALAH:

1. **Missing `VIEW` keyword** - Harus `CREATE VIEW` bukan `CREATE`
2. **Missing space** - Tidak ada spasi antara `CREATE` dan backtick
3. **GROUP BY incomplete** - Harus include semua non-aggregated columns

---

## ✅ SOLUSI:

### **SQL yang Benar:**

```sql
-- Drop existing view if exists
DROP VIEW IF EXISTS `team_members_view`;

-- Create the view
CREATE VIEW `team_members_view` AS
SELECT 
  `t`.`id` AS `id`,
  `t`.`name` AS `name`,
  `t`.`role` AS `role`,
  `t`.`image_url` AS `image_url`,
  `t`.`description` AS `description`,
  `t`.`status` AS `status`,
  MAX(CASE WHEN `sm`.`platform` = 'linkedin' THEN `sm`.`url` END) AS `linkedin`,
  MAX(CASE WHEN `sm`.`platform` = 'github' THEN `sm`.`url` END) AS `github`,
  MAX(CASE WHEN `sm`.`platform` = 'instagram' THEN `sm`.`url` END) AS `instagram`
FROM 
  `teams` `t`
LEFT JOIN 
  `social_media` `sm` ON `t`.`id` = `sm`.`team_id`
GROUP BY 
  `t`.`id`,
  `t`.`name`,
  `t`.`role`,
  `t`.`image_url`,
  `t`.`description`,
  `t`.`status`;
```

---

## 📝 PENJELASAN:

### **1. CREATE VIEW Syntax:**
```sql
CREATE VIEW view_name AS
SELECT ...
```

**Bukan:**
```sql
CREATE view_name AS  -- ❌ SALAH!
```

---

### **2. GROUP BY Rules:**

**MariaDB/MySQL mengharuskan semua kolom non-aggregated ada di GROUP BY:**

```sql
SELECT 
  t.id,           -- Non-aggregated
  t.name,         -- Non-aggregated
  MAX(sm.url)     -- Aggregated
FROM teams t
GROUP BY 
  t.id,           -- ✅ Harus ada
  t.name;         -- ✅ Harus ada
```

**Jika tidak:**
```
Error: Expression #2 of SELECT list is not in GROUP BY clause
```

---

### **3. CASE WHEN dengan MAX:**

**Untuk pivot social media:**
```sql
MAX(CASE WHEN sm.platform = 'linkedin' THEN sm.url END) AS linkedin
```

**Cara kerja:**
- Filter rows where platform = 'linkedin'
- Get the URL
- MAX() untuk aggregate (karena GROUP BY)

---

## 🎯 CARA JALANKAN:

### **Option 1: phpMyAdmin**

1. **Buka phpMyAdmin**
2. **Select database:** `db_gimmik3`
3. **Go to SQL tab**
4. **Paste SQL:**
   ```sql
   DROP VIEW IF EXISTS `team_members_view`;
   
   CREATE VIEW `team_members_view` AS
   SELECT 
     `t`.`id` AS `id`,
     `t`.`name` AS `name`,
     `t`.`role` AS `role`,
     `t`.`image_url` AS `image_url`,
     `t`.`description` AS `description`,
     `t`.`status` AS `status`,
     MAX(CASE WHEN `sm`.`platform` = 'linkedin' THEN `sm`.`url` END) AS `linkedin`,
     MAX(CASE WHEN `sm`.`platform` = 'github' THEN `sm`.`url` END) AS `github`,
     MAX(CASE WHEN `sm`.`platform` = 'instagram' THEN `sm`.`url` END) AS `instagram`
   FROM 
     `teams` `t`
   LEFT JOIN 
     `social_media` `sm` ON `t`.`id` = `sm`.`team_id`
   GROUP BY 
     `t`.`id`,
     `t`.`name`,
     `t`.`role`,
     `t`.`image_url`,
     `t`.`description`,
     `t`.`status`;
   ```
5. **Click "Go"**

---

### **Option 2: MySQL Command Line**

```bash
mysql -u root -p db_gimmik3 < create_team_members_view.sql
```

---

### **Option 3: Node.js Script**

```javascript
const mysql = require('mysql2/promise');

async function createView() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_gimmik3'
  });

  const sql = `
    DROP VIEW IF EXISTS team_members_view;
    
    CREATE VIEW team_members_view AS
    SELECT 
      t.id,
      t.name,
      t.role,
      t.image_url,
      t.description,
      t.status,
      MAX(CASE WHEN sm.platform = 'linkedin' THEN sm.url END) AS linkedin,
      MAX(CASE WHEN sm.platform = 'github' THEN sm.url END) AS github,
      MAX(CASE WHEN sm.platform = 'instagram' THEN sm.url END) AS instagram
    FROM teams t
    LEFT JOIN social_media sm ON t.id = sm.team_id
    GROUP BY t.id, t.name, t.role, t.image_url, t.description, t.status;
  `;

  await connection.query(sql);
  console.log('✅ View created successfully!');
  
  await connection.end();
}

createView();
```

---

## 🧪 TEST VIEW:

### **1. Check if view exists:**
```sql
SHOW FULL TABLES WHERE Table_type = 'VIEW';
```

**Expected output:**
```
+---------------------------+------------+
| Tables_in_db_gimmik3      | Table_type |
+---------------------------+------------+
| team_members_view         | VIEW       |
+---------------------------+------------+
```

---

### **2. Query the view:**
```sql
SELECT * FROM team_members_view;
```

**Expected output:**
```
+----+------------------+-------------+------------------+------------------+--------+-------------------------+-------------------------+-------------------------+
| id | name             | role        | image_url        | description      | status | linkedin                | github                  | instagram               |
+----+------------------+-------------+------------------+------------------+--------+-------------------------+-------------------------+-------------------------+
| 1  | John Doe         | Developer   | /images/john.jpg | Full Stack Dev   | active | linkedin.com/in/john    | github.com/john         | instagram.com/john      |
| 2  | Jane Smith       | Designer    | /images/jane.jpg | UI/UX Designer   | active | linkedin.com/in/jane    | NULL                    | instagram.com/jane      |
+----+------------------+-------------+------------------+------------------+--------+-------------------------+-------------------------+-------------------------+
```

---

### **3. Check view definition:**
```sql
SHOW CREATE VIEW team_members_view;
```

---

## 📊 CARA KERJA VIEW:

### **Before (Without View):**

**Query setiap kali butuh data:**
```sql
SELECT 
  t.id,
  t.name,
  MAX(CASE WHEN sm.platform = 'linkedin' THEN sm.url END) AS linkedin,
  MAX(CASE WHEN sm.platform = 'github' THEN sm.url END) AS github,
  MAX(CASE WHEN sm.platform = 'instagram' THEN sm.url END) AS instagram
FROM teams t
LEFT JOIN social_media sm ON t.id = sm.team_id
GROUP BY t.id, t.name;
```

---

### **After (With View):**

**Query simple:**
```sql
SELECT * FROM team_members_view;
```

**Benefits:**
- ✅ Cleaner code
- ✅ Reusable
- ✅ Easier to maintain
- ✅ Consistent data structure

---

## 🎨 USE CASE:

### **1. Get All Team Members:**
```sql
SELECT * FROM team_members_view WHERE status = 'active';
```

---

### **2. Get Team Member by ID:**
```sql
SELECT * FROM team_members_view WHERE id = 1;
```

---

### **3. Get Team Members with LinkedIn:**
```sql
SELECT * FROM team_members_view WHERE linkedin IS NOT NULL;
```

---

### **4. Get Team Members by Role:**
```sql
SELECT * FROM team_members_view WHERE role = 'Developer';
```

---

## 💻 USE IN API:

### **Express.js Example:**

```javascript
// routes/team.js
router.get('/team', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM team_members_view WHERE status = ?', ['active']);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/team/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM team_members_view WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Team member not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## 🔄 UPDATE VIEW:

**Jika perlu update view:**

```sql
-- Drop old view
DROP VIEW IF EXISTS team_members_view;

-- Create new view with changes
CREATE VIEW team_members_view AS
SELECT 
  t.id,
  t.name,
  t.role,
  t.image_url,
  t.description,
  t.status,
  t.created_at,  -- ✅ Added new column
  MAX(CASE WHEN sm.platform = 'linkedin' THEN sm.url END) AS linkedin,
  MAX(CASE WHEN sm.platform = 'github' THEN sm.url END) AS github,
  MAX(CASE WHEN sm.platform = 'instagram' THEN sm.url END) AS instagram,
  MAX(CASE WHEN sm.platform = 'twitter' THEN sm.url END) AS twitter  -- ✅ Added new platform
FROM teams t
LEFT JOIN social_media sm ON t.id = sm.team_id
GROUP BY t.id, t.name, t.role, t.image_url, t.description, t.status, t.created_at;
```

---

## ⚠️ COMMON ERRORS:

### **Error 1: Column not in GROUP BY**
```
Expression #2 of SELECT list is not in GROUP BY clause
```

**Fix:** Add all non-aggregated columns to GROUP BY

---

### **Error 2: View already exists**
```
Table 'team_members_view' already exists
```

**Fix:** Use `DROP VIEW IF EXISTS` first

---

### **Error 3: Table doesn't exist**
```
Table 'db_gimmik3.teams' doesn't exist
```

**Fix:** Make sure tables exist before creating view

---

## ✅ CHECKLIST:

- [ ] Tables exist (teams, social_media)
- [ ] Run DROP VIEW IF EXISTS
- [ ] Run CREATE VIEW with correct syntax
- [ ] Test with SELECT * FROM view
- [ ] Verify data is correct
- [ ] Update API to use view

---

## 🎉 HASIL AKHIR:

**View created successfully!**

**Now you can:**
- ✅ Query team members with social media in one query
- ✅ Cleaner API code
- ✅ Consistent data structure
- ✅ Easy to maintain

---

**📁 File:** `server/src/database/create_team_members_view.sql`

**Run in phpMyAdmin or MySQL CLI!**
