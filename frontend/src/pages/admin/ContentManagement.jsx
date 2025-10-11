import { useState, useEffect } from 'react';

export default function ContentManagement() {
  const [contents, setContents] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // TODO: Fetch actual content from API
    setContents([
      {
        id: 1,
        title: 'Homepage Banner',
        type: 'banner',
        status: 'published',
        lastModified: '2024-03-09'
      },
      {
        id: 2,
        title: 'About Us Page',
        type: 'page',
        status: 'draft',
        lastModified: '2024-03-08'
      },
      {
        id: 3,
        title: 'Summer Campaign',
        type: 'campaign',
        status: 'published',
        lastModified: '2024-03-07'
      }
    ]);
  }, []);

  const handleEdit = (content) => {
    setSelectedContent(content);
    setIsEditing(true);
  };

  const handleDelete = (contentId) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      // TODO: Implement actual delete logic
      setContents(contents.filter(content => content.id !== contentId));
    }
  };

  return (
    <div className="content-management">
      <div className="page-header">
        <h2>Content Management</h2>
        <button className="add-content-btn">Add New Content</button>
      </div>

      <div className="content-filters">
        <select className="filter-select">
          <option value="">All Types</option>
          <option value="banner">Banners</option>
          <option value="page">Pages</option>
          <option value="campaign">Campaigns</option>
        </select>

        <select className="filter-select">
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="content-grid">
        {contents.map(content => (
          <div key={content.id} className="content-card">
            <div className="content-header">
              <span className={`content-type ${content.type}`}>
                {content.type}
              </span>
              <span className={`content-status ${content.status}`}>
                {content.status}
              </span>
            </div>

            <div className="content-body">
              <h3>{content.title}</h3>
              <p className="last-modified">
                Last modified: {content.lastModified}
              </p>
            </div>

            <div className="content-actions">
              <button 
                onClick={() => handleEdit(content)}
                className="edit-btn"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(content.id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="edit-modal">
          {/* Modal content for editing content */}
          <h3>Edit Content</h3>
          {/* Add form fields here */}
        </div>
      )}
    </div>
  );
}
