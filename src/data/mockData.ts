import { Employee, NomenclatureItem, PriceHistory, Income, Patient, Expense, InitialStock, ReturnOperation, Message, JournalEntry, Notification } from '../types';

// Генерация ID
let idCounter = 1000;
const genId = (prefix: string) => `${prefix}_${++idCounter}`;

// 30 сотрудников
export const mockEmployees: Employee[] = [
  { id: 'emp_1', personalNumber: '1001', fullName: 'Иванов Иван Иванович', password: 'pass1001', status: 'active', hireDate: '2020-03-15', lastActivityDate: '2024-01-15' },
  { id: 'emp_2', personalNumber: '1002', fullName: 'Петров Пётр Сергеевич', password: 'pass1002', status: 'active', hireDate: '2019-07-01', lastActivityDate: '2024-01-15' },
  { id: 'emp_3', personalNumber: '1003', fullName: 'Сидорова Анна Михайловна', password: 'pass1003', status: 'active', hireDate: '2021-02-10', lastActivityDate: '2024-01-14' },
  { id: 'emp_4', personalNumber: '1004', fullName: 'Козлов Дмитрий Алексеевич', password: 'pass1004', status: 'active', hireDate: '2018-11-20', lastActivityDate: '2024-01-15' },
  { id: 'emp_5', personalNumber: '1005', fullName: 'Морозова Елена Владимировна', password: 'pass1005', status: 'active', hireDate: '2022-05-03', lastActivityDate: '2024-01-15' },
  { id: 'emp_6', personalNumber: '1006', fullName: 'Волков Андрей Николаевич', password: 'pass1006', status: 'inactive', hireDate: '2020-08-12', lastActivityDate: '2024-01-08' },
  { id: 'emp_7', personalNumber: '1007', fullName: 'Соловьёва Мария Петровна', password: 'pass1007', status: 'active', hireDate: '2021-09-25', lastActivityDate: '2024-01-15' },
  { id: 'emp_8', personalNumber: '1008', fullName: 'Лебедев Сергей Викторович', password: 'pass1008', status: 'active', hireDate: '2019-04-18', lastActivityDate: '2024-01-14' },
  { id: 'emp_9', personalNumber: '1009', fullName: 'Новикова Ольга Дмитриевна', password: 'pass1009', status: 'inactive', hireDate: '2020-01-30', lastActivityDate: '2024-01-02' },
  { id: 'emp_10', personalNumber: '1010', fullName: 'Попов Алексей Игоревич', password: 'pass1010', status: 'active', hireDate: '2022-11-15', lastActivityDate: '2024-01-15' },
  { id: 'emp_11', personalNumber: '1011', fullName: 'Васильева Татьяна Андреевна', password: 'pass1011', status: 'active', hireDate: '2021-06-07', lastActivityDate: '2024-01-15' },
  { id: 'emp_12', personalNumber: '1012', fullName: 'Михайлов Константин Олегович', password: 'pass1012', status: 'active', hireDate: '2019-12-01', lastActivityDate: '2024-01-13' },
  { id: 'emp_13', personalNumber: '1013', fullName: 'Фёдорова Наталья Сергеевна', password: 'pass1013', status: 'active', hireDate: '2020-07-22', lastActivityDate: '2024-01-15' },
  { id: 'emp_14', personalNumber: '1014', fullName: 'Николаев Роман Павлович', password: 'pass1014', status: 'fired', hireDate: '2018-03-10', lastActivityDate: '2023-12-20' },
  { id: 'emp_15', personalNumber: '1015', fullName: 'Кузнецова Ирина Валерьевна', password: 'pass1015', status: 'active', hireDate: '2022-02-14', lastActivityDate: '2024-01-15' },
  { id: 'emp_16', personalNumber: '1016', fullName: 'Орлов Максим Дмитриевич', password: 'pass1016', status: 'active', hireDate: '2021-04-30', lastActivityDate: '2024-01-14' },
  { id: 'emp_17', personalNumber: '1017', fullName: 'Макарова Светлана Юрьевна', password: 'pass1017', status: 'active', hireDate: '2020-10-05', lastActivityDate: '2024-01-15' },
  { id: 'emp_18', personalNumber: '1018', fullName: 'Андреев Виктор Анатольевич', password: 'pass1018', status: 'blocked', hireDate: '2019-08-17', lastActivityDate: '2024-01-05' },
  { id: 'emp_19', personalNumber: '1019', fullName: 'Ковалёва Юлия Александровна', password: 'pass1019', status: 'active', hireDate: '2022-07-19', lastActivityDate: '2024-01-15' },
  { id: 'emp_20', personalNumber: '1020', fullName: 'Григорьев Павел Владимирович', password: 'pass1020', status: 'active', hireDate: '2021-01-11', lastActivityDate: '2024-01-14' },
  { id: 'emp_21', personalNumber: '1021', fullName: 'Белова Екатерина Романовна', password: 'pass1021', status: 'active', hireDate: '2020-05-28', lastActivityDate: '2024-01-15' },
  { id: 'emp_22', personalNumber: '1022', fullName: 'Тарасов Денис Сергеевич', password: 'pass1022', status: 'active', hireDate: '2019-09-14', lastActivityDate: '2024-01-13' },
  { id: 'emp_23', personalNumber: '1023', fullName: 'Комарова Людмила Ивановна', password: 'pass1023', status: 'active', hireDate: '2022-03-22', lastActivityDate: '2024-01-15' },
  { id: 'emp_24', personalNumber: '1024', fullName: 'Жуков Артём Олегович', password: 'pass1024', status: 'active', hireDate: '2021-08-09', lastActivityDate: '2024-01-14' },
  { id: 'emp_25', personalNumber: '1025', fullName: 'Дмитриева Вера Михайловна', password: 'pass1025', status: 'inactive', hireDate: '2020-12-03', lastActivityDate: '2024-01-07' },
  { id: 'emp_26', personalNumber: '1026', fullName: 'Гусев Илья Андреевич', password: 'pass1026', status: 'active', hireDate: '2019-06-25', lastActivityDate: '2024-01-15' },
  { id: 'emp_27', personalNumber: '1027', fullName: 'Антонова Полина Дмитриевна', password: 'pass1027', status: 'active', hireDate: '2022-09-18', lastActivityDate: '2024-01-15' },
  { id: 'emp_28', personalNumber: '1028', fullName: 'Баранов Олег Викторович', password: 'pass1028', status: 'active', hireDate: '2021-11-02', lastActivityDate: '2024-01-14' },
  { id: 'emp_29', personalNumber: '1029', fullName: 'Щербакова Надежда Петровна', password: 'pass1029', status: 'active', hireDate: '2020-04-16', lastActivityDate: '2024-01-15' },
  { id: 'emp_30', personalNumber: '1030', fullName: 'Титов Глеб Максимович', password: 'pass1030', status: 'active', hireDate: '2022-01-27', lastActivityDate: '2024-01-15' },
];

