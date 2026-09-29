# Интеграция приложений "МедУчёт" с Google Sheets

## 📋 Содержание

1. [Создание Google таблицы](#создание-google-таблицы)
2. [Настройка Google Apps Script](#настройка-google-apps-script)
3. [Интеграция с React-приложением](#интеграция-с-react-приложением)
4. [Синхронизация данных](#синхронизация-данных)
5. [Деплой и публикация](#деплой-и-публикация)

---

## Создание Google таблицы

### Вариант 1: Автоматическое создание (рекомендуется)

1. Откройте [Google Sheets](https://sheets.google.com)
2. Создайте новую пустую таблицу
3. Перейдите в **Расширения → Apps Script**
4. Скопируйте содержимое файла `google-apps-script.js` в редактор
5. Сохраните проект (Ctrl+S)
6. Запустите функцию `createDatabase()` (кнопка ▶)
7. Разрешите доступ при запросе
8. Дождитесь создания всех 11 листов

После выполнения вы получите URL таблицы в журнале (View → Logs).

### Вариант 2: Ручное создание

1. Создайте новую Google таблицу
2. Создайте 11 листов с именами:
   - Сотрудники
   - Номенклатура
   - История цен
   - Приходы
   - Пациенты
   - Расходы
   - Начальные остатки
   - Возвраты
   - Сообщения
   - Журнал
   - Уведомления
3. Импортируйте данные из CSV-файлов в папке `data/`:
   - Файл → Импорт → Загрузить → Выберите CSV
   - Разделитель: запятая
   - Преобразовать текст в числа/даты: Да

---

## Настройка Google Apps Script

### Развёртывание как веб-приложение

1. В редакторе Apps Script нажмите **Развернуть → Новое развёртывание**
2. Выберите тип: **Веб-приложение**
3. Заполните:
   - Описание: "МедУчёт API"
   - Выполнять как: **Я** (ваш аккаунт)
   - Доступ: **Все** (или "Все, у кого есть ссылка")
4. Нажмите **Развернуть**
5. Скопируйте URL веб-приложения

Пример URL: `https://script.google.com/macros/s/AKfycbx.../exec`

### Тестирование API

Откройте URL в браузере - вы должны увидеть JSON со всеми данными:

```json
{
  "employees": [...],
  "nomenclature": [...],
  "priceHistory": [...],
  ...
}
```

---

## Интеграция с React-приложением

### Шаг 1: Создание API-сервиса

Создайте файл `src/services/googleSheetsApi.ts`:

```typescript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

export const googleSheetsApi = {
  // Получить все данные
  async getAllData() {
    const response = await fetch(GOOGLE_SCRIPT_URL);
    return await response.json();
  },

  // Получить сотрудников
  async getEmployees() {
    const data = await this.getAllData();
    return data.employees;
  },

  // Получить номенклатуру
  async getNomenclature() {
    const data = await this.getAllData();
    return data.nomenclature;
  },

  // Добавить сотрудника
  async addEmployee(employee: any) {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({
        type: 'addEmployee',
        data: employee
      })
    });
    return await response.json();
  },

  // Добавить приход
  async addIncome(income: any) {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({
        type: 'addIncome',
        data: income
      })
    });
    return await response.json();
  },

  // Добавить расход
  async addExpense(expense: any) {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({
        type: 'addExpense',
        data: expense
      })
    });
    return await response.json();
  },

  // Добавить возврат
  async addReturn(returnData: any) {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({
        type: 'addReturn',
        data: returnData
      })
    });
    return await response.json();
  },

  // Обновить цену
  async updatePrice(nomenclatureId: string, newPrice: number, userId: string) {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({
        type: 'updatePrice',
        data: { nomenclatureId, newPrice, userId }
      })
    });
    return await response.json();
  }
};
```

### Шаг 2: Модификация Store

Замените `src/store/useStore.ts` на версию с Google Sheets:

```typescript
import { create } from 'zustand';
import { googleSheetsApi } from '../services/googleSheetsApi';

interface AppState {
  employees: any[];
  nomenclature: any[];
  // ... остальные поля
  
  // Actions
  loadData: () => Promise<void>;
  addEmployee: (emp: any) => Promise<void>;
  // ... остальные actions
}

export const useStore = create<AppState>((set, get) => ({
  employees: [],
  nomenclature: [],
  // ... начальное состояние
  
  // Загрузка данных из Google Sheets
  loadData: async () => {
    try {
      const data = await googleSheetsApi.getAllData();
      set({
        employees: data.employees,
        nomenclature: data.nomenclature,
        priceHistory: data.priceHistory,
        income: data.income,
        patients: data.patients,
        expenses: data.expenses,
        initialStocks: data.initialStock,
        returns: data.returns,
        messages: data.messages,
        journal: data.journal,
        notifications: data.notifications,
      });
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  },
  
  // Добавление сотрудника
  addEmployee: async (emp) => {
    const id = `emp_${Date.now()}`;
    const newEmployee = { ...emp, id };
    
    // Отправляем в Google Sheets
    await googleSheetsApi.addEmployee(newEmployee);
    
    // Обновляем локальное состояние
    set(state => ({
      employees: [...state.employees, newEmployee]
    }));
  },
  
  // ... остальные actions
}));
```

### Шаг 3: Загрузка данных при старте

В `src/App.tsx` добавьте загрузку данных:

```typescript
import { useEffect } from 'react';
import { useStore } from './store/useStore';

function App() {
  const loadData = useStore(s => s.loadData);
  
  useEffect(() => {
    loadData();
  }, [loadData]);
  
  // ... остальной код
}
```

---

## Синхронизация данных

### Автоматическая синхронизация

Добавьте в `google-apps-script.js` функцию для автоматической синхронизации:

```javascript
// Автоматическая синхронизация каждые 5 минут
function setupAutoSync() {
  ScriptApp.newTrigger('syncData')
    .timeBased()
    .everyMinutes(5)
    .create();
}

function syncData() {
  // Логика синхронизации
  Logger.log('Синхронизация данных: ' + new Date());
}
```

### Ручная синхронизация

Добавьте кнопку "Синхронизировать" в интерфейс приложения:

```typescript
const handleSync = async () => {
  try {
    await loadData();
    alert('Данные успешно синхронизированы');
  } catch (error) {
    alert('Ошибка синхронизации: ' + error.message);
  }
};
```

---

## Деплой и публикация

### Публикация React-приложения

1. Соберите приложение:
   ```bash
   npm run build
   ```

2. Разверните на хостинге:
   - **Vercel**: `vercel deploy`
   - **Netlify**: Перетащите папку `dist` в Netlify
   - **GitHub Pages**: Используйте `gh-pages`

### Настройка CORS

Если возникают ошибки CORS, добавьте в `google-apps-script.js`:

```javascript
function doGet(e) {
  const data = getAllData();
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  // ... обработка POST запросов
}

// Обработка OPTIONS запросов для CORS
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}
```

---

## 📊 Мониторинг и отладка

### Просмотр логов

1. Откройте Apps Script
2. Перейдите в **Выполнения** (слева)
3. Просматривайте логи выполнения

### Тестирование API

Используйте curl для тестирования:

```bash
# GET запрос
curl https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

# POST запрос
curl -X POST https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec \
  -H "Content-Type: application/json" \
  -d '{"type":"addEmployee","data":{"id":"emp_31","fullName":"Тестовый Сотрудник"}}'
```

---

## 🔐 Безопасность

### Рекомендации

1. **Не публикуйте API-ключи** в коде
2. **Используйте HTTPS** для всех запросов
3. **Ограничьте доступ** к Google таблице
4. **Валидируйте данные** на стороне сервера
5. **Используйте токены авторизации** для чувствительных операций

### Пример авторизации

```javascript
function doPost(e) {
  const token = e.parameter.token;
  
  // Проверка токена
  if (token !== 'YOUR_SECRET_TOKEN') {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Unauthorized'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  // ... обработка запроса
}
```

---

## 📈 Производительность

### Оптимизация запросов

1. **Кэширование**: Кэшируйте данные в localStorage
2. **Batch-запросы**: Объединяйте несколько операций в один запрос
3. **Индексация**: Используйте индексы для быстрого поиска

### Пример кэширования

```typescript
const CACHE_KEY = 'meduchet_data';
const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

async function getCachedData() {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
  }
  
  const data = await googleSheetsApi.getAllData();
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    data,
    timestamp: Date.now()
  }));
  
  return data;
}
```

---

## 🆘 Решение проблем

### Ошибка: "Script function not found"

**Решение**: Убедитесь, что функция `doGet` существует в Apps Script.

### Ошибка: "CORS policy"

**Решение**: Разверните скрипт как веб-приложение с доступом "Все".

### Ошибка: "Quota exceeded"

**Решение**: Google Apps Script имеет лимиты:
- 100 запросов/100 секунд для бесплатного аккаунта
- Используйте кэширование и batch-запросы

### Данные не обновляются

**Решение**: 
1. Проверьте, что скрипт развёрнут
2. Очистите кэш браузера
3. Проверьте логи в Apps Script

---

## 📚 Дополнительные ресурсы

- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Apps Script Documentation](https://developers.google.com/apps-script)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)

---

## ✅ Чек-лист интеграции

- [ ] Создана Google таблица
- [ ] Созданы все 11 листов
- [ ] Импортированы данные из CSV
- [ ] Настроен Apps Script
- [ ] Развёрнуто как веб-приложение
- [ ] Получен URL API
- [ ] Создан файл `googleSheetsApi.ts`
- [ ] Модифицирован `useStore.ts`
- [ ] Добавлена загрузка данных в `App.tsx`
- [ ] Протестирована синхронизация
- [ ] Настроено кэширование
- [ ] Проверена безопасность

---

**Готово!** Ваша база данных в Google Sheets интегрирована с приложениями "МедУчёт".
