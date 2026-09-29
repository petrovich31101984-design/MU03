import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { STATUS_LABELS, STATUS_COLORS } from '../types';

export default function Report() {
  const employees = useStore(s => s.employees);
  const getEmployeeIncome = useStore(s => s.getEmployeeIncome);
  const getEmployeeExpenseTotal = useStore(s => s.getEmployeeExpenseTotal);
  const getEmployeePatients = useStore(s => s.getEmployeePatients);
  const getCurrentPrice = useStore(s => s.getCurrentPrice);
  const getEmployeeStock = useStore(s => s.getEmployeeStock);
  const getEmployeeStockAtDate = useStore(s => s.getEmployeeStockAtDate);
  const nomenclature = useStore(s => s.nomenclature);

  const [filterType, setFilterType] = useState<'month' | 'quarter' | 'halfyear' | 'year'>('month');
  const [selectedPeriod, setSelectedPeriod] = useState('2026-08');

  const availableMonths = useMemo(() => {
    const months: { value: string; label: string }[] = [];
    const startDate = new Date(2026, 7, 1);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    let year = startDate.getFullYear();
    let month = startDate.getMonth();
    while (year < currentYear || (year === currentYear && month <= currentMonth)) {
      const value = `${year}-${String(month + 1).padStart(2, '0')}`;
      const date = new Date(year, month, 1);
      const label = date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
      months.push({ value, label });
      month++;
      if (month > 11) { month = 0; year++; }
    }
    return months.reverse();
  }, []);

  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years: { value: string; label: string }[] = [];
    for (let y = 2026; y <= currentYear; y++) { years.push({ value: String(y), label: String(y) }); }
    return years.reverse();
  }, []);

  const calculationPeriods = useMemo(() => {
    if (filterType === 'month') return [selectedPeriod];
    else if (filterType === 'quarter') { const year = parseInt(selectedPeriod); return [`${year}-01`, `${year}-02`, `${year}-03`]; }
    else if (filterType === 'halfyear') { const year = parseInt(selectedPeriod); return [`${year}-01`, `${year}-02`, `${year}-03`, `${year}-04`, `${year}-05`, `${year}-06`]; }
    else { const year = parseInt(selectedPeriod); return Array.from({ length: 12 }, (_, i) => `${year}-${String(i + 1).padStart(2, '0')}`); }
  }, [filterType, selectedPeriod]);

  const previousMonth = useMemo(() => {
    const [year, month] = selectedPeriod.split('-').map(Number);
    const date = new Date(year, month - 2, 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }, [selectedPeriod]);

  const currentMonthStart = useMemo(() => {
    const [year, month] = selectedPeriod.split('-').map(Number);
    return `${year}-${String(month).padStart(2, '0')}-01`;
  }, [selectedPeriod]);

  const activeEmployees = employees.filter(e => e.status === 'active');

  const reportData = activeEmployees.map(emp => {
    const income = getEmployeeIncome(emp.id, previousMonth);
    const expense = getEmployeeExpenseTotal(emp.id, previousMonth);
    const patients = getEmployeePatients(emp.id);
    const expenseCount = patients.filter(p => calculationPeriods.some(period => p.visitDate.startsWith(period))).length;
    let stockValue = 0;
    nomenclature.forEach(nom => { 
      const stock = getEmployeeStockAtDate(emp.id, nom.id, currentMonthStart); 
      if (stock > 0) {
        const isPKU = nom.category === 'medicine_pku';
        const unitPrice = isPKU && nom.packageQuantity ? (nom.pricePerPackage || 0) / nom.packageQuantity : getCurrentPrice(nom.id);
        stockValue += stock * unitPrice;
      }
    });
    return { emp, income, expense, expenseCount, stockValue };
  });

  const totalIncome = reportData.reduce((s, r) => s + r.income, 0);
  const totalExpense = reportData.reduce((s, r) => s + r.expense, 0);
  const totalStock = reportData.reduce((s, r) => s + r.stockValue, 0);
  const totalExpenseCount = reportData.reduce((s, r) => s + r.expenseCount, 0);

  const handleExportExcel = () => { alert('Экспорт в Excel (демо-функция)\nВ реальном приложении здесь будет генерация XLSX через SheetJS'); };

  const getPeriodLabel = () => { if (filterType === 'month') { const month = availableMonths.find(m => m.value === selectedPeriod); return month?.label || selectedPeriod; } else { return selectedPeriod; } };
  const getFilterLabel = () => { switch (filterType) { case 'month': return 'за месяц'; case 'quarter': return 'за квартал'; case 'halfyear': return 'за полгода'; case 'year': return 'за год'; } };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"><div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"><div><h2 className="text-xl font-bold text-gray-800">Отчёт {getFilterLabel()}</h2><p className="text-sm text-gray-500 mt-1">Период: {getPeriodLabel()}</p><p className="text-xs text-gray-400 mt-1">Приход и расход указаны за предыдущий месяц, остаток — на начало текущего месяца</p></div><div className="flex items-center gap-3 flex-wrap"><select value={filterType} onChange={e => { const newType = e.target.value as 'month' | 'quarter' | 'halfyear' | 'year'; setFilterType(newType); if (newType === 'month') { setSelectedPeriod(availableMonths[0]?.value || '2026-08'); } else { setSelectedPeriod(availableYears[0]?.value || '2026'); } }} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"><option value="month">За месяц</option><option value="quarter">За квартал</option><option value="halfyear">За полгода</option><option value="year">За год</option></select>{filterType === 'month' ? (<select value={selectedPeriod} onChange={e => setSelectedPeriod(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">{availableMonths.map(m => (<option key={m.value} value={m.value}>{m.label}</option>))}</select>) : (<select value={selectedPeriod} onChange={e => setSelectedPeriod(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">{availableYears.map(y => (<option key={y.value} value={y.value}>{y.label}</option>))}</select>)}<button onClick={handleExportExcel} className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm font-medium flex items-center gap-2">📊 Excel</button></div></div></div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200"><p className="text-sm text-green-700 font-medium">Общий приход</p><p className="text-xs text-green-600 mb-1">(за предыдущий месяц)</p><p className="text-2xl font-bold text-green-800 mt-1">{totalIncome.toLocaleString('ru')} ₽</p></div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 border border-orange-200"><p className="text-sm text-orange-700 font-medium">Общий расход</p><p className="text-xs text-orange-600 mb-1">(за предыдущий месяц)</p><p className="text-2xl font-bold text-orange-800 mt-1">{totalExpense.toLocaleString('ru')} ₽</p></div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200"><p className="text-sm text-blue-700 font-medium">Остаток на подразделение</p><p className="text-xs text-blue-600 mb-1">(на начало текущего месяца)</p><p className="text-2xl font-bold text-blue-800 mt-1">{totalStock.toLocaleString('ru')} ₽</p></div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200"><p className="text-sm text-purple-700 font-medium">Всего листов расхода</p><p className="text-xs text-purple-600 mb-1">({getFilterLabel()})</p><p className="text-2xl font-bold text-purple-800 mt-1">{totalExpenseCount}</p></div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"><div className="p-4 border-b border-gray-200"><h3 className="font-semibold text-gray-800">Детализация по сотрудникам</h3></div><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="bg-gray-50 text-left"><th className="px-4 py-3 font-medium text-gray-600">№</th><th className="px-4 py-3 font-medium text-gray-600">ФИО сотрудника</th><th className="px-4 py-3 font-medium text-gray-600 text-center">Статус</th><th className="px-4 py-3 font-medium text-gray-600 text-center">Листов расхода</th><th className="px-4 py-3 font-medium text-gray-600 text-right">Приход (₽)</th><th className="px-4 py-3 font-medium text-gray-600 text-right">Расход (₽)</th><th className="px-4 py-3 font-medium text-gray-600 text-right">Остаток (₽)</th></tr></thead><tbody className="divide-y divide-gray-100">{reportData.map(row => { const balance = row.income - row.expense; return (<tr key={row.emp.id} className={`hover:bg-gray-50 ${balance < 0 ? 'bg-red-50' : ''}`}><td className="px-4 py-3 text-gray-500">{row.emp.personalNumber}</td><td className="px-4 py-3 font-medium text-gray-800">{row.emp.fullName}</td><td className="px-4 py-3 text-center"><span className={`text-xs px-2 py-1 rounded-full border ${STATUS_COLORS[row.emp.status]}`}>{STATUS_LABELS[row.emp.status]}</span></td><td className="px-4 py-3 text-center font-medium text-gray-700">{row.expenseCount}</td><td className="px-4 py-3 text-right text-green-700 font-medium">{row.income.toLocaleString('ru')}</td><td className="px-4 py-3 text-right text-orange-700 font-medium">{row.expense.toLocaleString('ru')}</td><td className={`px-4 py-3 text-right font-bold ${row.stockValue > 0 ? 'text-blue-700' : 'text-gray-400'}`}>{row.stockValue.toLocaleString('ru')}</td></tr>); })}</tbody><tfoot><tr className="bg-blue-50 font-bold border-t-2 border-blue-200"><td className="px-4 py-3" colSpan={3}>ИТОГО на подразделение</td><td className="px-4 py-3 text-center text-gray-800">{totalExpenseCount}</td><td className="px-4 py-3 text-right text-green-700">{totalIncome.toLocaleString('ru')}</td><td className="px-4 py-3 text-right text-orange-700">{totalExpense.toLocaleString('ru')}</td><td className="px-4 py-3 text-right text-blue-700">{totalStock.toLocaleString('ru')}</td></tr></tfoot></table></div></div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4"><h4 className="font-semibold text-amber-800 text-sm mb-2">ℹ️ Примечания к отчёту</h4><ul className="text-sm text-amber-700 space-y-1"><li>• Приход и расход указаны за предыдущий месяц</li><li>• Остаток рассчитан на начало текущего месяца</li><li>• Количество листов расхода указано за выбранный период</li><li>• Остаток (₽) рассчитан с учётом актуальных цен на номенклатуру</li><li>• Отчёт формируется автоматически 5-го числа каждого месяца</li><li>• Красным выделены строки с перерасходом (расход &gt; приход)</li><li>• Экспорт доступен в формате Excel</li></ul></div>
    </div>
  );
}