export const mockNomenclature: NomenclatureItem[] = [
  { id: 'nom_1', name: 'Анальгин 50% 2мл', category: 'medicine', unit: 'ampoule', active: true, packageQuantity: 10, pricePerPackage: 450 },
  { id: 'nom_2', name: 'Дексаметазон 4мг/мл', category: 'medicine', unit: 'ampoule', active: true, packageQuantity: 10, pricePerPackage: 850 },
  { id: 'nom_3', name: 'Преднизолон 30мг/мл', category: 'medicine', unit: 'ampoule', active: true, packageQuantity: 10, pricePerPackage: 1200 },
  { id: 'nom_4', name: 'Адреналин 0.1% 1мл', category: 'medicine', unit: 'ampoule', active: true, packageQuantity: 10, pricePerPackage: 1800 },
  { id: 'nom_5', name: 'Фуросемид 10мг/мл', category: 'medicine', unit: 'ampoule', active: true, packageQuantity: 10, pricePerPackage: 350 },
  { id: 'nom_6', name: 'Димедрол 1% 1мл', category: 'medicine', unit: 'ampoule', active: true, packageQuantity: 10, pricePerPackage: 550 },
  { id: 'nom_7', name: 'Натрия хлорид 0.9% 400мл', category: 'medicine', unit: 'flacon', active: true, packageQuantity: 1, pricePerPackage: 65 },
  { id: 'nom_8', name: 'Реополиглюкин 400мл', category: 'medicine', unit: 'flacon', active: true, packageQuantity: 1, pricePerPackage: 320 },
  { id: 'nom_9', name: 'Нитроглицерин 0.5мг', category: 'medicine', unit: 'tablet', active: true, packageQuantity: 20, pricePerPackage: 500 },
  { id: 'nom_10', name: 'Каптоприл 25мг', category: 'medicine', unit: 'tablet', active: true, packageQuantity: 20, pricePerPackage: 900 },
  { id: 'nom_11', name: 'Морфин 1% 1мл', category: 'medicine_pku', unit: 'ampoule', active: true, packageQuantity: 5, pricePerPackage: 2500 },
  { id: 'nom_12', name: 'Промедол 2% 1мл', category: 'medicine_pku', unit: 'ampoule', active: true, packageQuantity: 5, pricePerPackage: 1800 },
  { id: 'nom_13', name: 'Фентанил 0.005% 2мл', category: 'medicine_pku', unit: 'ampoule', active: true, packageQuantity: 5, pricePerPackage: 3200 },
  { id: 'nom_21', name: 'Шприц 5мл', category: 'consumable', unit: 'piece', active: true, packageQuantity: 100, pricePerPackage: 1200 },
  { id: 'nom_22', name: 'Шприц 10мл', category: 'consumable', unit: 'piece', active: true, packageQuantity: 100, pricePerPackage: 1500 },
  { id: 'nom_23', name: 'Шприц 20мл', category: 'consumable', unit: 'piece', active: true, packageQuantity: 100, pricePerPackage: 1800 },
  { id: 'nom_24', name: 'Система для в/в вливания', category: 'consumable', unit: 'piece', active: true, packageQuantity: 50, pricePerPackage: 2250 },
  { id: 'nom_25', name: 'Катетер венозный 18G', category: 'consumable', unit: 'piece', active: true, packageQuantity: 50, pricePerPackage: 4250 },
  { id: 'nom_28', name: 'Салфетки спиртовые', category: 'consumable', unit: 'piece', active: true, packageQuantity: 100, pricePerPackage: 500 },
  { id: 'nom_29', name: 'Перчатки нитриловые M', category: 'consumable', unit: 'piece', active: true, packageQuantity: 100, pricePerPackage: 1500 },
];

