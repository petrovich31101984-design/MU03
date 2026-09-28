import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Income as IncomeType } from '../types';
import { formatDate } from '../utils/dateFormat';
export default function IncomeStorekeeper() {
  const employees = useStore(s => s.employees);
  const income = useStore(s => s.income);
  const addIncome = useStore(s => s.addIncome);
  const updateIncome = useStore(s => s.updateIncome);
  const removeIncome = useStore(s => s.removeIncome);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [amount, setAmount] = useState('');
  const [modalPeriod, setModalPeriod] = useState('2026-08');
  const [selectedPeriod, setSelectedPeriod] = useState('2026-08');
  const getFilteredIncome = () => { if (selectedPeriod === 'all') return income; return income.filter(i => i.period === selectedPeriod); };
  const periodIncome = getFilteredIncome();
  const totalIncome = periodIncome.reduce((s, i) => s + i.amount, 0);
  const getPeriodLabel = () => { switch (selectedPeriod) { case 'all': return 'Все время'; case '2026-08': return 'Август 2026'; default: return selectedPeriod; } };
  const handleOpenModal = (incomeData?: IncomeType) => { if (incomeData) { setEditingId(incomeData.id); setSelectedEmployee(incomeData.employeeId); setAmount(String(incomeData.amount)); setModalPeriod(incomeData.period); } else { setEditingId(null); setSelectedEmployee(''); setAmount(''); setModalPeriod(selectedPeriod); } setShowModal(true); };
  const handleCloseModal = () => { setShowModal(false); setEditingId(null); setSelectedEmployee(''); setAmount(''); };
  const handleSave = () => { if (!selectedEmployee || !amount) return; if (editingId) { updateIncome(editingId, { employeeId: selectedEmployee, amount: Number(amount), period: modalPeriod }); } else { addIncome({ employeeId: selectedEmployee, amount: Number(amount), period: modalPeriod, shifts: 0, date: new Date().toISOString().slice(0, 10), createdBy: 'storekeeper' }); } handleCloseModal(); };
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"><h3 className="font-semibold text-gray-800 mb-4">Приход на подразделение</h3>
        <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-2">Период:</label><select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"><option value="2026-08">Август 2026</option><option value="2026-07">Июль 2026</option><option value="all">Все время</option></select></div>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200"><p className="text-sm text-gray-600 mb-1">{getPeriodLabel()}</p><p className="text-3xl font-bold text-green-700">{totalIncome.toLocaleString('ru')} ₽</p></div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"><div className="p-4 border-b border-gray-200 flex items-center justify-between"><h3 className="font-semibold text-gray-800">Приходы: {getPeriodLabel()}</h3><button onClick={() => handleOpenModal()} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">+ Добавить</button></div>
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="bg-gray-50 text-left"><th className="px-4 py-3 font-medium text-gray-600">ФИО</th><th className="px-4 py-3 font-medium text-gray-600">Дата</th><th className="px-4 py-3 font-medium text-gray-600 text-right">Сумма (₽)</th><th className="px-4 py-3 font-medium text-gray-600 text-center">Действия</th></tr></thead><tbody className="divide-y divide-gray-100">{periodIncome.map(inc => { const emp = employees.find(e => e.id === inc.employeeId); if (!emp) return null; return (<tr key={inc.id} className="hover:bg-gray-50"><td className="px-4 py-3 font-medium text-gray-800">{emp.fullName}</td><td className="px-4 py-3 text-gray-600">{formatDate(inc.date)}</td><td className="px-4 py-3 text-right text-green-700 font-medium">{inc.amount.toLocaleString('ru')}</td><td className="px-4 py-3 text-center"><button onClick={() => handleOpenModal(inc)} className="p-1 text-gray-600 hover:text-green-600">✏️</button><button onClick={() => removeIncome(inc.id)} className="p-1 text-gray-600 hover:text-red-600 ml-2">🗑️</button></td></tr>); })}</tbody></table></div>
      </div>
      {showModal && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"><h3 className="text-lg font-semibold text-gray-800 mb-4">{editingId ? 'Редактировать' : 'Добавить приход'}</h3><div className="space-y-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Период</label><select value={modalPeriod} onChange={(e) => setModalPeriod(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg"><option value="2026-08">Август 2026</option><option value="2026-07">Июль 2026</option></select></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Сотрудник</label><select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg"><option value="">Выберите</option>{employees.filter(e => e.status === 'active').map(emp => (<option key={emp.id} value={emp.id}>{emp.fullName}</option>))}</select></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Сумма (₽)</label><input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div></div><div className="flex gap-3 mt-6"><button onClick={handleCloseModal} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg">Отмена</button><button onClick={handleSave} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Сохранить</button></div></div></div>)}
    </div>
  );
}
