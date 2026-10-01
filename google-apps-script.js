/**
 * Google Apps Script для создания базы данных "МедУчёт" в Google Sheets
 * 
 * ИНСТРУКЦИЯ ПО УСТАНОВКЕ:
 * 1. Откройте Google Sheets (https://sheets.google.com)
 * 2. Создайте новую таблицу
 * 3. Перейдите в Расширения → Apps Script
 * 4. Удалите весь код в редакторе
 * 5. Вставьте этот код
 * 6. Сохраните (Ctrl+S)
 * 7. Запустите функцию createDatabase() (кнопка ▶)
 * 8. Разрешите доступ при запросе
 * 9. Дождитесь создания всех листов
 * 
 * После создания таблицы вы получите URL в журнале выполнения (View → Logs)
 */

function createDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Удаляем стандартный лист "Лист1" если он есть
  const defaultSheet = ss.getSheetByName('Лист1');
  if (defaultSheet && ss.getSheets().length > 1) {
    ss.deleteSheet(defaultSheet);
  }
  
  // Создаём все листы
  createEmployeesSheet(ss);
  createNomenclatureSheet(ss);
  createPriceHistorySheet(ss);
  createIncomeSheet(ss);
  createPatientsSheet(ss);
  createExpensesSheet(ss);
  createInitialStockSheet(ss);
  createReturnsSheet(ss);
  createMessagesSheet(ss);
  createJournalSheet(ss);
  createNotificationsSheet(ss);
  
  // Форматируем таблицу
  formatAllSheets(ss);
  
  // Выводим URL таблицы
  Logger.log('База данных успешно создана!');
  Logger.log('URL таблицы: ' + ss.getUrl());
  
  SpreadsheetApp.getUi().alert(
    'База данных "МедУчёт" успешно создана!\n\n' +
    'URL таблицы: ' + ss.getUrl() + '\n\n' +
    'Создано 11 листов с данными.'
  );
}

function createEmployeesSheet(ss) {
  const sheet = ss.insertSheet('Сотрудники');
  sheet.getRange(1, 1, 1, 8).setValues([[
    'id', 'personalNumber', 'fullName', 'password', 'status', 'archived', 'hireDate', 'lastActivityDate'
  ]]);
  
  // Добавляем примеры данных
  const data = [
    ['emp_1', 1001, 'Иванов Иван Иванович', 'pass1001', 'active', false, '2020-03-15', '2024-01-15'],
    ['emp_2', 1002, 'Петров Пётр Сергеевич', 'pass1002', 'active', false, '2019-07-01', '2024-01-15'],
    ['emp_3', 1003, 'Сидорова Анна Михайловна', 'pass1003', 'active', false, '2021-02-10', '2024-01-14'],
    ['emp_4', 1004, 'Козлов Дмитрий Алексеевич', 'pass1004', 'active', false, '2018-11-20', '2024-01-15'],
    ['emp_5', 1005, 'Морозова Елена Владимировна', 'pass1005', 'active', false, '2022-05-03', '2024-01-15'],
  ];
  
  if (data.length > 0) {
    sheet.getRange(2, 1, data.length, 8).setValues(data);
  }
}

function createNomenclatureSheet(ss) {
  const sheet = ss.insertSheet('Номенклатура');
  sheet.getRange(1, 1, 1, 7).setValues([[
    'id', 'name', 'category', 'unit', 'active', 'packageQuantity', 'pricePerPackage'
  ]]);
  
  const data = [
    ['nom_1', 'Анальгин 50% 2мл', 'medicine', 'ampoule', true, 10, 450],
    ['nom_2', 'Дексаметазон 4мг/мл', 'medicine', 'ampoule', true, 10, 850],
    ['nom_3', 'Преднизолон 30мг/мл', 'medicine', 'ampoule', true, 10, 1200],
    ['nom_11', 'Морфин 1% 1мл', 'medicine_pku', 'ampoule', true, 5, 2500],
    ['nom_21', 'Шприц 5мл', 'consumable', 'piece', true, 100, 1200],
  ];
  
  if (data.length > 0) {
    sheet.getRange(2, 1, data.length, 7).setValues(data);
  }
}