export const mockPriceHistory: PriceHistory[] = [
  { id: 'ph_1', nomenclatureId: 'nom_1', price: 45, changeDate: '2023-06-01', changedBy: 'admin' },
  { id: 'ph_2', nomenclatureId: 'nom_2', price: 85, changeDate: '2023-06-01', changedBy: 'admin' },
  { id: 'ph_3', nomenclatureId: 'nom_3', price: 120, changeDate: '2023-06-01', changedBy: 'admin' },
  { id: 'ph_4', nomenclatureId: 'nom_4', price: 180, changeDate: '2023-06-01', changedBy: 'admin' },
  { id: 'ph_5', nomenclatureId: 'nom_5', price: 35, changeDate: '2023-06-01', changedBy: 'admin' },
  { id: 'ph_6', nomenclatureId: 'nom_6', price: 55, changeDate: '2023-06-01', changedBy: 'admin' },
  { id: 'ph_7', nomenclatureId: 'nom_7', price: 65, changeDate: '2023-06-01', changedBy: 'admin' },
  { id: 'ph_8', nomenclatureId: 'nom_8', price: 320, changeDate: '2023-06-01', changedBy: 'admin' },
  { id: 'ph_9', nomenclatureId: 'nom_9', price: 25, changeDate: '2023-06-01', changedBy: 'admin' },
  { id: 'ph_10', nomenclatureId: 'nom_10', price: 45, changeDate: '2023-06-01', changedBy: 'admin' },
  { id: 'ph_21', nomenclatureId: 'nom_21', price: 12, changeDate: '2023-06-01', changedBy: 'admin' },
  { id: 'ph_22', nomenclatureId: 'nom_22', price: 15, changeDate: '2023-06-01', changedBy: 'admin' },
  { id: 'ph_23', nomenclatureId: 'nom_23', price: 18, changeDate: '2023-06-01', changedBy: 'admin' },
  { id: 'ph_24', nomenclatureId: 'nom_24', price: 45, changeDate: '2023-06-01', changedBy: 'admin' },
  { id: 'ph_25', nomenclatureId: 'nom_25', price: 85, changeDate: '2023-06-01', changedBy: 'admin' },
  { id: 'ph_28', nomenclatureId: 'nom_28', price: 5, changeDate: '2023-06-01', changedBy: 'admin' },
  { id: 'ph_29', nomenclatureId: 'nom_29', price: 15, changeDate: '2023-06-01', changedBy: 'admin' },
];

