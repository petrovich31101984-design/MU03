# 🚀 Быстрый старт: Google Sheets для "МедУчёт"

## ⚡ За 5 минут

### 1. Создайте Google таблицу

1. Откройте [Google Sheets](https://sheets.google.com) → **+** Новая таблица
2. Назовите её **"МедУчёт - База данных"**

### 2. Настройте Apps Script

1. **Расширения → Apps Script**
2. Скопируйте код из файла `google-apps-script.js`
3. Сохраните (Ctrl+S)
4. Нажмите ▶ → выберите `createDatabase` → **Выполнить**
5. Разрешите доступ

### 3. Разверните как веб-приложение

1. **Развернуть → Новое развёртывание**
2. Тип: **Веб-приложение**
3. Доступ: **Все**
4. Скопируйте URL

### 4. Подключите к приложению

В файле `src/services/googleSheetsApi.ts` замените:
```typescript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/ВАШ_URL/exec';
```

### 5. Готово! 🎉

---

## 📁 Структура файлов

```
📦 Проект
├── 📄 GOOGLE_SHEETS_DATABASE.md    # Полная документация по структуре БД
├── 📄 INTEGRATION_GUIDE.md         # Подробное руководство по интеграции
├── 📄 QUICK_START.md               # Этот файл (быстрый старт)
├── 📄 google-apps-script.js        # Скрипт для Google Apps Script
├── 📂 data/                        # CSV-файлы с данными
│   ├── employees.csv               # Сотрудники
│   ├── nomenclature.csv            # Номенклатура
│   ├── price_history.csv           # История цен
│   ├── income.csv                  # Приходы
│   ├── patients.csv                # Пациенты
│   ├── expenses.csv                # Расходы
│   ├── initial_stock.csv           # Начальные остатки
│   ├── returns.csv                 # Возвраты
│   ├── messages.csv                # Сообщения
│   ├── journal.csv                 # Журнал изменений
│   └── notifications.csv           # Уведомления
└── 📂 src/services/
    └── googleSheetsApi.ts          # API-сервис для React
```

---

## 📊 Листы Google таблицы

| # | Лист | Описание | Записей |
|---|------|----------|---------|
| 1 | Сотрудники | Данные сотрудников | 30 |
| 2 | Номенклатура | Лекарства, оборудование, расходники | 20 |
| 3 | История цен | Изменения цен | 17 |
| 4 | Приходы | Приходы денег сотрудникам | 5 |
| 5 | Пациенты | Данные пациентов | 10 |
| 6 | Расходы | Расход материалов | 10 |
| 7 | Начальные остатки | Остатки на начало | 16 |
| 8 | Возвраты | Возвраты материалов | 10 |
| 9 | Сообщения | Переписка | 10 |
| 10 | Журнал | История изменений | 6 |
| 11 | Уведомления | Системные уведомления | 6 |

---

## 🔗 Связи между данными

```
Сотрудники ──┬── Приходы
             ├── Расходы ──→ Пациенты
             ├── Возвраты ──→ Номенклатура
             ├── Начальные остатки ──→ Номенклатура
             └── Сообщения

Номенклатура ──┬── История цен
               ├── Расходы
               └── Возвраты
```

---

## 💡 Примеры использования

### Получить всех сотрудников
```typescript
import { getAllData } from './services/googleSheetsApi';

const data = await getAllData();
console.log(data.employees);
```

### Добавить нового сотрудника
```typescript
import { addEmployee } from './services/googleSheetsApi';

await addEmployee({
  personalNumber: '1031',
  fullName: 'Новый Сотрудник',
  password: 'pass1031',
  status: 'active',
  archived: false,
  hireDate: '2026-01-01',
  lastActivityDate: '2026-01-01'
});
```

### Обновить цену
```typescript
import { updatePrice } from './services/googleSheetsApi';

await updatePrice('nom_1', 500, 'admin');
```

---

## ⚠️ Важно

- **Лимиты Google**: 100 запросов/100 сек (бесплатно)
- **Кэширование**: Данные кэшируются на 5 минут
- **Безопасность**: Не храните пароли в открытом виде
- **Резервные копии**: Делайте копии таблицы регулярно

---

## 📞 Поддержка

- Полная документация: `GOOGLE_SHEETS_DATABASE.md`
- Руководство по интеграции: `INTEGRATION_GUIDE.md`
- Google Apps Script: `google-apps-script.js`

---

**Готово к использованию!** 🎉
