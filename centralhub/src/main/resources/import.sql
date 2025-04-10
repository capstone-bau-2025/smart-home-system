
-- add default roles
MERGE INTO roles (id, name, description) KEY (id) VALUES (1, 'ADMIN', 'Administrator role');
MERGE INTO roles (id, name, description) KEY (id) VALUES (2, 'USER', 'Default user role');
MERGE INTO roles (id, name, description) KEY (id) VALUES (3, 'GUEST', 'Guest user role');
