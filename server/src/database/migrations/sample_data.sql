-- Insert sample roles
INSERT INTO roles (name, description) VALUES
('admin', 'Administrator dengan akses penuh'),
('member', 'Anggota tim regular'),
('contributor', 'Kontributor konten');

-- Insert sample users (password: password123)
INSERT INTO users (username, password, email, full_name, role_id, status) VALUES
('team_member', '$2b$10$YourHashedPasswordHere', 'member@pergimmikan.com', 'Team Member', 2, 'active'),
('contributor1', '$2b$10$YourHashedPasswordHere', 'contributor@pergimmikan.com', 'Content Contributor', 3, 'active');