export const mockIncome: Income[] = [
  { id: 'inc_1', employeeId: 'emp_1', amount: 150000, period: '2026-08', shifts: 20, date: '2026-08-01', createdBy: 'admin' },
  { id: 'inc_2', employeeId: 'emp_2', amount: 145000, period: '2026-08', shifts: 19, date: '2026-08-01', createdBy: 'admin' },
  { id: 'inc_3', employeeId: 'emp_3', amount: 160000, period: '2026-08', shifts: 21, date: '2026-08-01', createdBy: 'admin' },
  { id: 'inc_4', employeeId: 'emp_4', amount: 135000, period: '2026-08', shifts: 18, date: '2026-08-01', createdBy: 'admin' },
  { id: 'inc_5', employeeId: 'emp_5', amount: 155000, period: '2026-08', shifts: 20, date: '2026-08-01', createdBy: 'admin' },
];

const patientNames = [
  'Смирнов Алексей Петрович', 'Кузнецова Мария Ивановна', 'Попов Виктор Сергеевич',
  'Васильева Ольга Николаевна', 'Соколов Дмитрий Андреевич', 'Михайлова Елена Викторовна',
  'Новиков Сергей Павлович', 'Фёдорова Татьяна Дмитриевна', 'Морозов Андрей Олегович',
  'Волкова Наталья Юрьевна', 'Алексеев Игорь Владимирович', 'Лебедева Светлана Романовна',
  'Семёнов Павел Константинович', 'Егорова Анна Михайловна', 'Козлов Роман Сергеевич',
  'Степанова Вера Андреевна', 'Николаев Олег Викторович', 'Орлова Ирина Петровна',
  'Андреев Максим Дмитриевич', 'Макарова Людмила Ивановна', 'Яковлев Артём Олегович',
  'Григорьева Полина Сергеевна', 'Романов Денис Александрович', 'Сергеева Надежда Павловна',
  'Тимофеев Глеб Максимович', 'Белова Екатерина Романовна', 'Денисов Илья Андреевич',
];

export const mockPatients: Patient[] = [];
let patientId = 0;
mockEmployees.filter(e => e.status === 'active').forEach(emp => {
  const visitsCount = 10 + Math.floor(Math.random() * 15);
  for (let i = 0; i < visitsCount; i++) {
    patientId++;
    const day = 1 + Math.floor(Math.random() * 28);
    mockPatients.push({
      id: `pat_${patientId}`,
      fullName: patientNames[Math.floor(Math.random() * patientNames.length)],
      birthDate: `19${40 + Math.floor(Math.random() * 60)}-${String(1 + Math.floor(Math.random() * 12)).padStart(2, '0')}-${String(1 + Math.floor(Math.random() * 28)).padStart(2, '0')}`,
      employeeId: emp.id,
      visitDate: `2026-08-${String(day).padStart(2, '0')}`,
    });
  }
});

