-- Создаем таблицы
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20)
);

-- Поставщики
CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Товары
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    supplier_id INTEGER REFERENCES suppliers(id) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    selling_price DECIMAL(10,2) NOT NULL,
    current_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Закупки
CREATE TABLE purchases (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Позиции закупок
CREATE TABLE purchase_items (
    id SERIAL PRIMARY KEY,
    purchase_id INTEGER REFERENCES purchases(id) ON DELETE CASCADE NOT NULL,
    product_id INTEGER REFERENCES products(id) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL
);

-- Продажи
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    client_name VARCHAR(100)
);

-- Позиции продаж
CREATE TABLE sale_items (
    id SERIAL PRIMARY KEY,
    sale_id INTEGER REFERENCES sales(id) ON DELETE CASCADE NOT NULL,
    product_id INTEGER REFERENCES products(id) NOT NULL,
    quantity INTEGER NOT NULL
);

-- Заполнение таблицы пользователей (пароли захешированы)
INSERT INTO users (username, password_hash, full_name, role) VALUES
('manager1', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Иванова Мария', 'purchaser'),
('seller1', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Петров Алексей', 'seller'),
('manager2', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Сидорова Ольга', 'purchaser'),
('seller2', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Кузнецов Дмитрий', 'seller'),
('manager3', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Федорова Анна', 'purchaser'),
('seller3', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Николаев Иван', 'seller');

-- Заполнение таблицы поставщиков
INSERT INTO suppliers (name, phone) VALUES
('ООО "СтройМатериалы"', '+79161234567'),
('ИП Петров', '+79031234567'),
('Компания "СтройРесурс"', '+79219876543'),
('ООО "Кирпичный Двор"', '+79157654321'),
('ИП Козлова (сантехника)', '+79091112233'),
('ООО "МеталлПрофиль"', '+79032223344'),
('ИП Федоров (электротовары)', '+79163334455');

-- Заполнение таблицы товаров
INSERT INTO products (name, supplier_id, unit, selling_price, current_quantity) VALUES
('Цемент М500', 1, 'мешок 50кг', 450.00, 100),
('Гипсокартон Knauf 12мм', 2, 'лист', 400.00, 50),
('Труба ППР 20мм', 5, 'метр', 130.00, 200),
('Кабель ВВГ 3х1.5', 7, 'метр', 70.00, 150),
('Перфоратор Makita HR2470', 3, 'шт', 8500.00, 5),
('Краска водоэмульсионная белая', 1, 'банка 5л', 550.00, 20),
('Саморезы по дереву 3.5x45', 4, 'уп 100шт', 180.00, 30);

-- Заполнение таблицы закупок
INSERT INTO purchases (user_id, purchase_date) VALUES
(1, '2023-01-15 09:30:00'),
(1, '2023-01-16 11:45:00'),
(3, '2023-01-18 14:20:00'),
(1, '2023-01-20 10:15:00'),
(5, '2023-01-22 16:30:00'),
(1, '2023-01-25 13:00:00'),
(3, '2023-01-28 09:15:00');

-- Заполнение таблицы позиций закупок
INSERT INTO purchase_items (purchase_id, product_id, quantity, unit_price) VALUES
(1, 1, 30, 290.00),
(1, 6, 20, 340.00),
(2, 3, 50, 80.00),
(3, 5, 2, 5600.00),
(4, 2, 25, 270.00),
(5, 4, 60, 42.00),
(6, 7, 20, 110.00),
(7, 1, 20, 290.00),
(7, 6, 10, 340.00);

-- Заполнение таблицы продаж
INSERT INTO sales (user_id, sale_date, client_name) VALUES
(2, '2023-02-01 10:30:00', 'ООО "РемСтрой"'),
(4, '2023-02-02 11:45:00', 'ИП Сергеев'),
(2, '2023-02-03 14:20:00', 'ООО "СтройГрад"'),
(4, '2023-02-05 16:30:00', 'ООО "СтройДом"'),
(6, '2023-02-06 13:00:00', 'ИП Новиков');

-- Заполнение таблицы позиций продаж
INSERT INTO sale_items (sale_id, product_id, quantity) VALUES
(1, 1, 2),
(1, 2, 1),
(2, 3, 10),
(3, 5, 1),
(4, 4, 30),
(4, 7, 5),
(5, 6, 2),
(5, 1, 1);