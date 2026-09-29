# Единая база данных в Google Sheets для системы "МедУчёт"

## Структура Google таблицы

Создайте Google таблицу со следующими листами:

---

## 📋 ЛИСТ 1: "Сотрудники" (Employees)

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| **id** | **personalNumber** | **fullName** | **password** | **status** | **archived** | **hireDate** | **lastActivityDate** |
| emp_1 | 1001 | Иванов Иван Иванович | pass1001 | active | FALSE | 2020-03-15 | 2024-01-15 |
| emp_2 | 1002 | Петров Пётр Сергеевич | pass1002 | active | FALSE | 2019-07-01 | 2024-01-15 |
| emp_3 | 1003 | Сидорова Анна Михайловна | pass1003 | active | FALSE | 2021-02-10 | 2024-01-14 |

**Статусы:** active, inactive, fired, blocked

---

## 📋 ЛИСТ 2: "Номенклатура" (Nomenclature)

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| **id** | **name** | **category** | **unit** | **active** | **packageQuantity** | **pricePerPackage** |
| nom_1 | Анальгин 50% 2мл | medicine | ampoule | TRUE | 10 | 450 |
| nom_2 | Дексаметазон 4мг/мл | medicine | ampoule | TRUE | 10 | 850 |
| nom_11 | Морфин 1% 1мл | medicine_pku | ampoule | TRUE | 5 | 2500 |
| nom_21 | Шприц 5мл | consumable | piece | TRUE | 100 | 1200 |

**Категории:** medicine, medicine_pku, equipment, consumable  
**Единицы:** ampoule, tablet, flacon, piece

---

## 📋 ЛИСТ 3: "История цен" (PriceHistory)

| A | B | C | D | E |
|---|---|---|---|---|
| **id** | **nomenclatureId** | **price** | **changeDate** | **changedBy** |
| ph_1 | nom_1 | 45 | 2023-06-01 | admin |
| ph_2 | nom_2 | 85 | 2023-06-01 | admin |

---

## 📋 ЛИСТ 4: "Приходы" (Income)

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| **id** | **employeeId** | **amount** | **period** | **shifts** | **date** | **createdBy** |
| inc_1 | emp_1 | 150000 | 2026-08 | 20 | 2026-08-01 | admin |
| inc_2 | emp_2 | 145000 | 2026-08 | 19 | 2026-08-01 | admin |

**Формат периода:** YYYY-MM (например: 2026-08)

---

## 📋 ЛИСТ 5: "Пациенты" (Patients)

| A | B | C | D | E |
|---|---|---|---|---|
| **id** | **fullName** | **birthDate** | **employeeId** | **visitDate** |
| pat_1 | Смирнов Алексей Петрович | 1985-05-12 | emp_1 | 2026-08-15 |
| pat_2 | Кузнецова Мария Ивановна | 1978-09-23 | emp_2 | 2026-08-14 |

---

## 📋 ЛИСТ 6: "Расходы" (Expenses)

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| **id** | **employeeId** | **patientId** | **nomenclatureId** | **quantity** | **visitDate** | **entryDate** | **offline** |
| exp_1 | emp_1 | pat_1 | nom_1 | 2 | 2026-08-15 | 2026-08-15T10:30 | FALSE |
| exp_2 | emp_1 | pat_1 | nom_2 | 1 | 2026-08-15 | 2026-08-15T10:35 | FALSE |

---

## 📋 ЛИСТ 7: "Начальные остатки" (InitialStock)

| A | B | C | D | E | F |
|---|---|---|---|---|---|
| **id** | **employeeId** | **nomenclatureId** | **quantity** | **date** | **createdBy** |
| stock_1 | emp_1 | nom_1 | 20 | 2024-01-01 | admin |
| stock_2 | emp_1 | nom_2 | 15 | 2024-01-01 | admin |

---

## 📋 ЛИСТ 8: "Возвраты" (Returns)

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| **id** | **employeeId** | **nomenclatureId** | **quantity** | **date** | **corrected** | **correctedBy** | **newQuantity** | **reason** | **confirmed** |
| ret_1 | emp_1 | nom_1 | 5 | 2026-01-10 | FALSE | | | Вышел срок годности | FALSE |
| ret_2 | emp_1 | nom_24 | 2 | 2026-01-10 | TRUE | admin | 1 | Нарушение упаковки | TRUE |

**Причины:** Вышел срок годности, Поломка оборудования, Нарушение упаковки, Другая причина

---

## 📋 ЛИСТ 9: "Сообщения" (Messages)

| A | B | C | D | E | F |
|---|---|---|---|---|---|
| **id** | **fromId** | **toId** | **text** | **date** | **read** |
| msg_1 | admin | emp_1 | Иван, проверьте остатки | 2024-01-14T10:30 | TRUE |
| msg_2 | emp_1 | admin | Принял к сведению | 2024-01-14T11:15 | TRUE |

---

## 📋 ЛИСТ 10: "Журнал изменений" (Journal)

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| **id** | **dateTime** | **userId** | **table** | **recordId** | **field** | **oldValue** | **newValue** |
| j_1 | 2024-01-14T16:45 | admin | Сотрудники | emp_18 | Статус | Активен | Заблокирован |
| j_2 | 2024-01-14T14:20 | admin | Приход | inc_1 | Сумма | 120000 | 150000 |

