import { create } from 'zustand';
import {
  Employee, NomenclatureItem, PriceHistory, Income, Patient, Expense,
  InitialStock, ReturnOperation, Message, JournalEntry, Notification,
  EmployeeStatus
} from '../types';
import {
  mockEmployees, mockNomenclature, mockPriceHistory, mockIncome,
  mockPatients, mockExpenses, mockInitialStocks, mockReturns,
  mockMessages, mockJournal, mockNotifications
} from '../data/mockData';
import { getAllData, addEmployee as apiAddEmployee, deleteEmployee as apiDeleteEmployee, clearCache } from '../services/googleSheetsApi';

interface AppState {
  isLoading: boolean;
  employees: Employee[];
  nomenclature: NomenclatureItem[];
  priceHistory: PriceHistory[];
  income: Income[];
  patients: Patient[];
  expenses: Expense[];
  initialStocks: InitialStock[];
  returns: ReturnOperation[];
  messages: Message[];
  journal: JournalEntry[];
  notifications: Notification[];

  // Actions
  addEmployee: (emp: Omit<Employee, 'id'>) => Promise<void>;
  updateEmployeeStatus: (id: string, status: EmployeeStatus) => void;
  updateEmployee: (id: string, data: Partial<Employee>) => void;
  removeEmployee: (id: string) => Promise<void>;
  archiveEmployee: (id: string) => void;

  addNomenclature: (item: Omit<NomenclatureItem, 'id'>) => void;
  updateNomenclature: (id: string, data: Partial<NomenclatureItem>) => void;
  updatePrice: (nomenclatureId: string, newPrice: number, userId: string) => void;
  updatePackagePrice: (nomenclatureId: string, newPackagePrice: number, userId: string) => void;
  removeNomenclature: (nomenclatureId: string) => void;

  addIncome: (income: Omit<Income, 'id'>) => void;
  updateIncome: (id: string, data: Partial<Income>) => void;
  removeIncome: (id: string) => void;
  
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'dateTime'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  addMessage: (msg: Omit<Message, 'id' | 'date'>) => void;
  markMessageRead: (id: string) => void;

  addNotification: (notification: Omit<Notification, 'id'>) => void;

  addReturn: (ret: Omit<ReturnOperation, 'id'>) => void;
  correctReturn: (id: string, newQuantity: number, userId: string) => void;
  confirmReturn: (id: string, userId: string) => void;
  updateReturn: (id: string, data: Partial<ReturnOperation>, userId: string) => void;

  addInitialStock: (stock: Omit<InitialStock, 'id'>) => void;

  // UI state
  openExpenseSheetId: number | null;
  setOpenExpenseSheetId: (id: number | null) => void;
  archivedExpenseSheets: any[];
  addArchivedExpenseSheet: (sheet: any) => void;
  archivedReturns: any[];
  addArchivedReturns: (sheets: any[]) => void;
  archivedIncome: any[];
  addArchivedIncome: (data: any) => void;

  // Data loading
  loadData: () => Promise<void>;

  // Computed helpers
  getCurrentPrice: (nomenclatureId: string) => number;
  getEmployeeExpenses: (employeeId: string) => Expense[];
  getEmployeePatients: (employeeId: string) => Patient[];
  getEmployeeIncome: (employeeId: string, period: string) => number;
  getEmployeeExpenseTotal: (employeeId: string, period: string) => number;
  getEmployeeStock: (employeeId: string, nomenclatureId: string) => number;
  getEmployeeStockAtDate: (employeeId: string, nomenclatureId: string, date: string) => number;
}

