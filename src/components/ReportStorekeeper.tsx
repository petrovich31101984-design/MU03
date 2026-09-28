import { useStore } from '../store/useStore';

export default function ReportStorekeeper() {
  const income = useStore(s => s.income);
  const returns = useStore(s => s.returns);
  const currentDate = new Date();
  const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const previousMonthPeriod = `${previousMonth.getFullYear()}-${String(previousMonth.getMonth() + 1).padStart(2, '0')}`;
  const previousMonthLabel = previousMonth.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
  const previousMonthIncome = income.filter(i => i.period === previousMonthPeriod).reduce((s, i) => s + i.amount, 0);
  const totalReturns = returns.length;
  const archivedExpenseSheets = useStore(s => s.archivedExpenseSheets);
  const previousMonthExpenseSheets = archivedExpenseSheets.filter(sheet => {
    const sheetDate = new Date(sheet.date);
    return sheetDate.getFullYear() === previousMonth.getFullYear() && sheetDate.getMonth() === previousMonth.getMonth();
  }).length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"><div><h2 className="text-xl font-bold text-gray-800">Отчёты</h2><p className="text-sm text-gray-500 mt-1">Сводная информация по складу</p></div></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200"><p className="text-sm text-green-700 font-medium">Общий приход</p><p className="text-xs text-green-600">(за предыдущий месяц)</p><p className="text-2xl font-bold text-green-800 mt-1">{previousMonthIncome.toLocaleString('ru')} ₽</p><p className="text-xs text-green-600 mt-1">{previousMonthLabel}</p></div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200"><p className="text-sm text-purple-700 font-medium">Возвратов</p><p className="text-2xl font-bold text-purple-800 mt-1">{totalReturns}</p><p className="text-xs text-purple-600 mt-1">за всё время</p></div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200"><p className="text-sm text-blue-700 font-medium">Листов расхода</p><p className="text-xs text-blue-600">(за предыдущий месяц)</p><p className="text-2xl font-bold text-blue-800 mt-1">{previousMonthExpenseSheets}</p><p className="text-xs text-blue-600 mt-1">{previousMonthLabel}</p></div>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4"><p className="text-sm text-blue-700"><span className="font-semibold">Примечание:</span> Отчёт содержит сводную информацию по всем операциям. Для детализации используйте соответствующие разделы (Приходы, Возвраты, Остатки).</p></div>
    </div>
  );
}
