/**
 * Google Sheets API Service для системы "МедУчёт"
 * 
 * ИНСТРУКЦИЯ ПО НАСТРОЙКЕ:
 * 1. Замените GOOGLE_SCRIPT_URL на URL вашего Apps Script
 * 2. Импортируйте этот файл в компоненты
 * 3. Используйте методы для работы с данными
 */

// Замените на URL вашего Apps Script
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

// Типы данных
export interface Employee {
  id: string;
  personalNumber: string;
  fullName: string;
  password: string;
  status: 'active' | 'inactive' | 'fired' | 'blocked';
  archived: boolean;
  hireDate: string;
  lastActivityDate: string;
}

export interface Nomenclature {
  id: string;
  name: string;
  category: 'medicine' | 'medicine_pku' | 'equipment' | 'consumable';
  unit: 'ampoule' | 'tablet' | 'flacon' | 'piece';
  active: boolean;
  packageQuantity: number;
  pricePerPackage: number;
}

export interface Income {
  id: string;
  employeeId: string;
  amount: number;
  period: string;
  shifts: number;
  date: string;
  createdBy: string;
}

export interface Expense {
  id: string;
  employeeId: string;
  patientId: string;
  nomenclatureId: string;
  quantity: number;
  visitDate: string;
  entryDate: string;
  offline: boolean;
}

export interface Return {
  id: string;
  employeeId: string;
  nomenclatureId: string;
  quantity: number;
  date: string;
  corrected: boolean;
  correctedBy?: string;
  newQuantity?: number;
  reason?: string;
  confirmed: boolean;
}

export interface Database {
  employees: Employee[];
  nomenclature: Nomenclature[];
  priceHistory: any[];
  income: Income[];
  patients: any[];
  expenses: Expense[];
  initialStock: any[];
  returns: Return[];
  messages: any[];
  journal: any[];
  notifications: any[];
}

// Кэш данных
let cachedData: Database | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

/**
 * Получить все данные из Google Sheets
 */
export async function getAllData(): Promise<Database> {
  // Проверяем кэш
  if (cachedData && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return cachedData;
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Сохраняем в кэш
    cachedData = data;
    cacheTimestamp = Date.now();
    
    return data;
  } catch (error) {
    console.error('Ошибка получения данных из Google Sheets:', error);
    throw error;
  }
}

/**
 * Очистить кэш
 */
export function clearCache() {
  cachedData = null;
  cacheTimestamp = 0;
}

/**
 * Добавить сотрудника
 */
export async function addEmployee(employee: Omit<Employee, 'id'>): Promise<{ success: boolean; id?: string }> {
  const id = `emp_${Date.now()}`;
  const newEmployee = { ...employee, id };

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'addEmployee',
        data: newEmployee
      })
    });

    const result = await response.json();
    
    if (result.success) {
      // Обновляем кэш
      if (cachedData) {
        cachedData.employees.push(newEmployee);
      }
      return { success: true, id };
    } else {
      throw new Error(result.error || 'Ошибка добавления сотрудника');
    }
  } catch (error) {
    console.error('Ошибка добавления сотрудника:', error);
    throw error;
  }
}

/**
 * Обновить сотрудника
 */
export async function updateEmployee(id: string, updates: Partial<Employee>): Promise<{ success: boolean }> {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'updateEmployee',
        data: { id, ...updates }
      })
    });

    const result = await response.json();
    
    if (result.success) {
      // Обновляем кэш
      if (cachedData) {
        const index = cachedData.employees.findIndex(e => e.id === id);
        if (index !== -1) {
          cachedData.employees[index] = { ...cachedData.employees[index], ...updates };
        }
      }
      return { success: true };
    } else {
      throw new Error(result.error || 'Ошибка обновления сотрудника');
    }
  } catch (error) {
    console.error('Ошибка обновления сотрудника:', error);
    throw error;
  }
}

/**
 * Добавить номенклатуру
 */
export async function addNomenclature(item: Omit<Nomenclature, 'id'>): Promise<{ success: boolean; id?: string }> {
  const id = `nom_${Date.now()}`;
  const newItem = { ...item, id };

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'addNomenclature',
        data: newItem
      })
    });

    const result = await response.json();
    
    if (result.success) {
      if (cachedData) {
        cachedData.nomenclature.push(newItem);
      }
      return { success: true, id };
    } else {
      throw new Error(result.error || 'Ошибка добавления номенклатуры');
    }
  } catch (error) {
    console.error('Ошибка добавления номенклатуры:', error);
    throw error;
  }
}

