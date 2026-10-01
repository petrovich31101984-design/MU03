const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxI9sL0xEaLcPYfp7gGRRxo-JlxuaHpzt-G_yzY4oKyMZu_et-oJBf6xjUSHz4g8Spc/exec';

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

let cachedData: Database | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000;

export async function getAllData(): Promise<Database> {
  if (cachedData && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return cachedData;
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    cachedData = data;
    cacheTimestamp = Date.now();
    
    return data;
  } catch (error) {
    console.error('Ошибка получения данных из Google Sheets:', error);
    throw error;
  }
}

export function clearCache() {
  cachedData = null;
  cacheTimestamp = 0;
}

export async function addEmployee(employee: Omit<Employee, 'id'>): Promise<{ success: boolean; id?: string }> {
  const id = `emp_${Date.now()}`;
  const newEmployee = { ...employee, id };

  console.log('📤 API: Отправляем POST запрос в Google Sheets');
  console.log('📤 API: URL:', GOOGLE_SCRIPT_URL);
  console.log('📤 API: Данные:', newEmployee);

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({
        type: 'addEmployee',
        newEmployee: newEmployee
      })
    });

    console.log('✅ API: POST запрос отправлен (no-cors mode)');
    
    if (cachedData) {
      cachedData.employees.push(newEmployee);
    }
    
    return { success: true, id };
  } catch (error) {
    console.error('❌ API: Ошибка добавления сотрудника:', error);
    throw error;
  }
}

export async function deleteEmployee(id: string): Promise<{ success: boolean }> {
  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({
        type: 'deleteEmployee',
        data: { id }
      })
    });

    console.log('✅ Запрос на удаление сотрудника отправлен');
    
    if (cachedData) {
      cachedData.employees = cachedData.employees.filter(e => e.id !== id);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Ошибка удаления сотрудника:', error);
    throw error;
  }
}