export const useStore = create<AppState>((set, get) => ({
  isLoading: true,
  openExpenseSheetId: null,
  setOpenExpenseSheetId: (id) => set({ openExpenseSheetId: id }),
  archivedExpenseSheets: [],
  addArchivedExpenseSheet: (sheet) => set(state => ({
    archivedExpenseSheets: [...state.archivedExpenseSheets, { ...sheet, archivedDate: new Date().toISOString() }]
  })),
  archivedReturns: [],
  addArchivedReturns: (sheets) => set(state => ({
    archivedReturns: [...state.archivedReturns, ...sheets.map(sheet => ({ ...sheet, archivedDate: new Date().toISOString() }))]
  })),
  archivedIncome: [],
  addArchivedIncome: (data) => set(state => ({
    archivedIncome: [...state.archivedIncome, { ...data, archivedDate: new Date().toISOString() }]
  })),

  // Загрузка данных только из Google Sheets
  loadData: async () => {
    set({ isLoading: true });
    
    try {
      const data = await getAllData();
      
      set({
        isLoading: false,
        employees: data.employees || [],
        nomenclature: data.nomenclature || [],
        priceHistory: data.priceHistory || [],
        income: data.income || [],
        patients: data.patients || [],
        expenses: data.expenses || [],
        initialStocks: data.initialStock || [],
        returns: data.returns || [],
        messages: data.messages || [],
        journal: data.journal || [],
        notifications: data.notifications || [],
      });
      
      console.log('✅ Данные загружены из Google Sheets');
    } catch (error) {
      console.error('❌ Ошибка загрузки данных из Google Sheets:', error);
      console.log('⚠️ Используются локальные данные из mockData');
      
      // Если Google Sheets недоступен, используем mock данные
      set({
        isLoading: false,
        employees: mockEmployees,
        nomenclature: mockNomenclature,
        priceHistory: mockPriceHistory,
        income: mockIncome,
        patients: mockPatients,
        expenses: mockExpenses,
        initialStocks: mockInitialStocks,
        returns: mockReturns,
        messages: mockMessages,
        journal: mockJournal,
        notifications: mockNotifications,
      });
    }
  },

  employees: [],
  nomenclature: [],
  priceHistory: [],
  income: [],
  patients: [],
  expenses: [],
  initialStocks: [],
  returns: [],
  messages: [],
  journal: [],
  notifications: [],

  addEmployee: async (emp) => {
    const id = `emp_${Date.now()}`;
    const newEmployee = { ...emp, id };
    
    console.log('🔄 Начинаем добавление сотрудника:', newEmployee);
    
    // Обновляем локальное состояние для мгновенного отклика
    set(state => ({
      employees: [...state.employees, newEmployee],
      journal: [...state.journal, {
        id: `j_${Date.now()}`,
        dateTime: new Date().toISOString().slice(0, 16),
        userId: 'admin',
        table: 'Сотрудники',
        recordId: id,
        field: 'Создание',
        oldValue: '',
        newValue: emp.fullName,
      }]
    }));
    
    console.log('✅ Локальное состояние обновлено');
    
    // Отправляем в Google Sheets
    try {
      console.log('📤 Отправляем запрос в Google Sheets...');
      const result = await apiAddEmployee({
        personalNumber: emp.personalNumber,
        fullName: emp.fullName,
        password: emp.password,
        status: emp.status,
        archived: emp.archived || false,
        hireDate: emp.hireDate,
        lastActivityDate: emp.lastActivityDate,
      });
      console.log('✅ Сотрудник добавлен в Google Sheets:', result);
    } catch (error) {
      console.error('❌ Ошибка добавления сотрудника в Google Sheets:', error);
      if (error instanceof Error) {
        console.error('Детали ошибки:', error.message, error.stack);
      }
    }
  },

  updateEmployeeStatus: (id, status) => {
    set(state => {
      const emp = state.employees.find(e => e.id === id);
      return {
        employees: state.employees.map(e => e.id === id ? { ...e, status } : e),
        journal: [...state.journal, {
          id: `j_${Date.now()}`,
          dateTime: new Date().toISOString().slice(0, 16),
          userId: 'admin',
          table: 'Сотрудники',
          recordId: id,
          field: 'Статус',
          oldValue: emp?.status || '',
          newValue: status,
        }]
      };
    });
  },

  updateEmployee: (id, data) => {
    set(state => {
      const emp = state.employees.find(e => e.id === id);
      const changes: string[] = [];
      
      if (data.fullName && data.fullName !== emp?.fullName) {
        changes.push(`ФИО: ${emp?.fullName} → ${data.fullName}`);
      }
      if (data.personalNumber && data.personalNumber !== emp?.personalNumber) {
        changes.push(`Номер: ${emp?.personalNumber} → ${data.personalNumber}`);
      }
      if (data.password && data.password !== emp?.password) {
        changes.push('Пароль изменён');
      }

      return {
        employees: state.employees.map(e => e.id === id ? { ...e, ...data } : e),
        journal: changes.length > 0 ? [...state.journal, {
          id: `j_${Date.now()}`,
          dateTime: new Date().toISOString().slice(0, 16),
          userId: 'admin',
          table: 'Сотрудники',
          recordId: id,
          field: 'Редактирование',
          oldValue: '',
          newValue: changes.join('; '),
        }] : state.journal
      };
    });
  },

  removeEmployee: async (id) => {
    const employeeName = get().employees.find(e => e.id === id)?.fullName || '';
    
    // Сначала обновляем локальное состояние
    set(state => ({
      employees: state.employees.filter(e => e.id !== id),
      journal: [...state.journal, {
        id: `j_${Date.now()}`,
        dateTime: new Date().toISOString().slice(0, 16),
        userId: 'admin',
        table: 'Сотрудники',
        recordId: id,
        field: 'Удаление',
        oldValue: employeeName,
        newValue: '',
      }]
    }));
    
    // Затем отправляем запрос в Google Sheets
    try {
      console.log('📤 Отправляем запрос на удаление сотрудника в Google Sheets...');
      await apiDeleteEmployee(id);
      console.log('✅ Сотрудник удалён из Google Sheets');
    } catch (error) {
      console.error('❌ Ошибка удаления сотрудника из Google Sheets:', error);
    }
  },

  archiveEmployee: (id) => {
    set(state => ({
      employees: state.employees.map(e => e.id === id ? { ...e, archived: true } : e),
      journal: [...state.journal, {
        id: `j_${Date.now()}`,
        dateTime: new Date().toISOString().slice(0, 16),
        userId: 'admin',
        table: 'Сотрудники',
        recordId: id,
        field: 'Архив',
        oldValue: 'Активен',
        newValue: 'В архиве',
      }]
    }));
  },

  addNomenclature: (item) => {
    const id = `nom_${Date.now()}`;
    set(state => {
      const packageQuantity = item.packageQuantity || 1;
      const pricePerPackage = item.pricePerPackage || 0;
      const initialUnitPrice = packageQuantity > 0 ? pricePerPackage / packageQuantity : 0;

      const newState: any = {
        nomenclature: [...state.nomenclature, { ...item, id }],
        journal: [...state.journal, {
          id: `j_${Date.now()}`,
          dateTime: new Date().toISOString().slice(0, 16),
          userId: 'admin',
          table: 'Номенклатура',
          recordId: id,
          field: 'Создание',
          oldValue: '',
          newValue: item.name,
        }]
      };

      if (pricePerPackage > 0) {
        newState.priceHistory = [...state.priceHistory, {
          id: `ph_${Date.now()}`,
          nomenclatureId: id,
          price: initialUnitPrice,
          changeDate: new Date().toISOString().slice(0, 10),
          changedBy: 'admin',
        }];
      }

      return newState;
    });
  },

  updatePrice: (nomenclatureId, newPrice, userId) => {
    set(state => {
      const currentPrice = get().getCurrentPrice(nomenclatureId);
      const newHistoryEntry: PriceHistory = {
        id: `ph_${Date.now()}`,
        nomenclatureId,
        price: newPrice,
        changeDate: new Date().toISOString().slice(0, 10),
        changedBy: userId,
      };
      return {
        priceHistory: [...state.priceHistory, newHistoryEntry],
        journal: [...state.journal, {
          id: `j_${Date.now()}`,
          dateTime: new Date().toISOString().slice(0, 16),
          userId,
          table: 'Номенклатура',
          recordId: nomenclatureId,
          field: 'Цена',
          oldValue: String(currentPrice),
          newValue: String(newPrice),
        }]
      };
    });
  },

  updatePackagePrice: (nomenclatureId, newPackagePrice, userId) => {
    set(state => {
      const nomenclatureItem = state.nomenclature.find(n => n.id === nomenclatureId);
      if (!nomenclatureItem) return state;

      const oldPackagePrice = nomenclatureItem.pricePerPackage || 0;
      const packageQuantity = nomenclatureItem.packageQuantity || 1;
      
      const updatedNomenclature = state.nomenclature.map(n => 
        n.id === nomenclatureId 
          ? { ...n, pricePerPackage: newPackagePrice }
          : n
      );

      const newUnitPrice = newPackagePrice / packageQuantity;

      const newHistoryEntry: PriceHistory = {
        id: `ph_${Date.now()}`,
        nomenclatureId,
        price: newUnitPrice,
        changeDate: new Date().toISOString().slice(0, 10),
        changedBy: userId,
      };

      return {
        nomenclature: updatedNomenclature,
        priceHistory: [...state.priceHistory, newHistoryEntry],
        journal: [...state.journal, {
          id: `j_${Date.now()}`,
          dateTime: new Date().toISOString().slice(0, 16),
          userId,
          table: 'Номенклатура',
          recordId: nomenclatureId,
          field: 'Цена за упаковку',
          oldValue: String(oldPackagePrice),
          newValue: String(newPackagePrice),
        }]
      };
    });
  },

  updateNomenclature: (id, data) => {
    set(state => {
      const oldItem = state.nomenclature.find(n => n.id === id);
      return {
        nomenclature: state.nomenclature.map(n => n.id === id ? { ...n, ...data } : n),
        journal: [...state.journal, {
          id: `j_${Date.now()}`,
          dateTime: new Date().toISOString().slice(0, 16),
          userId: 'storekeeper',
          table: 'Номенклатура',
          recordId: id,
          field: 'Обновление',
          oldValue: oldItem?.name || '',
          newValue: data.name || oldItem?.name || '',
        }]
      };
    });
  },

  removeNomenclature: (nomenclatureId) => {
    set(state => {
      const item = state.nomenclature.find(n => n.id === nomenclatureId);
      return {
        nomenclature: state.nomenclature.filter(n => n.id !== nomenclatureId),
        journal: [...state.journal, {
          id: `j_${Date.now()}`,
          dateTime: new Date().toISOString().slice(0, 16),
          userId: 'admin',
          table: 'Номенклатура',
          recordId: nomenclatureId,
          field: 'Удаление',
          oldValue: item?.name || '',
          newValue: '',
        }]
      };
    });
  },

  addIncome: (income) => {
    const id = `inc_${Date.now()}`;
    set(state => ({
      income: [...state.income, { ...income, id }],
      journal: [...state.journal, {
        id: `j_${Date.now()}`,
        dateTime: new Date().toISOString().slice(0, 16),
        userId: 'admin',
        table: 'Приход',
        recordId: id,
        field: 'Создание',
        oldValue: '',
        newValue: `${income.amount} ₽`,
      }]
    }));
  },

  updateIncome: (id, data) => {
    set(state => {
      const oldIncome = state.income.find(i => i.id === id);
      return {
        income: state.income.map(i => i.id === id ? { ...i, ...data } : i),
        journal: [...state.journal, {
          id: `j_${Date.now()}`,
          dateTime: new Date().toISOString().slice(0, 16),
          userId: 'admin',
          table: 'Приход',
          recordId: id,
          field: 'Редактирование',
          oldValue: oldIncome ? `${oldIncome.amount} ₽` : '',
          newValue: data.amount ? `${data.amount} ₽` : '',
        }]
      };
    });
  },

  removeIncome: (id) => {
    set(state => {
      const income = state.income.find(i => i.id === id);
      return {
        income: state.income.filter(i => i.id !== id),
        journal: [...state.journal, {
          id: `j_${Date.now()}`,
          dateTime: new Date().toISOString().slice(0, 16),
          userId: 'admin',
          table: 'Приход',
          recordId: id,
          field: 'Удаление',
          oldValue: income ? `${income.amount} ₽` : '',
          newValue: '',
        }]
      };
    });
  },

  addJournalEntry: (entry) => {
    set(state => ({
      journal: [...state.journal, {
        ...entry,
        id: `j_${Date.now()}`,
        dateTime: new Date().toISOString().slice(0, 16),
      }]
    }));
  },

  markNotificationRead: (id) => {
    set(state => ({
      notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    }));
  },

  markAllNotificationsRead: () => {
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, read: true }))
    }));
  },

  addMessage: (msg) => {
    set(state => ({
      messages: [...state.messages, {
        ...msg,
        id: `msg_${Date.now()}`,
        date: new Date().toISOString().slice(0, 16),
      }]
    }));
  },

  markMessageRead: (id) => {
    set(state => ({
      messages: state.messages.map(m => m.id === id ? { ...m, read: true } : m)
    }));
  },

  addNotification: (notification) => {
    set(state => ({
      notifications: [...state.notifications, { ...notification, id: `n_${Date.now()}` }]
    }));
  },

  addReturn: (ret) => {
    const id = `ret_${Date.now()}`;
    set(state => ({
      returns: [...state.returns, { ...ret, id }],
      notifications: [...state.notifications, {
        id: `n_${Date.now()}`,
        type: 'return',
        title: `Новый возврат`,
        description: `Возврат от сотрудника`,
        date: new Date().toISOString().slice(0, 16),
        read: false,
        relatedId: id,
      }],
      journal: [...state.journal, {
        id: `j_${Date.now()}`,
        dateTime: new Date().toISOString().slice(0, 16),
        userId: 'admin',
        table: 'Возвраты',
        recordId: id,
        field: 'Создание',
        oldValue: '',
        newValue: `${ret.quantity} шт.`,
      }]
    }));
  },

  correctReturn: (id, newQuantity, userId) => {
    set(state => {
      const ret = state.returns.find(r => r.id === id);
      return {
        returns: state.returns.map(r => r.id === id ? {
          ...r, corrected: true, correctedBy: userId, newQuantity
        } : r),
        journal: [...state.journal, {
          id: `j_${Date.now()}`,
          dateTime: new Date().toISOString().slice(0, 16),
          userId,
          table: 'Возвраты',
          recordId: id,
          field: 'Количество',
          oldValue: String(ret?.quantity || ''),
          newValue: String(newQuantity),
        }]
      };
    });
  },

  confirmReturn: (id, userId) => {
    set(state => {
      return {
        returns: state.returns.map(r => r.id === id ? {
          ...r, confirmed: true
        } : r),
        journal: [...state.journal, {
          id: `j_${Date.now()}`,
          dateTime: new Date().toISOString().slice(0, 16),
          userId,
          table: 'Возвраты',
          recordId: id,
          field: 'Подтверждение',
          oldValue: 'Не подтверждено',
          newValue: 'Подтверждено',
        }]
      };
    });
  },

  updateReturn: (id, data, userId) => {
    set(state => {
      const ret = state.returns.find(r => r.id === id);
      const changes: string[] = [];
      
      if (data.quantity !== undefined && data.quantity !== ret?.quantity) {
        changes.push(`Количество: ${ret?.quantity} → ${data.quantity}`);
      }
      if (data.reason !== undefined && data.reason !== ret?.reason) {
        changes.push(`Причина: ${ret?.reason || '—'} → ${data.reason}`);
      }

      return {
        returns: state.returns.map(r => r.id === id ? { ...r, ...data } : r),
        journal: changes.length > 0 ? [...state.journal, {
          id: `j_${Date.now()}`,
          dateTime: new Date().toISOString().slice(0, 16),
          userId,
          table: 'Возвраты',
          recordId: id,
          field: 'Редактирование',
          oldValue: '',
          newValue: changes.join('; '),
        }] : state.journal
      };
    });
  },

  addInitialStock: (stock) => {
    set(state => ({
      initialStocks: [...state.initialStocks, { ...stock, id: `stock_${Date.now()}` }]
    }));
  },

  getCurrentPrice: (nomenclatureId) => {
    const state = get();
    const prices = state.priceHistory
      .filter(p => p.nomenclatureId === nomenclatureId)
      .sort((a, b) => b.changeDate.localeCompare(a.changeDate));
    return prices.length > 0 ? prices[0].price : 0;
  },

  getEmployeeExpenses: (employeeId) => {
    return get().expenses.filter(e => e.employeeId === employeeId);
  },

  getEmployeePatients: (employeeId) => {
    return get().patients.filter(p => p.employeeId === employeeId);
  },

  getEmployeeIncome: (employeeId, period) => {
    const inc = get().income.find(i => i.employeeId === employeeId && i.period === period);
    return inc?.amount || 0;
  },

  getEmployeeExpenseTotal: (employeeId, period) => {
    const state = get();
    const empExpenses = state.expenses.filter(e =>
      e.employeeId === employeeId && e.visitDate.startsWith(period)
    );
    let total = 0;
    empExpenses.forEach(exp => {
      const price = get().getCurrentPrice(exp.nomenclatureId);
      total += price * exp.quantity;
    });
    return total;
  },

  getEmployeeStock: (employeeId, nomenclatureId) => {
    const state = get();
    const initial = state.initialStocks
      .filter(s => s.employeeId === employeeId && s.nomenclatureId === nomenclatureId)
      .reduce((sum, s) => sum + s.quantity, 0);
    const consumed = state.expenses
      .filter(e => e.employeeId === employeeId && e.nomenclatureId === nomenclatureId)
      .reduce((sum, e) => sum + e.quantity, 0);
    const returned = state.returns
      .filter(r => r.employeeId === employeeId && r.nomenclatureId === nomenclatureId)
      .reduce((sum, r) => sum + (r.corrected && r.newQuantity !== undefined ? r.newQuantity : r.quantity), 0);
    return initial - consumed - returned;
  },

  getEmployeeStockAtDate: (employeeId, nomenclatureId, date) => {
    const state = get();
    const initial = state.initialStocks
      .filter(s => s.employeeId === employeeId && s.nomenclatureId === nomenclatureId && s.date <= date)
      .reduce((sum, s) => sum + s.quantity, 0);
    const consumed = state.expenses
      .filter(e => e.employeeId === employeeId && e.nomenclatureId === nomenclatureId && e.visitDate < date)
      .reduce((sum, e) => sum + e.quantity, 0);
    const returned = state.returns
      .filter(r => r.employeeId === employeeId && r.nomenclatureId === nomenclatureId && r.date < date)
      .reduce((sum, r) => sum + (r.corrected && r.newQuantity !== undefined ? r.newQuantity : r.quantity), 0);
    return initial - consumed - returned;
  },
}));