function createPriceHistorySheet(ss) {
  const sheet = ss.insertSheet('История цен');
  sheet.getRange(1, 1, 1, 5).setValues([[
    'id', 'nomenclatureId', 'price', 'changeDate', 'changedBy'
  ]]);
  
  const data = [
    ['ph_1', 'nom_1', 45, '2023-06-01', 'admin'],
    ['ph_2', 'nom_2', 85, '2023-06-01', 'admin'],
    ['ph_3', 'nom_3', 120, '2023-06-01', 'admin'],
  ];
  
  if (data.length > 0) {
    sheet.getRange(2, 1, data.length, 5).setValues(data);
  }
}

function createIncomeSheet(ss) {
  const sheet = ss.insertSheet('Приходы');
  sheet.getRange(1, 1, 1, 7).setValues([[
    'id', 'employeeId', 'amount', 'period', 'shifts', 'date', 'createdBy'
  ]]);
  
  const data = [
    ['inc_1', 'emp_1', 150000, '2026-08', 20, '2026-08-01', 'admin'],
    ['inc_2', 'emp_2', 145000, '2026-08', 19, '2026-08-01', 'admin'],
    ['inc_3', 'emp_3', 160000, '2026-08', 21, '2026-08-01', 'admin'],
  ];
  
  if (data.length > 0) {
    sheet.getRange(2, 1, data.length, 7).setValues(data);
  }
}

function createPatientsSheet(ss) {
  const sheet = ss.insertSheet('Пациенты');
  sheet.getRange(1, 1, 1, 5).setValues([[
    'id', 'fullName', 'birthDate', 'employeeId', 'visitDate'
  ]]);
  
  const data = [
    ['pat_1', 'Смирнов Алексей Петрович', '1985-05-12', 'emp_1', '2026-08-15'],
    ['pat_2', 'Кузнецова Мария Ивановна', '1978-09-23', 'emp_2', '2026-08-14'],
    ['pat_3', 'Попов Виктор Сергеевич', '1992-03-05', 'emp_3', '2026-08-13'],
  ];
  
  if (data.length > 0) {
    sheet.getRange(2, 1, data.length, 5).setValues(data);
  }
}

function createExpensesSheet(ss) {
  const sheet = ss.insertSheet('Расходы');
  sheet.getRange(1, 1, 1, 8).setValues([[
    'id', 'employeeId', 'patientId', 'nomenclatureId', 'quantity', 'visitDate', 'entryDate', 'offline'
  ]]);
  
  const data = [
    ['exp_1', 'emp_1', 'pat_1', 'nom_1', 2, '2026-08-15', '2026-08-15T10:30', false],
    ['exp_2', 'emp_1', 'pat_1', 'nom_2', 1, '2026-08-15', '2026-08-15T10:35', false],
    ['exp_3', 'emp_2', 'pat_2', 'nom_3', 3, '2026-08-14', '2026-08-14T14:20', false],
  ];
  
  if (data.length > 0) {
    sheet.getRange(2, 1, data.length, 8).setValues(data);
  }
}

function createInitialStockSheet(ss) {
  const sheet = ss.insertSheet('Начальные остатки');
  sheet.getRange(1, 1, 1, 6).setValues([[
    'id', 'employeeId', 'nomenclatureId', 'quantity', 'date', 'createdBy'
  ]]);
  
  const data = [
    ['stock_1', 'emp_1', 'nom_1', 20, '2024-01-01', 'admin'],
    ['stock_2', 'emp_1', 'nom_2', 15, '2024-01-01', 'admin'],
    ['stock_3', 'emp_2', 'nom_1', 25, '2024-01-01', 'admin'],
  ];
  
  if (data.length > 0) {
    sheet.getRange(2, 1, data.length, 6).setValues(data);
  }
}

function createReturnsSheet(ss) {
  const sheet = ss.insertSheet('Возвраты');
  sheet.getRange(1, 1, 1, 10).setValues([[
    'id', 'employeeId', 'nomenclatureId', 'quantity', 'date', 'corrected', 'correctedBy', 'newQuantity', 'reason', 'confirmed'
  ]]);
  
  const data = [
    ['ret_1', 'emp_1', 'nom_1', 5, '2026-01-10', false, '', '', 'Вышел срок годности', false],
    ['ret_2', 'emp_1', 'nom_24', 2, '2026-01-10', true, 'admin', 1, 'Нарушение упаковки', true],
  ];
  
  if (data.length > 0) {
    sheet.getRange(2, 1, data.length, 10).setValues(data);
  }
}

