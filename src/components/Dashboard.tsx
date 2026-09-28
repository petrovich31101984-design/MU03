import { useStore } from '../store/useStore';
import { formatDateTime } from '../utils/dateFormat';

interface DashboardProps { onNavigate?: (page: string) => void; }

export default function Dashboard({ onNavigate }: DashboardProps) {
  const employees = useStore(s => s.employees);
  const nomenclature = useStore(s => s.nomenclature);
  const notifications = useStore(s => s.notifications);
  const messages = useStore(s => s.messages);
  const getCurrentPrice = useStore(s => s.getCurrentPrice);
  const getEmployeeStock = useStore(s => s.getEmployeeStock);
  const getEmployeeStockAtDate = useStore(s => s.getEmployeeStockAtDate);
  const markNotificationRead = useStore(s => s.markNotificationRead);
  const markMessageRead = useStore(s => s.markMessageRead);
  const setOpenExpenseSheetId = useStore(s => s.setOpenExpenseSheetId);

  const activeEmployees = employees.filter(e => e.status === 'active');
  const unreadNotifications = notifications.filter(n => !n.read && n.type !== 'message');
  const unreadMessages = messages.filter(m => m.toId === 'admin' && !m.read);

  const today = new Date();
  const previousMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const previousMonth = `${previousMonthDate.getFullYear()}-${String(previousMonthDate.getMonth() + 1).padStart(2, '0')}`;
  const previousMonthLabel = `${previousMonthDate.toLocaleDateString('ru-RU', { month: 'long' })} ${previousMonthDate.getFullYear()}`;
  const currentMonthStart = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;

  let totalStockValue = 0;
  activeEmployees.forEach(emp => {
    nomenclature.forEach(nom => {
      const stock = getEmployeeStockAtDate(emp.id, nom.id, currentMonthStart);
      if (stock > 0) { totalStockValue += stock * getCurrentPrice(nom.id); }
    });
  });

  const employeeSummary = activeEmployees.map(emp => {
    const income = useStore.getState().getEmployeeIncome(emp.id, previousMonth);
    const expense = useStore.getState().getEmployeeExpenseTotal(emp.id, previousMonth);
    return { emp, income, expense };
  });

  const totalIncome = employeeSummary.reduce((s, e) => s + e.income, 0);
  const totalExpense = employeeSummary.reduce((s, e) => s + e.expense, 0);

  const getEmployeeName = (id: string) => {
    if (id === 'storekeeper') return 'Кладовщик';
    const emp = employees.find(e => e.id === id);
    return emp?.fullName || id;
  };

  const handleNotificationClick = (notification: any) => {
    markNotificationRead(notification.id);
    if (notification.type === 'expense_limit' && onNavigate) {
      if (notification.relatedId) { setOpenExpenseSheetId(Number(notification.relatedId)); }
      onNavigate('expenses');
    }
  };

  const handleMessageClick = (id: string) => { markMessageRead(id); };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 capitalize">{new Date().toLocaleDateString('ru-RU', { month: 'long' })} {new Date().getFullYear()}</h2>
        <p className="text-sm text-gray-500 mt-1">Данные о приходе и расходе указаны за предыдущий месяц ({previousMonthLabel}), остаток — на начало текущего месяца</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 relative overflow-hidden"><div className="absolute left-0 top-0 bottom-0 w-1.5 bg-green-500"></div><div className="pl-2"><p className="text-sm text-gray-500">Приход</p><p className="text-xs text-gray-400">(за предыдущий месяц)</p><p className="text-2xl font-bold text-green-700 mt-1">{totalIncome.toLocaleString('ru')} ₽</p><p className="text-xs text-gray-400 mt-1">{previousMonthLabel}</p></div></div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 relative overflow-hidden"><div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500"></div><div className="pl-2"><p className="text-sm text-gray-500">Расход</p><p className="text-xs text-gray-400">(за предыдущий месяц)</p><p className="text-2xl font-bold text-red-700 mt-1">{totalExpense.toLocaleString('ru')} ₽</p><p className="text-xs text-gray-400 mt-1">{previousMonthLabel}</p></div></div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 relative overflow-hidden"><div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500"></div><div className="pl-2"><p className="text-sm text-gray-500">Остаток</p><p className="text-xs text-gray-400">(на начало текущего месяца)</p><p className="text-2xl font-bold text-blue-700 mt-1">{totalStockValue.toLocaleString('ru')} ₽</p><p className="text-xs text-gray-400 mt-1">на подразделение</p></div></div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 relative overflow-hidden"><div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-700"></div><div className="pl-2"><p className="text-sm text-gray-500">Сотрудников активно</p><p className="text-2xl font-bold text-amber-700 mt-1">{activeEmployees.length}</p><p className="text-xs text-gray-400 mt-1">из {employees.length} всего</p></div></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between"><h3 className="font-semibold text-gray-800 flex items-center gap-2">💬 Сообщения{unreadMessages.length > 0 && (<span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">{unreadMessages.length}</span>)}</h3></div>
          <div className="max-h-96 overflow-auto">
            {unreadMessages.length === 0 ? (<div className="p-8 text-center text-gray-400"><div className="text-3xl mb-2">📭</div><p className="text-sm">Нет непрочитанных сообщений</p></div>) : (
              <div className="divide-y divide-gray-100">{unreadMessages.slice(0, 3).map(msg => (
                <div key={msg.id} onClick={() => handleMessageClick(msg.id)} className="p-4 hover:bg-blue-50 cursor-pointer transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm flex-shrink-0">{msg.fromId === 'storekeeper' ? '📦' : '👨‍⚕️'}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2"><p className="font-medium text-sm text-gray-800 truncate">{getEmployeeName(msg.fromId)}</p><span className="text-xs text-gray-400 flex-shrink-0">{formatDateTime(msg.date).split(' ')[1]}</span></div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{msg.text}</p>
                    </div>
                  </div>
                </div>
              ))}</div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between"><h3 className="font-semibold text-gray-800 flex items-center gap-2">🔔 Уведомления{unreadNotifications.length > 0 && (<span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{unreadNotifications.length}</span>)}</h3></div>
          <div className="max-h-96 overflow-auto">
            {unreadNotifications.length === 0 ? (<div className="p-8 text-center text-gray-400"><div className="text-3xl mb-2">🔕</div><p className="text-sm">Нет непрочитанных уведомлений</p></div>) : (
              <div className="divide-y divide-gray-100">{unreadNotifications.slice(0, 5).map(notification => (
                <div key={notification.id} onClick={() => handleNotificationClick(notification)} className={`p-4 cursor-pointer transition-colors ${notification.type === 'overexpense' ? 'hover:bg-red-50' : notification.type === 'inactivity' ? 'hover:bg-amber-50' : notification.type === 'return' ? 'hover:bg-blue-50' : notification.type === 'expense_limit' ? 'hover:bg-red-50' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">{notification.type === 'overexpense' ? '🚨' : notification.type === 'inactivity' ? '⏰' : notification.type === 'return' ? '↩️' : notification.type === 'message' ? '💬' : notification.type === 'price_change' ? '💰' : notification.type === 'expense_limit' ? '⚠️' : 'ℹ️'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between"><p className="font-medium text-sm text-gray-800">{notification.title}</p>{notification.type === 'expense_limit' && (<span className="text-xs text-blue-600 ml-2 flex-shrink-0">Перейти →</span>)}</div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDateTime(notification.date)}</p>
                    </div>
                  </div>
                </div>
              ))}</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between"><h3 className="font-semibold text-gray-800">Сотрудники — общая сводка</h3><span className="text-sm text-gray-500">{activeEmployees.length} активных</span></div>
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="bg-gray-50 text-left"><th className="px-4 py-3 font-medium text-gray-600">Сотрудник</th><th className="px-4 py-3 font-medium text-gray-600 text-center">Статус</th><th className="px-4 py-3 font-medium text-gray-600 text-right"><div>Приход (₽)</div><div className="text-xs font-normal text-gray-400">за {previousMonthLabel}</div></th><th className="px-4 py-3 font-medium text-gray-600 text-right"><div>Расход (₽)</div><div className="text-xs font-normal text-gray-400">за {previousMonthLabel}</div></th><th className="px-4 py-3 font-medium text-gray-600 text-right"><div>Баланс (₽)</div><div className="text-xs font-normal text-gray-400">приход − расход</div></th><th className="px-4 py-3 font-medium text-gray-600 text-center">Листов расхода</th></tr></thead><tbody className="divide-y divide-gray-100">{employeeSummary.filter(row => row.emp.status === 'active').slice(0, 4).map(row => { const balance = row.income - row.expense; return (<tr key={row.emp.id} className={`hover:bg-gray-50 ${balance < 0 ? 'bg-red-50' : ''}`}><td className="px-4 py-3"><div className="font-medium text-gray-800">{row.emp.fullName}</div><div className="text-xs text-gray-500">№{row.emp.personalNumber}</div></td><td className="px-4 py-3 text-center"><span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">Активен</span></td><td className="px-4 py-3 text-right text-green-700 font-medium">{row.income.toLocaleString('ru')}</td><td className="px-4 py-3 text-right text-orange-700 font-medium">{row.expense.toLocaleString('ru')}</td><td className={`px-4 py-3 text-right font-bold ${balance < 0 ? 'text-red-600' : 'text-blue-700'}`}>{balance >= 0 ? '+' : ''}{balance.toLocaleString('ru')}</td><td className="px-4 py-3 text-center font-medium text-purple-700">{useStore.getState().getEmployeePatients(row.emp.id).length}</td></tr>); })}</tbody></table></div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Быстрые действия</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button onClick={() => onNavigate?.('nomenclature')} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-all group cursor-pointer"><div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl group-hover:bg-purple-200 transition">💊</div><span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Номенклатура</span></button>
          <button onClick={() => onNavigate?.('employees')} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-all group cursor-pointer"><div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl group-hover:bg-blue-200 transition">👥</div><span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Сотрудники</span></button>
          <button onClick={() => onNavigate?.('report')} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-all group cursor-pointer"><div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl group-hover:bg-green-200 transition">📊</div><span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Отчёты</span></button>
          <button onClick={() => onNavigate?.('archive')} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-all group cursor-pointer"><div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl group-hover:bg-amber-200 transition">📁</div><span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Архив</span></button>
        </div>
      </div>
    </div>
  );
}