export const mockExpenses: Expense[] = [];
let expenseId = 0;
const medicineIds = mockNomenclature.filter(n => n.category === 'medicine').map(n => n.id);
const consumableIds = mockNomenclature.filter(n => n.category === 'consumable').map(n => n.id);

mockPatients.forEach(patient => {
  const medsUsed = 2 + Math.floor(Math.random() * 4);
  for (let i = 0; i < medsUsed; i++) {
    expenseId++;
    const isMed = Math.random() > 0.3;
    const pool = isMed ? medicineIds : consumableIds;
    mockExpenses.push({
      id: `exp_${expenseId}`,
      employeeId: patient.employeeId,
      patientId: patient.id,
      nomenclatureId: pool[Math.floor(Math.random() * pool.length)],
      quantity: 1 + Math.floor(Math.random() * 5),
      visitDate: patient.visitDate,
      entryDate: patient.visitDate + 'T' + String(8 + Math.floor(Math.random() * 12)).padStart(2, '0') + ':' + String(Math.floor(Math.random() * 60)).padStart(2, '0'),
      offline: Math.random() > 0.9,
    });
  }
});

export const mockInitialStocks: InitialStock[] = [];
let stockId = 0;
mockEmployees.filter(e => e.status === 'active').forEach(emp => {
  mockNomenclature.forEach(nom => {
    stockId++;
    mockInitialStocks.push({
      id: `stock_${stockId}`,
      employeeId: emp.id,
      nomenclatureId: nom.id,
      quantity: nom.category === 'equipment' ? 1 : 5 + Math.floor(Math.random() * 30),
      date: '2024-01-01',
      createdBy: 'admin',
    });
  });
});

export const mockReturns: ReturnOperation[] = [
  { id: 'ret_1', employeeId: 'emp_1', nomenclatureId: 'nom_1', quantity: 5, date: '2026-01-10', corrected: false, reason: 'Вышел срок годности', confirmed: false },
  { id: 'ret_2', employeeId: 'emp_1', nomenclatureId: 'nom_24', quantity: 2, date: '2026-01-10', corrected: true, correctedBy: 'admin', newQuantity: 1, reason: 'Нарушение упаковки', confirmed: true },
  { id: 'ret_3', employeeId: 'emp_1', nomenclatureId: 'nom_21', quantity: 8, date: '2026-01-10', corrected: false, reason: 'Другая причина', confirmed: false },
  { id: 'ret_4', employeeId: 'emp_3', nomenclatureId: 'nom_2', quantity: 3, date: '2026-01-12', corrected: true, correctedBy: 'storekeeper', newQuantity: 2, reason: 'Вышел срок годности', confirmed: true },
  { id: 'ret_5', employeeId: 'emp_3', nomenclatureId: 'nom_29', quantity: 15, date: '2026-01-12', corrected: false, reason: 'Нарушение упаковки', confirmed: false },
  { id: 'ret_6', employeeId: 'emp_5', nomenclatureId: 'nom_21', quantity: 10, date: '2026-01-14', corrected: false, reason: 'Другая причина', confirmed: false },
  { id: 'ret_7', employeeId: 'emp_5', nomenclatureId: 'nom_7', quantity: 4, date: '2026-01-14', corrected: true, correctedBy: 'admin', newQuantity: 3, reason: 'Вышел срок годности', confirmed: true },
  { id: 'ret_8', employeeId: 'emp_5', nomenclatureId: 'nom_25', quantity: 6, date: '2026-01-14', corrected: false, reason: 'Поломка оборудования', confirmed: false },
  { id: 'ret_9', employeeId: 'emp_4', nomenclatureId: 'nom_25', quantity: 4, date: '2026-01-16', corrected: false, reason: 'Поломка оборудования', confirmed: false },
  { id: 'ret_10', employeeId: 'emp_4', nomenclatureId: 'nom_28', quantity: 20, date: '2026-01-16', corrected: false, reason: 'Вышел срок годности', confirmed: false },
];

