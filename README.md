# 🎮 Tic Tac Toe

Игра "Крестики-нолики" с серверной логикой на Django и REST API.

---

# 📌 Описание проекта

Проект представляет собой веб-реализацию классической игры "Крестики-нолики" для двух игроков.  
Игроки по очереди делают ходы, система автоматически определяет исход игры.

Дополнительно реализованы:
- история завершённых игр
- административная панель
- REST API для взаимодействия с фронтендом

---

# 🧰 Технологический стек

## Backend
- Python 3.x
- Django
- Django REST Framework (DRF)

## Frontend
- HTML5
- CSS3
- JavaScript

## Database
- SQLite (по умолчанию Django)

---

# 🏗 Архитектура

Проект реализован по архитектурному паттерну **MVC (Model–View–Controller)**:

- **Model** — данные игры (Game)
- **View** — REST API + HTML интерфейс
- **Controller** — Django views и маршрутизация

---

# 🎮 Основной функционал

- создание игры для двух игроков
- ввод имён игроков
- случайный выбор игрока для первого хода
- проверка победных комбинаций
- определение ничьи
- отображение истории игр
- административная панель Django

---

# ⚙️ Установка и запуск

## 1. Клонирование проекта
```bash
git clone https://github.com/Sleepless-Artery/tic-tac-toe.git
cd tic_tac_toe
```

## 2. Установка зависимостей
```bash
pip install -r requirements.txt
```

## 3. Применение миграций
```bash
python manage.py makemigrations
python manage.py migrate
```

## 4. Создание администратора
```bash
python manage.py createsuperuser
```

## 5. Запуск
```bash
python manage.py runserver
```

# 🌐 Доступ к приложению

## 🎮 Главная страница
http://127.0.0.1:8000/

## ⚙️ Админ-панель
http://127.0.0.1:8000/admin/

## 🔌 API
http://127.0.0.1:8000/api/


# 📡 API endpoints
- POST /api/games/ — создать игру
- POST /api/games/{gameId}/move/ — сделать ход
- GET /api/games/history/ — история игр
- GET /api/games/stats/ — статистика