const { GalleryModel, TagModel } = require('../models/gallery.model');
const ApiError = require('../utils/apiError');
const db = require('../config/database');
const fs = require('fs').promises;
const path = require('path');
const NotificationHelper = require('../utils/notificationHelper');

class GalleryController {
  // Helper function to delete image file
  async #deleteImageFile(imagePath) {
    try {
      await fs.unlink(path.join(__dirname, '../../public', imagePath));
    } catch (error) {
      console.error('Error deleting image file:', error);
    }
  }

  // Get all galleries with their images and tags
  async getAllGalleries(req, res, next) {
    try {
      const galleries = await GalleryModel.findAll();
      res.json(galleries);
    } catch (error) {
      next(error);
    }
  }

  // Get single gallery by ID
  async getGalleryById(req, res, next) {
    try {
      const gallery = await GalleryModel.findById(req.params.id);
      
      if (!gallery) {
        throw new ApiError(404, 'Gallery not found');
      }

      res.json(gallery);
    } catch (error) {
      next(error);
    }
  }

  // Create new gallery
  async createGallery(req, res, next) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const { caption, date, author, tags } = req.body;
      const files = req.files;

      // Create gallery
      const galleryId = await GalleryModel.create(connection, { caption, date, author });

      // Add images
      if (files && files.length > 0) {
        const imageUrls = files.map(file => '/images/gallery/' + file.filename);
        await GalleryModel.addImages(connection, galleryId, imageUrls);
      }

      // Add tags
      if (tags && tags.length > 0) {
        await GalleryModel.updateTags(connection, galleryId, tags);
      }

      await connection.commit();
      
      const newGallery = await GalleryModel.findById(galleryId);
      
      // Send notification to all users
      const photoCount = files ? files.length : 0;
      if (photoCount > 0) {
        NotificationHelper.notifyNewGallery(photoCount)
          .catch(err => console.error('Failed to send notification:', err));
      }
      
      res.status(201).json(newGallery);
    } catch (error) {
      await connection.rollback();
      next(error);
    } finally {
      connection.release();
    }
  }

  // Update gallery
  async updateGallery(req, res, next) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const { id } = req.params;
      const { caption, date, author, tags, deletedImages, keepExistingImages } = req.body;
      const files = req.files;

      // Update basic info
      await GalleryModel.update(connection, id, { caption, date, author });

      // Handle image updates
      if (files && files.length > 0) {
        // If there are new images and keepExistingImages is not set to true
        // Delete all existing images for this gallery
        if (keepExistingImages !== 'true') {
          const imagesToDelete = await GalleryModel.deleteAllImages(connection, id);
          // Delete physical files
          for (const image of imagesToDelete) {
            await this.#deleteImageFile(image.image_url);
          }
        }
        
        // Add new images
        const imageUrls = files.map(file => '/images/gallery/' + file.filename);
        await GalleryModel.addImages(connection, id, imageUrls);
      } 
      // If specific images are flagged for deletion
      else if (deletedImages && deletedImages.length > 0) {
        const imagesToDelete = await GalleryModel.deleteImages(connection, deletedImages);
        // Delete physical files
        for (const image of imagesToDelete) {
          await this.#deleteImageFile(image.image_url);
        }
      }

      // Update tags
      await GalleryModel.updateTags(connection, id, tags);

      await connection.commit();
      
      const updatedGallery = await GalleryModel.findById(id);
      res.json(updatedGallery);
    } catch (error) {
      await connection.rollback();
      next(error);
    } finally {
      connection.release();
    }
  }

  // Delete gallery
  async deleteGallery(req, res, next) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const { id } = req.params;

      // Get images to delete
      const images = await GalleryModel.getGalleryImages(connection, id);

      // Delete physical files
      for (const image of images) {
        await this.#deleteImageFile(image.image_url);
      }

      // Delete gallery (will cascade delete images and tags)
      const deleted = await GalleryModel.delete(connection, id);
      
      if (!deleted) {
        throw new ApiError(404, 'Gallery not found');
      }

      await connection.commit();
      res.status(204).send();
    } catch (error) {
      await connection.rollback();
      next(error);
    } finally {
      connection.release();
    }
  }

  // Get all tags
  async getAllTags(req, res, next) {
    try {
      const tags = await TagModel.findAll();
      res.json(tags);
    } catch (error) {
      next(error);
    }
  }

  // Create new tag
  async createTag(req, res, next) {
    try {
      const { name } = req.body;
      const tag = await TagModel.create(name);
      res.status(201).json(tag);
    } catch (error) {
      next(error);
    }
  }

  // Delete tag
  async deleteTag(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await TagModel.delete(id);
      
      if (!deleted) {
        throw new ApiError(404, 'Tag not found');
      }
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new GalleryController();
