export type UserRole = 'admin' | 'storekeeper';
export type EmployeeStatus = 'active' | 'inactive' | 'blocked' | 'fired';

export interface Employee {
  id: string;
  personalNumber: string;
  fullName: string;
  password: string;
  status: 'active' | 'inactive' | 'blocked' | 'fired';
  archived?: boolean;
  hireDate: string;
  lastActivityDate: string;
}

export interface NomenclatureItem {
  id: string;
  name: string;
  category: 'medicine' | 'medicine_pku' | 'equipment' | 'consumable';
  unit: 'ampoule' | 'tablet' | 'flacon' | 'piece';
  active: boolean;
  packageQuantity?: number;
  pricePerPackage?: number;
}

export interface PriceHistory {
  id: string;
  nomenclatureId: string;
  price: number;
  changeDate: string;
  changedBy: string;
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

export interface Patient {
  id: string;
  fullName: string;
  birthDate: string;
  employeeId: string;
  visitDate: string;
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

export interface InitialStock {
  id: string;
  employeeId: string;
  nomenclatureId: string;
  quantity: number;
  date: string;
  createdBy: string;
}

export interface ReturnOperation {
  id: string;
  employeeId: string;
  nomenclatureId: string;
  quantity: number;
  date: string;
  corrected: boolean;
  correctedBy?: string;
  newQuantity?: number;
  reason?: string;
  confirmed?: boolean;
}

export interface Message {
  id: string;
  fromId: string;
  toId: string;
  text: string;
  date: string;
  read: boolean;
}

export interface JournalEntry {
  id: string;
  dateTime: string;
  userId: string;
  table: string;
  recordId: string;
  field: string;
  oldValue: string;
  newValue: string;
}

export interface Notification {
  id: string;
  type: 'overexpense' | 'inactivity' | 'return' | 'message' | 'report' | 'price_change' | 'expense_limit';
  title: string;
  description: string;
  date: string;
  read: boolean;
  relatedId?: string;
}

export const UNIT_LABELS: Record<string, string> = {
  ampoule: 'амп.',
  tablet: 'табл.',
  flacon: 'фл.',
  piece: 'шт.',
};

export const CATEGORY_LABELS: Record<string, string> = {
  medicine: 'Лекарства',
  medicine_pku: 'ЛС пку',
  equipment: 'Оборудование',
  consumable: 'Расходные материалы',
};

export const STATUS_LABELS: Record<string, string> = {
  active: 'Активен',
  inactive: 'Неактивен',
  blocked: 'Заблокирован',
  fired: 'Уволен',
};

export const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700 border-green-200',
  inactive: 'bg-gray-100 text-gray-700 border-gray-200',
  blocked: 'bg-orange-100 text-orange-700 border-orange-200',
  fired: 'bg-red-100 text-red-700 border-red-200',
};