export const mockMessages: Message[] = [
  { id: 'msg_1', fromId: 'admin', toId: 'emp_1', text: 'Иван, проверьте остатки расходных материалов', date: '2024-01-14T10:30', read: true },
  { id: 'msg_2', fromId: 'emp_1', toId: 'admin', text: 'Принял к сведению, проверю', date: '2024-01-14T11:15', read: true },
  { id: 'msg_3', fromId: 'admin', toId: 'emp_3', text: 'Сидорова А.М., нужно сдать отчёт до пятницы', date: '2024-01-15T09:00', read: true },
  { id: 'msg_4', fromId: 'emp_5', toId: 'admin', text: 'Нужны дополнительные расходные материалы', date: '2024-01-15T08:45', read: false },
  { id: 'msg_5', fromId: 'storekeeper', toId: 'emp_5', text: 'Принято, подготовлю к выдаче', date: '2024-01-15T09:30', read: true },
  { id: 'msg_6', fromId: 'admin', toId: 'emp_9', text: 'Новикова О.Д., уточните статус', date: '2024-01-10T14:00', read: true },
  { id: 'msg_7', fromId: 'emp_7', toId: 'admin', text: 'Заканчиваются расходники, нужно пополнение', date: '2024-01-15T11:20', read: false },
  { id: 'msg_8', fromId: 'emp_3', toId: 'admin', text: 'Отчёт подготовлю к четвергу, всё по пациентам внесено', date: '2024-01-15T09:30', read: false },
  { id: 'msg_9', fromId: 'storekeeper', toId: 'admin', text: 'Обновил цены в системе', date: '2024-01-15T10:00', read: false },
  { id: 'msg_10', fromId: 'emp_10', toId: 'admin', text: 'У пациента Козлова А.П. возникла реакция на препарат', date: '2024-01-15T10:45', read: false },
  { id: 'msg_11', fromId: 'emp_13', toId: 'admin', text: 'Прошу согласовать возврат расходных материалов — срок годности истекает', date: '2024-01-15T11:10', read: false },
  { id: 'msg_12', fromId: 'emp_2', toId: 'admin', text: 'На выезде закончились расходники, запросил у кладовщика', date: '2024-01-15T12:00', read: false },
  { id: 'msg_13', fromId: 'emp_15', toId: 'admin', text: 'Пациент Смирнов А.П. жалуется на головокружение', date: '2024-01-15T12:30', read: false },
  { id: 'msg_14', fromId: 'emp_8', toId: 'admin', text: 'Прошу заменить оборудование, старое неисправно', date: '2024-01-15T13:00', read: false },
  { id: 'msg_15', fromId: 'emp_20', toId: 'admin', text: 'Сегодня 18 вызовов, все отчёты внесены', date: '2024-01-15T13:30', read: false },
  { id: 'msg_16', fromId: 'emp_1', toId: 'storekeeper', text: 'Добрый день! Подскажите, есть ли в наличии Анальгин 50% 2мл? Нужно 20 ампул', date: '2024-01-15T09:15', read: false },
  { id: 'msg_17', fromId: 'storekeeper', toId: 'emp_1', text: 'Добрый день! Да, есть в наличии. Подготовлю к выдаче', date: '2024-01-15T09:20', read: true },
  { id: 'msg_18', fromId: 'emp_3', toId: 'storekeeper', text: 'Здравствуйте! Нужны расходные материалы: шприцы 5мл - 50 шт, шприцы 10мл - 30 шт', date: '2024-01-15T10:30', read: false },
  { id: 'msg_19', fromId: 'emp_5', toId: 'storekeeper', text: 'Добрый день! У меня закончились перчатки нитриловые. Можно получить 2 коробки?', date: '2024-01-15T11:00', read: false },
  { id: 'msg_20', fromId: 'storekeeper', toId: 'emp_5', text: 'Здравствуйте! Да, конечно. Приходите после обеда', date: '2024-01-15T11:05', read: true },
  { id: 'msg_21', fromId: 'emp_7', toId: 'storekeeper', text: 'Срочно нужны салфетки спиртовые и ватные диски. Сколько есть в наличии?', date: '2024-01-15T11:45', read: false },
  { id: 'msg_22', fromId: 'emp_10', toId: 'storekeeper', text: 'Здравствуйте! Подскажите, когда будет поступление Дексаметазона? У нас его почти не осталось', date: '2024-01-15T12:15', read: false },
  { id: 'msg_23', fromId: 'emp_13', toId: 'storekeeper', text: 'Добрый день! Хочу оформить возврат препаратов с истекающим сроком годности. Когда можно подойти?', date: '2024-01-15T13:00', read: false },
  { id: 'msg_24', fromId: 'storekeeper', toId: 'emp_13', text: 'Добрый день! Можно подойти сегодня с 14:00 до 16:00. Возьмите с собой накладную', date: '2024-01-15T13:10', read: true },
  { id: 'msg_25', fromId: 'emp_2', toId: 'storekeeper', text: 'Привет! Есть ли Prednisolone в таблетках? Нужно 100 штук', date: '2024-01-15T14:00', read: false },
];

