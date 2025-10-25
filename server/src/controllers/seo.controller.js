const SEO = require('../models/seo.model');

class SEOController {
  /**
   * Get SEO settings for a specific page (PUBLIC)
   * GET /api/seo/:pageType
   * GET /api/seo/:pageType/:pageId
   */
  async getSEO(req, res, next) {
    try {
      const { pageType, pageId } = req.params;
      
      const seo = await SEO.getByPage(pageType, pageId || null);
      
      if (!seo) {
        return res.status(404).json({
          error: 'SEO settings not found for this page'
        });
      }

      res.json(seo);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all SEO settings (ADMIN)
   * GET /api/admin/seo
   */
  async getAllSEO(req, res, next) {
    try {
      const seoSettings = await SEO.getAll();
      res.json(seoSettings);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create SEO setting (ADMIN)
   * POST /api/admin/seo
   */
  async createSEO(req, res, next) {
    try {
      const seo = await SEO.create(req.body);
      res.status(201).json({
        message: 'SEO setting created successfully',
        data: seo
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({
          error: 'SEO setting already exists for this page'
        });
      }
      next(error);
    }
  }

  /**
   * Update SEO setting (ADMIN)
   * PUT /api/admin/seo/:id
   */
  async updateSEO(req, res, next) {
    try {
      const { id } = req.params;
      const seo = await SEO.update(id, req.body);
      
      res.json({
        message: 'SEO setting updated successfully',
        data: seo
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete SEO setting (ADMIN)
   * DELETE /api/admin/seo/:id
   */
  async deleteSEO(req, res, next) {
    try {
      const { id } = req.params;
      await SEO.delete(id);
      
      res.json({
        message: 'SEO setting deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all SEO templates (ADMIN)
   * GET /api/admin/seo/templates
   */
  async getAllTemplates(req, res, next) {
    try {
      const templates = await SEO.getAllTemplates();
      res.json(templates);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update SEO template (ADMIN)
   * PUT /api/admin/seo/templates/:id
   */
  async updateTemplate(req, res, next) {
    try {
      const { id } = req.params;
      const template = await SEO.updateTemplate(id, req.body);
      
      res.json({
        message: 'SEO template updated successfully',
        data: template
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generate SEO from template (PUBLIC/ADMIN)
   * POST /api/seo/generate
   */
  async generateSEO(req, res, next) {
    try {
      const { templateName, variables } = req.body;
      
      if (!templateName || !variables) {
        return res.status(400).json({
          error: 'Template name and variables are required'
        });
      }

      const seo = await SEO.generateFromTemplate(templateName, variables);
      res.json(seo);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SEOController();
