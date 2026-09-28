import { useState } from 'react';
import { useStore } from '../store/useStore';
export default function ExpensesStorekeeper() {
  const addArchivedExpenseSheet = useStore(s => s.addArchivedExpenseSheet);
  const [archivedSheets, setArchivedSheets] = useState<number[]>([]);
  const [viewedSheets, setViewedSheets] = useState<number[]>([]);
  const formatPatientName = (fullName: string) => { const parts = fullName.split(' '); if (parts.length >= 3) return `${parts[0]} ${parts[1][0]}.${parts[2][0]}.`; return fullName; };
  const [expenseSheets] = useState([
    { id: 1, date: '15.08.26', employee: 'Иванов Иван Иванович', patient: 'Петров Петр Петрович', birthDate: '12.05.1985', items: [{ name: 'Морфин 1% 1мл', type: 'Лекарство ПКУ', quantity: 1 }, { name: 'Анальгин 50% 2мл', type: 'Лекарство', quantity: 2 }] },
    { id: 2, date: '14.08.26', employee: 'Сидорова Анна Михайловна', patient: 'Козлов Алексей Сергеевич', birthDate: '23.09.1978', items: [{ name: 'Фентанил 0.005% 2мл', type: 'Лекарство ПКУ', quantity: 1 }, { name: 'Нитроглицерин 0.5мг', type: 'Лекарство', quantity: 3 }] },
  ]);
  const handleViewed = (sheetId: number) => { setViewedSheets([...viewedSheets, sheetId]); setTimeout(() => setArchivedSheets([...archivedSheets, sheetId]), 3000); };
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 relative overflow-hidden"><div className="absolute left-0 top-0 bottom-0 w-1.5 bg-green-500"></div><div className="pl-2"><p className="text-sm text-gray-500">Листов расхода</p><p className="text-2xl font-bold text-green-700 mt-1">{expenseSheets.length}</p></div></div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 relative overflow-hidden"><div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500"></div><div className="pl-2"><p className="text-sm text-gray-500">Не просмотренные</p><p className="text-2xl font-bold text-red-700 mt-1">{expenseSheets.filter(s => !viewedSheets.includes(s.id) && !archivedSheets.includes(s.id)).length}</p></div></div>
      </div>
      <h3 className="text-lg font-semibold text-gray-800">Листы расхода</h3>
      {expenseSheets.filter(s => !archivedSheets.includes(s.id)).map(sheet => { const isViewed = viewedSheets.includes(sheet.id); return (
        <div key={sheet.id} className={`rounded-xl shadow-sm border-2 overflow-hidden ${isViewed ? 'bg-blue-50 border-blue-300' : 'bg-white border-red-500'}`}>
          <div className={`p-6 border-b ${isViewed ? 'bg-blue-100' : 'bg-green-50'}`}>
            <div className="flex items-center justify-between mb-2"><h3 className="text-xl font-bold">Лист расхода #{sheet.id}</h3><div className="flex gap-2">{!isViewed && <button onClick={() => handleViewed(sheet.id)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">✓ Просмотрено</button>}</div></div>
            <div className="flex flex-wrap gap-4 text-sm"><span>Дата: <b>{sheet.date}</b></span><span>Сотрудник: <b>{formatPatientName(sheet.employee)}</b></span><span>Пациент: <b>{formatPatientName(sheet.patient)}</b></span></div>
          </div>
          <div className="p-6"><table className="w-full text-sm"><thead><tr className="bg-gray-50"><th className="px-4 py-3 text-left">Название</th><th className="px-4 py-3 text-center">Тип</th><th className="px-4 py-3 text-center">Кол-во</th></tr></thead><tbody>{sheet.items.map((item: any, i: number) => (<tr key={i} className="border-b"><td className="px-4 py-3 font-medium">{item.name}</td><td className="px-4 py-3 text-center"><span className={`text-xs px-2 py-1 rounded-full ${item.type === 'Лекарство ПКУ' ? 'bg-red-100 text-red-700 font-bold' : 'bg-purple-100 text-purple-700'}`}>{item.type}</span></td><td className="px-4 py-3 text-center">{item.quantity}</td></tr>))}</tbody></table></div>
        </div>
      ); })}
    </div>
  );
}