export const mockJournal: JournalEntry[] = [
  { id: 'j_2', dateTime: '2024-01-14T16:45', userId: 'admin', table: 'Сотрудники', recordId: 'emp_18', field: 'Статус', oldValue: 'Активен', newValue: 'Заблокирован' },
  { id: 'j_3', dateTime: '2024-01-14T14:20', userId: 'admin', table: 'Приход', recordId: 'inc_1', field: 'Сумма', oldValue: '120000', newValue: '150000' },
  { id: 'j_6', dateTime: '2024-01-10T09:00', userId: 'admin', table: 'Сотрудники', recordId: 'emp_14', field: 'Статус', oldValue: 'Активен', newValue: 'Уволен' },
  { id: 'j_7', dateTime: '2024-01-08T15:30', userId: 'admin', table: 'Сотрудники', recordId: 'emp_6', field: 'Статус', oldValue: 'Активен', newValue: 'Отпуск' },
];

export const mockNotifications: Notification[] = [
  { id: 'n_1', type: 'overexpense', title: 'Перерасход у Петрова П.С.', description: 'Расход (155 000 ₽) превышает приход (150 000 ₽) на 5 000 ₽', date: '2024-01-15T14:30', read: false, relatedId: 'emp_2' },
  { id: 'n_2', type: 'inactivity', title: 'Новикова О.Д. — нет расхода 7 дней', description: 'Последняя активность: 08.01.2024. Статус: Неактивен', date: '2024-01-15T09:00', read: false, relatedId: 'emp_9' },
  { id: 'n_4', type: 'message', title: 'Сообщение от Соловьёвой М.П.', description: 'Нужны дополнительные расходные материалы', date: '2024-01-15T08:45', read: false },
  { id: 'n_6', type: 'overexpense', title: 'Перерасход у Козлова Д.А.', description: 'Расход (140 000 ₽) превышает приход (135 000 ₽) на 5 000 ₽', date: '2024-01-14T16:00', read: true, relatedId: 'emp_4' },
  { id: 'n_exp_1', type: 'expense_limit', title: 'Превышение лимита расхода препаратов', description: 'Лист расхода от 05.08.26: Петров П.С. — Смирнов А.И. Итого по препаратам: 530 ₽ (лимит 6%: 300 ₽)', date: '2026-08-05T10:15', read: false, relatedId: '11' },
  { id: 'n_exp_2', type: 'expense_limit', title: 'Превышение лимита расхода препаратов', description: 'Лист расхода от 04.08.26: Сидорова А.М. — Козлова М.П. Итого по препаратам: 690 ₽ (лимит 6%: 480 ₽)', date: '2026-08-04T14:40', read: false, relatedId: '12' },
];
