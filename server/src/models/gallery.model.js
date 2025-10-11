const db = require('../config/database');

class GalleryModel {
  static async findAll() {
    const [galleries] = await db.query(`
      SELECT 
        g.id, g.caption, g.date, g.author, g.created_at,
        GROUP_CONCAT(DISTINCT gi.id, ':', gi.image_url) as images,
        GROUP_CONCAT(DISTINCT t.id, ':', t.name) as tags
      FROM galleries g
      LEFT JOIN gallery_images gi ON g.id = gi.gallery_id
      LEFT JOIN gallery_tags gt ON g.id = gt.gallery_id
      LEFT JOIN tags t ON gt.tag_id = t.id
      GROUP BY g.id
      ORDER BY g.date DESC
    `);

    return galleries.map(this.formatGalleryData);
  }

  static async findById(id) {
    const [gallery] = await db.query(`
      SELECT 
        g.id, g.caption, g.date, g.author, g.created_at,
        GROUP_CONCAT(DISTINCT gi.id, ':', gi.image_url) as images,
        GROUP_CONCAT(DISTINCT t.id, ':', t.name) as tags
      FROM galleries g
      LEFT JOIN gallery_images gi ON g.id = gi.gallery_id
      LEFT JOIN gallery_tags gt ON g.id = gt.gallery_id
      LEFT JOIN tags t ON gt.tag_id = t.id
      WHERE g.id = ?
      GROUP BY g.id
    `, [id]);

    return gallery[0] ? this.formatGalleryData(gallery[0]) : null;
  }

  static async create(connection, { caption, date, author }) {
    const [gallery] = await connection.query(
      'INSERT INTO galleries (caption, date, author) VALUES (?, ?, ?)',
      [caption, date, author]
    );
    return gallery.insertId;
  }

  static async update(connection, id, { caption, date, author }) {
    await connection.query(
      'UPDATE galleries SET caption = ?, date = ?, author = ? WHERE id = ?',
      [caption, date, author, id]
    );
  }

  static async delete(connection, id) {
    const [result] = await connection.query('DELETE FROM galleries WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async addImages(connection, galleryId, imageUrls) {
    if (!imageUrls.length) return;
    
    const imageValues = imageUrls.map(url => [galleryId, url]);
    await connection.query(
      'INSERT INTO gallery_images (gallery_id, image_url) VALUES ?',
      [imageValues]
    );
  }

  static async deleteImages(connection, imageIds) {
    if (!imageIds.length) return;
    
    const [images] = await connection.query(
      'SELECT image_url FROM gallery_images WHERE id IN (?)',
      [imageIds]
    );
    
    await connection.query(
      'DELETE FROM gallery_images WHERE id IN (?)',
      [imageIds]
    );

    return images;
  }

  static async getGalleryImages(connection, galleryId) {
    const [images] = await connection.query(
      'SELECT image_url FROM gallery_images WHERE gallery_id = ?',
      [galleryId]
    );
    return images;
  }

  static async deleteAllImages(connection, galleryId) {
    const [images] = await connection.query(
      'SELECT id, image_url FROM gallery_images WHERE gallery_id = ?',
      [galleryId]
    );
    
    if (images.length > 0) {
      await connection.query(
        'DELETE FROM gallery_images WHERE gallery_id = ?',
        [galleryId]
      );
    }
    
    return images;
  }

  static async updateTags(connection, galleryId, tagIds) {
    await connection.query(
      'DELETE FROM gallery_tags WHERE gallery_id = ?',
      [galleryId]
    );

    if (tagIds && tagIds.length > 0) {
      const tagValues = tagIds.map(tagId => [galleryId, tagId]);
      await connection.query(
        'INSERT INTO gallery_tags (gallery_id, tag_id) VALUES ?',
        [tagValues]
      );
    }
  }

  static formatGalleryData(gallery) {
    return {
      id: gallery.id,
      caption: gallery.caption,
      date: gallery.date,
      author: gallery.author,
      created_at: gallery.created_at,
      images: gallery.images ? gallery.images.split(',').map(img => {
        const [id, url] = img.split(':');
        return { id: parseInt(id), image_url: url };
      }) : [],
      tags: gallery.tags ? gallery.tags.split(',').map(tag => {
        const [id, name] = tag.split(':');
        return { id: parseInt(id), name };
      }) : []
    };
  }
}

class TagModel {
  static async findAll() {
    const [tags] = await db.query('SELECT * FROM tags ORDER BY name');
    return tags;
  }

  static async create(name) {
    const [result] = await db.query('INSERT INTO tags (name) VALUES (?)', [name]);
    return { id: result.insertId, name };
  }

  static async delete(id) {
    await db.query('DELETE FROM tags WHERE id = ?', [id]);
  }
}

module.exports = { GalleryModel, TagModel };
