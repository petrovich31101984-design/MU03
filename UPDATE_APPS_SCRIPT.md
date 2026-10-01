# Инструкция по обновлению Google Apps Script

## Проблема

При добавлении сотрудника данные не записываются в Google Sheets из-за несоответствия структуры данных.

## Решение

### Шаг 1: Откройте Apps Script

1. Откройте вашу Google таблицу "МедУчёт - База данных"
2. Перейдите в **Расширения → Apps Script**

### Шаг 2: Замените функцию `doPost`

Найдите функцию `doPost` в конце файла и замените её на эту версию:

```javascript
function doPost(e) {
  try {
    const action = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    Logger.log('Получен запрос: ' + JSON.stringify(action));
    
    if (action.type === 'addEmployee') {
      const sheet = ss.getSheetByName('Сотрудники');
      const data = action.newEmployee;
      
      Logger.log('Добавляем сотрудника: ' + JSON.stringify(data));
      
      sheet.appendRow([
        data.id,
        data.personalNumber,
        data.fullName,
        data.password,
        data.status,
        data.archived || false,
        data.hireDate,
        data.lastActivityDate
      ]);
      
      Logger.log('Сотрудник добавлен успешно');
    }
    
    if (action.type === 'deleteEmployee') {
      const sheet = ss.getSheetByName('Сотрудники');
      const data = sheet.getDataRange().getValues();
      const id = action.data.id;
      
      Logger.log('Удаляем сотрудника с ID: ' + id);
      
      // Находим строку с сотрудником и удаляем её
      for (let i = data.length - 1; i >= 1; i--) {
        if (data[i][0] === id) {
          sheet.deleteRow(i + 1);
          Logger.log('Сотрудник удалён');
          break;
        }
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('Ошибка: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Шаг 3: Сохраните и разверните заново

1. Нажмите **Ctrl+S** (сохранить)
2. Нажмите **Развернуть → Управление развёртываниями**
3. Нажмите на **карандаш** ✏️ (редактировать)
4. В поле **"Версия"** выберите **"Новая версия"**
5. Нажмите **Развернуть**
6. Скопируйте новый URL (если он изменился)

### Шаг 4: Обновите URL в коде (если изменился)

Если URL изменился, откройте файл `src/services/googleSheetsApi.ts` и обновите строку:

```typescript
const GOOGLE_SCRIPT_URL = 'ваш_новый_URL_here';
```

### Шаг 5: Перезапустите приложение

В командной строке остановите приложение (Ctrl+C) и запустите снова:

```bash
npm run dev
```

---

## Проверка работы

1. Откройте приложение в браузере
2. Войдите как **Руководитель** 👨‍💼
3. Перейдите в раздел **Сотрудники** 👥
4. Нажмите **"+ Добавить сотрудника"**
5. Заполните форму и нажмите **"Добавить"**
6. Откройте консоль браузера (F12) и проверьте логи:
   - 📤 `API: Отправляем POST запрос в Google Sheets`
   - 📤 `API: URL: ...`
   - 📤 `API: Данные: ...`
   - ✅ `API: POST запрос отправлен (no-cors mode)`

7. Откройте Google таблицу и проверьте лист **"Сотрудники"**
8. Новый сотрудник должен появиться в таблице!

---

## Проверка логов в Apps Script

Если сотрудник не появляется в таблице:

1. Откройте Apps Script
2. Нажмите **Выполнения** (слева в меню)
3. Найдите последнее выполнение `doPost`
4. Посмотрите логи - там должны быть сообщения:
   - `Получен запрос: {...}`
   - `Добавляем сотрудника: {...}`
   - `Сотрудник добавлен успешно`

Если есть ошибка, пришлите текст ошибки.

---

## Структура данных

### Отправляемые данные (React → Apps Script):

```json
{
  "type": "addEmployee",
  "newEmployee": {
    "id": "emp_1234567890",
    "personalNumber": "1031",
    "fullName": "Иванов Иван Иванович",
    "password": "pass1031",
    "status": "active",
    "archived": false,
    "hireDate": "2026-01-15",
    "lastActivityDate": "2026-01-15"
  }
}
```

### Ожидаемая структура в Apps Script:

```javascript
action.type === 'addEmployee'
action.newEmployee.id
action.newEmployee.personalNumber
action.newEmployee.fullName
// и т.д.
```

---

## Возможные проблемы

### Проблема 1: Ошибка CORS

Если видите ошибку `CORS policy` в консоли:
- Убедитесь, что в настройках развёртывания выбрано **"Доступ: Все"**

### Проблема 2: Функция `doPost` не работает

Если видите ошибку в Apps Script:
- Проверьте, что функция `doPost` добавлена в конец кода
- Проверьте, что развёртывание обновлено (новая версия)

### Проблема 3: URL не тот

Если запросы уходят не туда:
- Скопируйте новый URL из Apps Script после повторного развёртывания
- Обновите URL в файле `googleSheetsApi.ts`

### Проблема 4: Данные не записываются

Если запрос отправляется, но данные не записываются:
- Проверьте логи в Apps Script (Выполнения → последний запуск)
- Убедитесь, что лист называется точно **"Сотрудники"** (с заглавной буквы)
- Проверьте, что структура данных соответствует ожидаемой

---

## Контакты

Если проблема не решена, пришлите:
1. Текст ошибки из консоли браузера (F12)
2. Текст логов из Apps Script (Выполнения → последний запуск)
3. Скриншот Google таблицы с листом "Сотрудники"