/**
 * Обновить цену номенклатуры
 */
export async function updatePrice(
  nomenclatureId: string, 
  newPrice: number, 
  userId: string
): Promise<{ success: boolean }> {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'updatePrice',
        data: { nomenclatureId, newPrice, userId }
      })
    });

    const result = await response.json();
    
    if (result.success) {
      // Добавляем запись в историю цен
      if (cachedData) {
        cachedData.priceHistory.push({
          id: `ph_${Date.now()}`,
          nomenclatureId,
          price: newPrice,
          changeDate: new Date().toISOString().slice(0, 10),
          changedBy: userId
        });
      }
      return { success: true };
    } else {
      throw new Error(result.error || 'Ошибка обновления цены');
    }
  } catch (error) {
    console.error('Ошибка обновления цены:', error);
    throw error;
  }
}

/**
 * Добавить приход
 */
export async function addIncome(income: Omit<Income, 'id'>): Promise<{ success: boolean; id?: string }> {
  const id = `inc_${Date.now()}`;
  const newIncome = { ...income, id };

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'addIncome',
        data: newIncome
      })
    });

    const result = await response.json();
    
    if (result.success) {
      if (cachedData) {
        cachedData.income.push(newIncome);
      }
      return { success: true, id };
    } else {
      throw new Error(result.error || 'Ошибка добавления прихода');
    }
  } catch (error) {
    console.error('Ошибка добавления прихода:', error);
    throw error;
  }
}

/**
 * Добавить расход
 */
export async function addExpense(expense: Omit<Expense, 'id'>): Promise<{ success: boolean; id?: string }> {
  const id = `exp_${Date.now()}`;
  const newExpense = { ...expense, id };

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'addExpense',
        data: newExpense
      })
    });

    const result = await response.json();
    
    if (result.success) {
      if (cachedData) {
        cachedData.expenses.push(newExpense);
      }
      return { success: true, id };
    } else {
      throw new Error(result.error || 'Ошибка добавления расхода');
    }
  } catch (error) {
    console.error('Ошибка добавления расхода:', error);
    throw error;
  }
}

/**
 * Добавить возврат
 */
export async function addReturn(returnData: Omit<Return, 'id'>): Promise<{ success: boolean; id?: string }> {
  const id = `ret_${Date.now()}`;
  const newReturn = { ...returnData, id };

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'addReturn',
        data: newReturn
      })
    });

    const result = await response.json();
    
    if (result.success) {
      if (cachedData) {
        cachedData.returns.push(newReturn);
      }
      return { success: true, id };
    } else {
      throw new Error(result.error || 'Ошибка добавления возврата');
    }
  } catch (error) {
    console.error('Ошибка добавления возврата:', error);
    throw error;
  }
}

/**
 * Добавить сообщение
 */
export async function addMessage(message: {
  fromId: string;
  toId: string;
  text: string;
  date: string;
  read: boolean;
}): Promise<{ success: boolean; id?: string }> {
  const id = `msg_${Date.now()}`;
  const newMessage = { ...message, id };

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'addMessage',
        data: newMessage
      })
    });

    const result = await response.json();
    
    if (result.success) {
      if (cachedData) {
        cachedData.messages.push(newMessage);
      }
      return { success: true, id };
    } else {
      throw new Error(result.error || 'Ошибка добавления сообщения');
    }
  } catch (error) {
    console.error('Ошибка добавления сообщения:', error);
    throw error;
  }
}

/**
 * Добавить запись в журнал
 */
export async function addJournalEntry(entry: {
  dateTime: string;
  userId: string;
  table: string;
  recordId: string;
  field: string;
  oldValue: string;
  newValue: string;
}): Promise<{ success: boolean; id?: string }> {
  const id = `j_${Date.now()}`;
  const newEntry = { ...entry, id };

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'addJournalEntry',
        data: newEntry
      })
    });

    const result = await response.json();
    
    if (result.success) {
      if (cachedData) {
        cachedData.journal.push(newEntry);
      }
      return { success: true, id };
    } else {
      throw new Error(result.error || 'Ошибка добавления записи в журнал');
    }
  } catch (error) {
    console.error('Ошибка добавления записи в журнал:', error);
    throw error;
  }
}

/**
 * Принудительная синхронизация данных
 */
export async function syncData(): Promise<Database> {
  clearCache();
  return await getAllData();
}

/**
 * Проверка соединения с Google Sheets
 */
export async function checkConnection(): Promise<boolean> {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL);
    return response.ok;
  } catch (error) {
    return false;
  }
}
