```sql

insert into mydb.user_status (name) values ('Активный'), ('Заблокирован'), ('Ожидает подтверждения'), ('Удален');


insert into mydb.role (name, level, description) values 
('Пользователь', 1, 'Обычный пользователь, который может бронировать столики и оставлять отзывы.'),
('Постоянный клиент', 2, 'Клиент, который часто посещает ресторан и имеет доступ к бонусам.'),
('Премиальный клиент', 3, 'Особый статус клиента с правом на приоритетные бронирования.'),
('VIP клиент', 5, 'Клиент с максимальными привилегиями, включая эксклюзивные зоны.'),
('Администратор', 15, 'Полный доступ к управлению системой, включая бронирования, столики и пользователей.');


insert into mydb.user (username, email, password, name, surname, patronymic, phone, statusId) values
('juanito01', 'juanito01@mail.com', 'password123', 'Хуан', 'Гонсалес', 'Эрнандес', '+79010010001', 1),
('lupita02', 'lupita02@mail.com', 'password123', 'Лупита', 'Мендоза', 'Суарес', '+79010010002', 1),
('carlos03', 'carlos03@mail.com', 'password123', 'Карлос', 'Рамирес', 'Вега', '+79010010003', 1),
('maria04', 'maria04@mail.com', 'password123', 'Мария', 'Флорес', 'Гарсия', '+79010010004', 1),
('pedro05', 'pedro05@mail.com', 'password123', 'Педро', 'Мартинес', 'Ривера', '+79010010005', 1),
('isabel06', 'isabel06@mail.com', 'password123', 'Изабель', 'Моралес', 'Доминго', '+79010010006', 1),
('diego07', 'diego07@mail.com', 'password123', 'Диего', 'Кастро', 'Падилья', '+79010010007', 1),
('sofia08', 'sofia08@mail.com', 'password123', 'София', 'Хименес', 'Лопес', '+79010010008', 1),
('miguel09', 'miguel09@mail.com', 'password123', 'Мигель', 'Агилера', 'Крус', '+79010010009', 1),
('ana10', 'ana10@mail.com', 'password123', 'Ана', 'Фернандес', 'Кано', '+79010010010', 1),
('ricardo11', 'ricardo11@mail.com', 'password123', 'Рикардо', 'Ортис', 'Эспиноза', '+79010010011', 1),
('valeria12', 'valeria12@mail.com', 'password123', 'Валерия', 'Торрес', 'Муньос', '+79010010012', 1),
('pablo13', 'pablo13@mail.com', 'password123', 'Пабло', 'Гутьеррес', 'Молина', '+79010010013', 1),
('catalina14', 'catalina14@mail.com', 'password123', 'Каталина', 'Санчес', 'Камачо', '+79010010014', 1),
('emilio15', 'emilio15@mail.com', 'password123', 'Эмилио', 'Наварро', 'Леон', '+79010010015', 1),
('lucia16', 'lucia16@mail.com', 'password123', 'Лусия', 'Родригес', 'Гарсия', '+79010010016', 1),
('fernando17', 'fernando17@mail.com', 'password123', 'Фернандо', 'Луна', 'Медина', '+79010010017', 1),
('camila18', 'camila18@mail.com', 'password123', 'Камила', 'Кортес', 'Пенья', '+79010010018', 1),
('alejandro19', 'alejandro19@mail.com', 'password123', 'Алехандро', 'Сальвадор', 'Дуарте', '+79010010019', 1),
('elena20', 'elena20@mail.com', 'password123', 'Елена', 'Вильягра', 'Мендоса', '+79010010020', 1),
('jose21', 'jose21@mail.com', 'password123', 'Хосе', 'Кастильо', 'Тревиньо', '+79010010021', 1),
('paola22', 'paola22@mail.com', 'password123', 'Паола', 'Мадрид', 'Вальдес', '+79010010022', 1),
('victor23', 'victor23@mail.com', 'password123', 'Виктор', 'Галван', 'Армандо', '+79010010023', 1),
('natalia24', 'natalia24@mail.com', 'password123', 'Наталия', 'Артеага', 'Сепеда', '+79010010024', 1),
('raul25', 'raul25@mail.com', 'password123', 'Рауль', 'Солис', 'Хуарес', '+79010010025', 1),
('angelica26', 'angelica26@mail.com', 'password123', 'Анджелика', 'Бустаманте', 'Руис', '+79010010026', 1),
('julian27', 'julian27@mail.com', 'password123', 'Хулиан', 'Коронадо', 'Сантос', '+79010010027', 1),
('diana28', 'diana28@mail.com', 'password123', 'Диана', 'Хуарес', 'Кабрера', '+79010010028', 1),
('cesar29', 'cesar29@mail.com', 'password123', 'Сезар', 'Масаригос', 'Руис', '+79010010029', 1),
('miranda30', 'miranda30@mail.com', 'password123', 'Миранда', 'Баскес', 'Ортис', '+79010010030', 1);


insert into mydb.user_roles_role (userId, roleId) values
-- Пользователи с id 2-11 получают роль "Пользователь"
(2, 1),
(3, 1),
(4, 1),
(5, 1),
(6, 1),
(7, 1),
(8, 1),
(9, 1),
(10, 1),
(11, 1),

-- Пользователи с id 12-16 получают роли "Пользователь" и "Постоянный клиент"
(12, 1), (12, 2),
(13, 1), (13, 2),
(14, 1), (14, 2),
(15, 1), (15, 2),
(16, 1), (16, 2),

-- Пользователи с id 17-20 получают роли "Пользователь", "Постоянный клиент" и "Премиальный клиент"
(17, 1), (17, 2), (17, 3),
(18, 1), (18, 2), (18, 3),
(19, 1), (19, 2), (19, 3),
(20, 1), (20, 2), (20, 3),

-- Пользователи с id 21-25 получают роли "Пользователь", "Постоянный клиент", "Премиальный клиент" и "VIP клиент"
(21, 1), (21, 2), (21, 3), (21, 4),
(22, 1), (22, 2), (22, 3), (22, 4),
(23, 1), (23, 2), (23, 3), (23, 4),
(24, 1), (24, 2), (24, 3), (24, 4),
(25, 1), (25, 2), (25, 3), (25, 4),

-- Пользователи с id 26-31 получают роли "Пользователь" и "Администратор"
(26, 1), (26, 5),
(27, 1), (27, 5),
(28, 1), (28, 5),
(29, 1), (29, 5),
(30, 1), (30, 5),
(31, 1), (31, 5);

```