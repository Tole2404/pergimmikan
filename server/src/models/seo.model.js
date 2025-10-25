const db = require('../config/database');

class SEO {
  /**
   * Get SEO settings for a specific page
   * @param {string} pageType - Type of page (home, team, journey, etc)
   * @param {number|null} pageId - Specific page ID (optional)
   */
  static async getByPage(pageType, pageId = null) {
    try {
      const query = pageId
        ? 'SELECT * FROM seo_settings WHERE page_type = ? AND page_id = ? AND is_active = 1'
        : 'SELECT * FROM seo_settings WHERE page_type = ? AND page_id IS NULL AND is_active = 1';
      
      const params = pageId ? [pageType, pageId] : [pageType];
      
      console.log('🔍 SEO Model Query:', {
        pageType,
        pageId,
        query,
        params
      });
      
      const [rows] = await db.query(query, params);
      
      console.log('📊 SEO Model Result:', {
        found: rows.length > 0,
        rowCount: rows.length,
        hasKeywords: !!rows[0]?.keywords,
        keywordsLength: rows[0]?.keywords?.length || 0,
        isActive: rows[0]?.is_active
      });
      
      return rows[0] || null;
    } catch (error) {
      console.error('❌ SEO Model Error:', error);
      throw error;
    }
  }

  /**
   * Get all SEO settings (for admin)
   */
  static async getAll() {
    try {
      const [rows] = await db.query(`
        SELECT * FROM seo_settings 
        ORDER BY page_type, page_id
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create new SEO setting
   */
  static async create(data) {
    try {
      const {
        page_type,
        page_id,
        title,
        description,
        keywords,
        og_title,
        og_description,
        og_image,
        twitter_title,
        twitter_description,
        twitter_image,
        canonical_url,
        robots,
        structured_data
      } = data;

      const [result] = await db.query(`
        INSERT INTO seo_settings 
        (page_type, page_id, title, description, keywords, og_title, og_description, 
         og_image, twitter_title, twitter_description, twitter_image, canonical_url, 
         robots, structured_data)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        page_type, page_id, title, description, keywords, og_title, og_description,
        og_image, twitter_title, twitter_description, twitter_image, canonical_url,
        robots || 'index, follow', structured_data ? JSON.stringify(structured_data) : null
      ]);

      return { id: result.insertId, ...data };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update SEO setting
   */
  static async update(id, data) {
    try {
      const {
        title,
        description,
        keywords,
        og_title,
        og_description,
        og_image,
        twitter_title,
        twitter_description,
        twitter_image,
        canonical_url,
        robots,
        structured_data,
        is_active
      } = data;

      await db.query(`
        UPDATE seo_settings 
        SET title = ?, description = ?, keywords = ?, og_title = ?, og_description = ?,
            og_image = ?, twitter_title = ?, twitter_description = ?, twitter_image = ?,
            canonical_url = ?, robots = ?, structured_data = ?, is_active = ?
        WHERE id = ?
      `, [
        title, description, keywords, og_title, og_description, og_image,
        twitter_title, twitter_description, twitter_image, canonical_url,
        robots, structured_data ? JSON.stringify(structured_data) : null,
        is_active !== undefined ? is_active : true,
        id
      ]);

      return { id, ...data };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete SEO setting
   */
  static async delete(id) {
    try {
      await db.query('DELETE FROM seo_settings WHERE id = ?', [id]);
      return { id };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get SEO template
   */
  static async getTemplate(templateName) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM seo_templates WHERE template_name = ?',
        [templateName]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Generate SEO from template
   * @param {string} templateName - Template name
   * @param {object} variables - Variables to replace in template
   */
  static async generateFromTemplate(templateName, variables) {
    try {
      const template = await this.getTemplate(templateName);
      if (!template) {
        throw new Error(`Template ${templateName} not found`);
      }

      // Replace variables in templates
      let title = template.title_template;
      let description = template.description_template;
      let keywords = template.keywords_template;

      Object.keys(variables).forEach(key => {
        const regex = new RegExp(`{${key}}`, 'g');
        title = title.replace(regex, variables[key] || '');
        description = description.replace(regex, variables[key] || '');
        keywords = keywords.replace(regex, variables[key] || '');
      });

      return {
        title,
        description,
        keywords
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all templates (for admin)
   */
  static async getAllTemplates() {
    try {
      const [rows] = await db.query('SELECT * FROM seo_templates');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update template
   */
  static async updateTemplate(id, data) {
    try {
      const { title_template, description_template, keywords_template } = data;
      
      await db.query(`
        UPDATE seo_templates 
        SET title_template = ?, description_template = ?, keywords_template = ?
        WHERE id = ?
      `, [title_template, description_template, keywords_template, id]);

      return { id, ...data };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = SEO;
