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
    purchase_price DECIMAL(10,2) NOT NULL,
    selling_price DECIMAL(10,2) NOT NULL,
    min_stock_level INTEGER DEFAULT 0,
    current_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Закупки
CREATE TABLE purchases (
    id SERIAL PRIMARY KEY,
    supplier_id INTEGER REFERENCES suppliers(id) NOT NULL,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Позиции закупок
CREATE TABLE purchase_items (
    id SERIAL PRIMARY KEY,
    purchase_id INTEGER REFERENCES purchases(id) ON DELETE CASCADE NOT NULL,
    product_id INTEGER REFERENCES products(id) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED
);

-- Продажи
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    client_name VARCHAR(100),
    payment_method VARCHAR(20) DEFAULT 'cash'
);

-- Позиции продаж
CREATE TABLE sale_items (
    id SERIAL PRIMARY KEY,
    sale_id INTEGER REFERENCES sales(id) ON DELETE CASCADE NOT NULL,
    product_id INTEGER REFERENCES products(id) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED
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
('ООО "Кирпичный Двор"',  '+79157654321'),
('ИП Козлова (сантехника)',  '+79091112233'),
('ООО "МеталлПрофиль"',  '+79032223344'),
('ИП Федоров (электротовары)',  '+79163334455');

-- Заполнение таблицы товаров
INSERT INTO products (name, supplier_id, unit, purchase_price, selling_price, min_stock_level, current_quantity) VALUES
('Цемент М500', 1, 'мешок 50кг', 300.00, 450.00, 10, 100),
('Гипсокартон Knauf 12мм', 2, 'лист', 280.00, 400.00, 20, 50),
('Труба ППР 20мм', 5, 'метр', 85.00, 130.00, 50, 200),
('Кабель ВВГ 3х1.5', 7, 'метр', 45.00, 70.00, 30, 150),
('Перфоратор Makita HR2470', 3, 'шт', 5800.00, 8500.00, 2, 5),
('Краска водоэмульсионная белая', 1, 'банка 5л', 350.00, 550.00, 5, 20),
('Саморезы по дереву 3.5x45', 4, 'уп 100шт', 120.00, 180.00, 10, 30);

-- Заполнение таблицы закупок
INSERT INTO purchases (supplier_id, user_id, total_amount, purchase_date, notes) VALUES
(1, 1, 15000.00, '2023-01-15 09:30:00', 'Основные материалы'),
(5, 1, 5000.00, '2023-01-16 11:45:00', 'Сантехника'),
(3, 3, 12000.00, '2023-01-18 14:20:00', 'Инструменты'),
(2, 1, 8000.00, '2023-01-20 10:15:00', 'Гипсокартон'),
(7, 5, 3000.00, '2023-01-22 16:30:00', 'Электротовары'),
(4, 1, 2400.00, '2023-01-25 13:00:00', 'Крепеж'),
(1, 3, 9000.00, '2023-01-28 09:15:00', 'Краски и цемент');

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
INSERT INTO sales (user_id, total_amount, sale_date, client_name, payment_method) VALUES
(3, 1850.00, '2023-02-01 10:30:00', 'ООО "РемСтрой"', 'cash'),
(5, 1300.00, '2023-02-02 11:45:00', 'ИП Сергеев', 'card'),
(3, 4500.00, '2023-02-03 14:20:00', 'ООО "СтройГрад"', 'invoice'),
(5, 8500.00, '2023-02-05 16:30:00', 'ООО "СтройДом"', 'card'),
(3, 1200.00, '2023-02-06 13:00:00', 'ИП Новиков', 'cash');

-- Заполнение таблицы позиций продаж (исправлено - только sale_id от 1 до 5)
INSERT INTO sale_items (sale_id, product_id, quantity, unit_price) VALUES
(1, 1, 2, 450.00),
(1, 2, 1, 400.00),
(2, 3, 10, 130.00),
(3, 5, 1, 8500.00),
(4, 4, 30, 70.00),
(4, 7, 5, 180.00),
(5, 6, 2, 550.00),
(5, 1, 1, 450.00);