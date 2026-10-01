import { Employee, NomenclatureItem, PriceHistory, Income, Patient, Expense, InitialStock, ReturnOperation, Message, JournalEntry, Notification } from '../types';

export const mockEmployees: Employee[] = [
  { id: 'emp_1', personalNumber: '1001', fullName: 'Иванов Иван Иванович', password: 'pass1001', status: 'active', hireDate: '2020-03-15', lastActivityDate: '2024-01-15' },
  { id: 'emp_2', personalNumber: '1002', fullName: 'Петров Пётр Сергеевич', password: 'pass1002', status: 'active', hireDate: '2019-07-01', lastActivityDate: '2024-01-15' },
  { id: 'emp_3', personalNumber: '1003', fullName: 'Сидорова Анна Михайловна', password: 'pass1003', status: 'active', hireDate: '2021-02-10', lastActivityDate: '2024-01-14' },
  { id: 'emp_4', personalNumber: '1004', fullName: 'Козлов Дмитрий Алексеевич', password: 'pass1004', status: 'active', hireDate: '2018-11-20', lastActivityDate: '2024-01-15' },
  { id: 'emp_5', personalNumber: '1005', fullName: 'Морозова Елена Владимировна', password: 'pass1005', status: 'active', hireDate: '2022-05-03', lastActivityDate: '2024-01-15' },
];

export const mockNomenclature: NomenclatureItem[] = [
  { id: 'nom_1', name: 'Анальгин 50% 2мл', category: 'medicine', unit: 'ampoule', active: true, packageQuantity: 10, pricePerPackage: 450 },
  { id: 'nom_2', name: 'Дексаметазон 4мг/мл', category: 'medicine', unit: 'ampoule', active: true, packageQuantity: 10, pricePerPackage: 850 },
  { id: 'nom_3', name: 'Преднизолон 30мг/мл', category: 'medicine', unit: 'ampoule', active: true, packageQuantity: 10, pricePerPackage: 1200 },
  { id: 'nom_11', name: 'Морфин 1% 1мл', category: 'medicine_pku', unit: 'ampoule', active: true, packageQuantity: 5, pricePerPackage: 2500 },
  { id: 'nom_21', name: 'Шприц 5мл', category: 'consumable', unit: 'piece', active: true, packageQuantity: 100, pricePerPackage: 1200 },
];

export const mockPriceHistory: PriceHistory[] = [
  { id: 'ph_1', nomenclatureId: 'nom_1', price: 45, changeDate: '2023-06-01', changedBy: 'admin' },
  { id: 'ph_2', nomenclatureId: 'nom_2', price: 85, changeDate: '2023-06-01', changedBy: 'admin' },
  { id: 'ph_3', nomenclatureId: 'nom_3', price: 120, changeDate: '2023-06-01', changedBy: 'admin' },
];

export const mockIncome: Income[] = [
  { id: 'inc_1', employeeId: 'emp_1', amount: 150000, period: '2026-08', shifts: 20, date: '2026-08-01', createdBy: 'admin' },
  { id: 'inc_2', employeeId: 'emp_2', amount: 145000, period: '2026-08', shifts: 19, date: '2026-08-01', createdBy: 'admin' },
  { id: 'inc_3', employeeId: 'emp_3', amount: 160000, period: '2026-08', shifts: 21, date: '2026-08-01', createdBy: 'admin' },
];

export const mockPatients: Patient[] = [
  { id: 'pat_1', fullName: 'Смирнов Алексей Петрович', birthDate: '1985-05-12', employeeId: 'emp_1', visitDate: '2026-08-15' },
  { id: 'pat_2', fullName: 'Кузнецова Мария Ивановна', birthDate: '1978-09-23', employeeId: 'emp_2', visitDate: '2026-08-14' },
  { id: 'pat_3', fullName: 'Попов Виктор Сергеевич', birthDate: '1992-03-05', employeeId: 'emp_3', visitDate: '2026-08-13' },
];

export const mockExpenses: Expense[] = [
  { id: 'exp_1', employeeId: 'emp_1', patientId: 'pat_1', nomenclatureId: 'nom_1', quantity: 2, visitDate: '2026-08-15', entryDate: '2026-08-15T10:30', offline: false },
  { id: 'exp_2', employeeId: 'emp_1', patientId: 'pat_1', nomenclatureId: 'nom_2', quantity: 1, visitDate: '2026-08-15', entryDate: '2026-08-15T10:35', offline: false },
  { id: 'exp_3', employeeId: 'emp_2', patientId: 'pat_2', nomenclatureId: 'nom_3', quantity: 3, visitDate: '2026-08-14', entryDate: '2026-08-14T14:20', offline: false },
];

export const mockInitialStocks: InitialStock[] = [
  { id: 'stock_1', employeeId: 'emp_1', nomenclatureId: 'nom_1', quantity: 20, date: '2024-01-01', createdBy: 'admin' },
  { id: 'stock_2', employeeId: 'emp_1', nomenclatureId: 'nom_2', quantity: 15, date: '2024-01-01', createdBy: 'admin' },
  { id: 'stock_3', employeeId: 'emp_2', nomenclatureId: 'nom_1', quantity: 25, date: '2024-01-01', createdBy: 'admin' },
];

export const mockReturns: ReturnOperation[] = [
  { id: 'ret_1', employeeId: 'emp_1', nomenclatureId: 'nom_1', quantity: 5, date: '2026-01-10', corrected: false, reason: 'Вышел срок годности', confirmed: false },
  { id: 'ret_2', employeeId: 'emp_1', nomenclatureId: 'nom_24', quantity: 2, date: '2026-01-10', corrected: true, correctedBy: 'admin', newQuantity: 1, reason: 'Нарушение упаковки', confirmed: true },
];

export const mockMessages: Message[] = [
  { id: 'msg_1', fromId: 'admin', toId: 'emp_1', text: 'Иван, проверьте остатки', date: '2024-01-14T10:30', read: true },
  { id: 'msg_2', fromId: 'emp_1', toId: 'admin', text: 'Принял к сведению', date: '2024-01-14T11:15', read: true },
];

export const mockJournal: JournalEntry[] = [
  { id: 'j_1', dateTime: '2024-01-14T16:45', userId: 'admin', table: 'Сотрудники', recordId: 'emp_18', field: 'Статус', oldValue: 'Активен', newValue: 'Заблокирован' },
  { id: 'j_2', dateTime: '2024-01-14T14:20', userId: 'admin', table: 'Приход', recordId: 'inc_1', field: 'Сумма', oldValue: '120000', newValue: '150000' },
];

export const mockNotifications: Notification[] = [
  { id: 'n_1', type: 'overexpense', title: 'Перерасход у Петрова П.С.', description: 'Расход превышает приход на 5000 ₽', date: '2024-01-15T14:30', read: false, relatedId: 'emp_2' },
  { id: 'n_2', type: 'inactivity', title: 'Новикова О.Д. — нет расхода 7 дней', description: 'Последняя активность: 08.01.2024', date: '2024-01-15T09:00', read: false, relatedId: 'emp_9' },
];