---

## 📋 ЛИСТ 11: "Уведомления" (Notifications)

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| **id** | **type** | **title** | **description** | **date** | **read** | **relatedId** |
| n_1 | overexpense | Перерасход у Петрова П.С. | Расход превышает приход на 5000 ₽ | 2024-01-15T14:30 | FALSE | emp_2 |
| n_2 | inactivity | Новикова О.Д. — нет расхода 7 дней | Последняя активность: 08.01.2024 | 2024-01-15T09:00 | FALSE | emp_9 |

**Типы уведомлений:** overexpense, inactivity, return, message, report, price_change, expense_limit

---

## 🔗 Связи между таблицами

```
Сотрудники (1) ←→ (N) Приходы
Сотрудники (1) ←→ (N) Расходы
Сотрудники (1) ←→ (N) Возвраты
Сотрудники (1) ←→ (N) Начальные остатки
Сотрудники (1) ←→ (N) Сообщения (как отправитель/получатель)

Номенклатура (1) ←→ (N) История цен
Номенклатура (1) ←→ (N) Расходы
Номенклатура (1) ←→ (N) Возвраты
Номенклатура (1) ←→ (N) Начальные остатки

Пациенты (1) ←→ (N) Расходы
```

---

## 📊 Формулы для автоматизации

### В листе "Сотрудники" добавить столбец "Общий остаток (₽)":

```
=SUMPRODUCT(
  (Начальные остатки!B:B=A2) * 
  (Начальные остатки!D:D) * 
  IFERROR(VLOOKUP(Начальные остатки!C:C, Номенклатура!A:G, 7, FALSE) / 
          VLOOKUP(Начальные остатки!C:C, Номенклатура!A:G, 6, FALSE), 0)
)
```

### В листе "Номенклатура" добавить столбец "Текущая цена за единицу":

```
=IF(F2>0, G2/F2, 0)
```

где F2 = packageQuantity, G2 = pricePerPackage

---

## 🔌 Интеграция с приложениями

### Вариант 1: Google Sheets API (рекомендуется)

1. Создайте проект в Google Cloud Console
2. Включите Google Sheets API
3. Создайте сервисный аккаунт и получите JSON-ключ
4. Предоставьте доступ сервисному аккаунту к таблице
5. Используйте библиотеку `googleapis` в Node.js или `gspread` в Python

**Пример кода для чтения данных:**

```javascript
const { google } = require('googleapis');

const auth = new google.auth.GoogleAuth({
  keyFile: 'path/to/service-account.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

async function getEmployees() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: 'YOUR_SPREADSHEET_ID',
    range: 'Сотрудники!A2:H',
  });
  
  return response.data.values.map(row => ({
    id: row[0],
    personalNumber: row[1],
    fullName: row[2],
    password: row[3],
    status: row[4],
    archived: row[5] === 'TRUE',
    hireDate: row[6],
    lastActivityDate: row[7],
  }));
}
```

### Вариант 2: Google Apps Script (бесплатно, без API)

Создайте Apps Script в Google таблице:

```javascript
function getEmployees() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Сотрудники');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
}

function doPost(e) {
  const action = JSON.parse(e.postData.contents);
  
  if (action.type === 'addEmployee') {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Сотрудники');
    sheet.appendRow([
      action.data.id,
      action.data.personalNumber,
      action.data.fullName,
      action.data.password,
      action.data.status,
      action.data.archived,
      action.data.hireDate,
      action.data.lastActivityDate
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true }));
  }
}
```

### Вариант 3: Экспорт/Импорт CSV

Для простоты можно использовать экспорт в CSV:
1. В Google таблице: Файл → Скачать → CSV
2. Импортировать CSV в приложение
3. После изменений экспортировать обратно

---

## 📝 Пример данных для тестирования

Создайте файл `sample_data.csv` с примерами данных для каждого листа.

---

## 🔐 Безопасность

1. **Не храните пароли в открытом виде** - используйте хеширование
2. **Ограничьте доступ** к таблице только для авторизованных пользователей
3. **Используйте HTTPS** для всех API-запросов
4. **Регулярно делайте резервные копии** таблицы
5. **Ведите журнал изменений** для аудита

---

## 📈 Преимущества Google Sheets как БД

✅ Бесплатно для небольших объёмов  
✅ Визуальный интерфейс для редактирования  
✅ Встроенные формулы для расчётов  
✅ Автоматическое резервное копирование  
✅ Совместный доступ для нескольких пользователей  
✅ Интеграция с другими Google сервисами  
✅ Мобильный доступ  

## ⚠️ Ограничения

❌ Ограничение на количество строк (10 млн ячеек)  
❌ Медленнее настоящей БД при больших объёмах  
❌ Нет транзакций  
❌ Ограничения API (100 запросов/100 сек для бесплатного аккаунта)  

---

## 🚀 Следующие шаги

1. Создайте Google таблицу по структуре выше
2. Заполните начальными данными из mockData.ts
3. Настройте интеграцию через Google Sheets API или Apps Script
4. Замените Zustand store на чтение из Google Sheets
5. Реализуйте синхронизацию изменений обратно в таблицу

---

**ID таблицы для интеграции:** `YOUR_SPREADSHEET_ID_HERE`

**URL таблицы:** `https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID_HERE/edit`