function createMessagesSheet(ss) {
  const sheet = ss.insertSheet('Сообщения');
  sheet.getRange(1, 1, 1, 6).setValues([[
    'id', 'fromId', 'toId', 'text', 'date', 'read'
  ]]);
  
  const data = [
    ['msg_1', 'admin', 'emp_1', 'Иван, проверьте остатки', '2024-01-14T10:30', true],
    ['msg_2', 'emp_1', 'admin', 'Принял к сведению', '2024-01-14T11:15', true],
  ];
  
  if (data.length > 0) {
    sheet.getRange(2, 1, data.length, 6).setValues(data);
  }
}

function createJournalSheet(ss) {
  const sheet = ss.insertSheet('Журнал');
  sheet.getRange(1, 1, 1, 8).setValues([[
    'id', 'dateTime', 'userId', 'table', 'recordId', 'field', 'oldValue', 'newValue'
  ]]);
  
  const data = [
    ['j_1', '2024-01-14T16:45', 'admin', 'Сотрудники', 'emp_18', 'Статус', 'Активен', 'Заблокирован'],
    ['j_2', '2024-01-14T14:20', 'admin', 'Приход', 'inc_1', 'Сумма', '120000', '150000'],
  ];
  
  if (data.length > 0) {
    sheet.getRange(2, 1, data.length, 8).setValues(data);
  }
}

function createNotificationsSheet(ss) {
  const sheet = ss.insertSheet('Уведомления');
  sheet.getRange(1, 1, 1, 7).setValues([[
    'id', 'type', 'title', 'description', 'date', 'read', 'relatedId'
  ]]);
  
  const data = [
    ['n_1', 'overexpense', 'Перерасход у Петрова П.С.', 'Расход превышает приход на 5000 ₽', '2024-01-15T14:30', false, 'emp_2'],
    ['n_2', 'inactivity', 'Новикова О.Д. — нет расхода 7 дней', 'Последняя активность: 08.01.2024', '2024-01-15T09:00', false, 'emp_9'],
  ];
  
  if (data.length > 0) {
    sheet.getRange(2, 1, data.length, 7).setValues(data);
  }
}

function formatAllSheets(ss) {
  const sheets = ss.getSheets();
  
  sheets.forEach(sheet => {
    // Форматируем заголовки
    const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('#ffffff');
    headerRange.setFontWeight('bold');
    headerRange.setHorizontalAlignment('center');
    
    // Автоматическая ширина столбцов
    for (let i = 1; i <= sheet.getLastColumn(); i++) {
      sheet.autoResizeColumn(i);
    }
    
    // Закрепляем первую строку
    sheet.setFrozenRows(1);
  });
}

/**
 * Функция для получения всех данных из таблицы
 * Используется для интеграции с приложениями
 */
function getAllData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const result = {};
  
  const sheets = {
    'Сотрудники': 'employees',
    'Номенклатура': 'nomenclature',
    'История цен': 'priceHistory',
    'Приходы': 'income',
    'Пациенты': 'patients',
    'Расходы': 'expenses',
    'Начальные остатки': 'initialStock',
    'Возвраты': 'returns',
    'Сообщения': 'messages',
    'Журнал': 'journal',
    'Уведомления': 'notifications'
  };
  
  Object.keys(sheets).forEach(sheetName => {
    const sheet = ss.getSheetByName(sheetName);
    if (sheet) {
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      const rows = data.slice(1).map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index];
        });
        return obj;
      });
      result[sheets[sheetName]] = rows;
    }
  });
  
  return result;
}

/**
 * Web App endpoint для интеграции с приложениями
 * Разверните как веб-приложение для доступа через API
 */
function doGet(e) {
  const data = getAllData();
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const action = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if (action.type === 'addEmployee') {
      const sheet = ss.getSheetByName('Сотрудники');
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
    }
    
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
