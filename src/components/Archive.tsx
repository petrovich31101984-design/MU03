import { useState } from 'react';
import { useStore } from '../store/useStore';
import { formatDate } from '../utils/dateFormat';
export default function Archive() {
  const employees = useStore(s => s.employees);
  const nomenclature = useStore(s => s.nomenclature);
  const archivedExpenseSheets = useStore(s => s.archivedExpenseSheets);
  const archivedReturns = useStore(s => s.archivedReturns);
  const archivedIncome = useStore(s => s.archivedIncome);
  const [searchDate, setSearchDate] = useState('');
  const [searchPatient, setSearchPatient] = useState('');
  const [activeTab, setActiveTab] = useState<'sheets' | 'returns' | 'income' | 'employees'>('sheets');
  const archivedEmployees = employees.filter(e => e.archived);
  const getNomenclatureName = (id: string) => nomenclature.find(n => n.id === id)?.name || id;
  const formatPatientName = (fullName: string) => { const parts = fullName.split(' '); if (parts.length >= 3) return `${parts[0]} ${parts[1][0]}.${parts[2][0]}.`; return fullName; };
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"><div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"><div><h2 className="text-xl font-bold text-gray-800">📁 Архив</h2><p className="text-sm text-gray-500 mt-1">Информация, отправленная в архив</p></div><div className="flex flex-wrap items-center gap-3"><input type="text" placeholder="Дата (дд.мм.гг)" value={searchDate} onChange={e => setSearchDate(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm" /><input type="text" placeholder="Пациент (ФИО)" value={searchPatient} onChange={e => setSearchPatient(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div></div></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200"><p className="text-sm text-gray-700 font-medium">Листов расхода</p><p className="text-2xl font-bold text-gray-800 mt-1">{archivedExpenseSheets.length}</p></div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200"><p className="text-sm text-purple-700 font-medium">Возвратов</p><p className="text-2xl font-bold text-purple-800 mt-1">{archivedReturns.length}</p></div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200"><p className="text-sm text-green-700 font-medium">Приходов</p><p className="text-2xl font-bold text-green-800 mt-1">{archivedIncome.length}</p></div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200"><p className="text-sm text-blue-700 font-medium">Сотрудников</p><p className="text-2xl font-bold text-blue-800 mt-1">{archivedEmployees.length}</p></div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button onClick={() => setActiveTab('sheets')} className={`flex-1 px-4 py-3 text-sm font-medium ${activeTab === 'sheets' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500' : 'text-gray-600 hover:bg-gray-50'}`}>📋 Листы расхода ({archivedExpenseSheets.length})</button>
          <button onClick={() => setActiveTab('returns')} className={`flex-1 px-4 py-3 text-sm font-medium ${activeTab === 'returns' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500' : 'text-gray-600 hover:bg-gray-50'}`}>↩️ Возвраты ({archivedReturns.length})</button>
          <button onClick={() => setActiveTab('income')} className={`flex-1 px-4 py-3 text-sm font-medium ${activeTab === 'income' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500' : 'text-gray-600 hover:bg-gray-50'}`}>📥 Приходы ({archivedIncome.length})</button>
          <button onClick={() => setActiveTab('employees')} className={`flex-1 px-4 py-3 text-sm font-medium ${activeTab === 'employees' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500' : 'text-gray-600 hover:bg-gray-50'}`}>👥 Сотрудники ({archivedEmployees.length})</button>
        </div>
        <div className="p-4 max-h-[600px] overflow-y-auto">
          {activeTab === 'sheets' && (archivedExpenseSheets.length === 0 ? (<div className="p-12 text-center text-gray-400"><div className="text-4xl mb-3">📭</div><p className="text-sm">Архив листов расхода пуст</p></div>) : (<div className="space-y-4">{archivedExpenseSheets.map((sheet, idx) => (<div key={idx} className="border border-gray-200 rounded-xl overflow-hidden"><div className="p-4 bg-gray-50 border-b"><h4 className="font-bold text-gray-800">Лист расхода #{sheet.id}</h4><p className="text-sm text-gray-600">Дата: {sheet.date} | Сотрудник: {formatPatientName(sheet.employee)} | Пациент: {formatPatientName(sheet.patient)}</p></div><div className="p-4"><table className="w-full text-sm"><thead><tr className="bg-gray-50 text-left"><th className="px-3 py-2">Название</th><th className="px-3 py-2 text-center">Тип</th><th className="px-3 py-2 text-center">Кол-во</th><th className="px-3 py-2 text-right">Сумма</th></tr></thead><tbody>{sheet.items.map((item: any, i: number) => (<tr key={i} className="border-b"><td className="px-3 py-2 font-medium">{item.name}</td><td className="px-3 py-2 text-center"><span className={`text-xs px-2 py-0.5 rounded-full ${item.type === 'Лекарство' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>{item.type}</span></td><td className="px-3 py-2 text-center">{item.quantity}</td><td className="px-3 py-2 text-right font-medium text-orange-700">{item.sum} ₽</td></tr>))}</tbody></table></div></div>))}</div>))}
          {activeTab === 'returns' && (archivedReturns.length === 0 ? (<div className="p-12 text-center text-gray-400"><div className="text-4xl mb-3">📭</div><p className="text-sm">Архив возвратов пуст</p></div>) : (<div className="space-y-4">{archivedReturns.map((sheet: any, idx: number) => { const emp = employees.find(e => e.id === sheet.employeeId); return (<div key={idx} className="border border-gray-200 rounded-xl overflow-hidden"><div className="p-4 bg-gray-50 border-b"><h4 className="font-bold text-gray-800">Возврат от {formatDate(sheet.date)}</h4><p className="text-sm text-gray-600">Сотрудник: {emp?.fullName || sheet.employeeId}</p></div></div>); })}</div>))}
          {activeTab === 'income' && (archivedIncome.length === 0 ? (<div className="p-12 text-center text-gray-400"><div className="text-4xl mb-3">📭</div><p className="text-sm">Архив приходов пуст</p></div>) : (<div className="space-y-4">{archivedIncome.map((data: any, idx: number) => (<div key={idx} className="border border-gray-200 rounded-xl overflow-hidden"><div className="p-4 bg-green-50 border-b"><h4 className="font-bold text-gray-800">📥 Приходы: {data.period}</h4><p className="text-sm text-gray-600">Сумма: {data.totalAmount?.toLocaleString('ru')} ₽</p></div></div>))}</div>))}
          {activeTab === 'employees' && (archivedEmployees.length === 0 ? (<div className="p-12 text-center text-gray-400"><div className="text-4xl mb-3">📭</div><p className="text-sm">Архив сотрудников пуст</p></div>) : (<table className="w-full text-sm"><thead><tr className="bg-gray-50 text-left"><th className="px-4 py-3 font-medium text-gray-600">№</th><th className="px-4 py-3 font-medium text-gray-600">ФИО</th><th className="px-4 py-3 font-medium text-gray-600 text-center">Статус</th></tr></thead><tbody className="divide-y divide-gray-100">{archivedEmployees.map(emp => (<tr key={emp.id} className="hover:bg-gray-50"><td className="px-4 py-3 text-gray-500">{emp.personalNumber}</td><td className="px-4 py-3 font-medium text-gray-800">{emp.fullName}</td><td className="px-4 py-3 text-center"><span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200">В архиве</span></td></tr>))}</tbody></table>))}
        </div>
      </div>
    </div>
  );
}
