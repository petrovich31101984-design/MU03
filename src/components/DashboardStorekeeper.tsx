import { useStore } from '../store/useStore';

interface DashboardProps { onNavigate?: (page: string) => void; }

export default function DashboardStorekeeper({ onNavigate }: DashboardProps) {
  const nomenclature = useStore(s => s.nomenclature);
  const employees = useStore(s => s.employees);
  const activeEmployees = employees.filter(e => e.status === 'active');
  const totalItems = nomenclature.length;
  const totalEmployees = activeEmployees.length;
  const unviewedExpenseSheets = 12;

  return (
    <div className="space-y-6">
      <div><h2 className="text-lg font-semibold text-gray-800 capitalize">{new Date().toLocaleDateString('ru-RU', { month: 'long' })} {new Date().getFullYear()}</h2><p className="text-sm text-gray-500 mt-1">Панель управления складом</p></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 relative overflow-hidden"><div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500"></div><div className="pl-2"><p className="text-sm text-gray-500">Позиций номенклатуры</p><p className="text-xs text-gray-400">(в системе)</p><p className="text-2xl font-bold text-blue-700 mt-1">{totalItems}</p></div></div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 relative overflow-hidden"><div className="absolute left-0 top-0 bottom-0 w-1.5 bg-purple-500"></div><div className="pl-2"><p className="text-sm text-gray-500">Активных сотрудников</p><p className="text-xs text-gray-400">(получают приходы)</p><p className="text-2xl font-bold text-purple-700 mt-1">{totalEmployees}</p></div></div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 relative overflow-hidden"><div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500"></div><div className="pl-2"><p className="text-sm text-gray-500">Не просмотренные листы расхода</p><p className="text-xs text-gray-400">(требуют проверки)</p><p className="text-2xl font-bold text-red-700 mt-1">{unviewedExpenseSheets}</p></div></div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"><h3 className="font-semibold text-gray-800 mb-4">Быстрые действия</h3><div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button onClick={() => onNavigate?.('nomenclature')} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:bg-green-50 hover:border-green-300 transition-all group cursor-pointer"><div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl group-hover:bg-purple-200 transition">💊</div><span className="text-sm font-medium text-gray-700 group-hover:text-green-700">Номенклатура</span></button>
        <button onClick={() => onNavigate?.('income')} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:bg-green-50 hover:border-green-300 transition-all group cursor-pointer"><div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl group-hover:bg-blue-200 transition">📥</div><span className="text-sm font-medium text-gray-700 group-hover:text-green-700">Приходы</span></button>
        <button onClick={() => onNavigate?.('stock')} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:bg-green-50 hover:border-green-300 transition-all group cursor-pointer"><div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl group-hover:bg-green-200 transition">📊</div><span className="text-sm font-medium text-gray-700 group-hover:text-green-700">Остатки</span></button>
        <button onClick={() => onNavigate?.('returns')} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:bg-green-50 hover:border-green-300 transition-all group cursor-pointer"><div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl group-hover:bg-amber-200 transition">↩️</div><span className="text-sm font-medium text-gray-700 group-hover:text-green-700">Возвраты</span></button>
      </div></div>
    </div>
  );
}
