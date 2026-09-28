import { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
export default function Expenses() {
  const openExpenseSheetId = useStore(s => s.openExpenseSheetId);
  const setOpenExpenseSheetId = useStore(s => s.setOpenExpenseSheetId);
  const addArchivedExpenseSheet = useStore(s => s.addArchivedExpenseSheet);
  const [archivedSheets, setArchivedSheets] = useState<number[]>([]);
  const [highlightedSheetId, setHighlightedSheetId] = useState<number | null>(null);
  const sheetRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  useEffect(() => { if (openExpenseSheetId !== null) { setHighlightedSheetId(openExpenseSheetId); setTimeout(() => { const el = sheetRefs.current[openExpenseSheetId]; if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 100); setOpenExpenseSheetId(null); setTimeout(() => setHighlightedSheetId(null), 5000); } }, [openExpenseSheetId, setOpenExpenseSheetId]);
  const formatPatientName = (fullName: string) => { const parts = fullName.split(' '); if (parts.length >= 3) return `${parts[0]} ${parts[1][0]}.${parts[2][0]}.`; return fullName; };
  const [expenseSheets] = useState([
    { id: 1, date: '15.08.26', employee: 'Иванов Иван Иванович', patient: 'Петров Петр Петрович', birthDate: '12.05.1985', visitCategory: 'Экстренный вызов', therapyName: 'Обезболивающая терапия', therapyCost: 6300, items: [{ name: 'Анальгин 50% 2мл', type: 'Лекарство', quantity: 2, unitPrice: 45, sum: 90 }, { name: 'Дексаметазон 4мг/мл', type: 'Лекарство', quantity: 1, unitPrice: 85, sum: 85 }, { name: 'Шприц 5мл', type: 'Расходник', quantity: 3, unitPrice: 12, sum: 36 }] },
    { id: 2, date: '14.08.26', employee: 'Сидорова Анна Михайловна', patient: 'Козлов Алексей Сергеевич', birthDate: '23.09.1978', visitCategory: 'Плановый вызов', therapyName: 'Сердечно-сосудистая терапия', therapyCost: 8500, items: [{ name: 'Нитроглицерин 0.5мг', type: 'Лекарство', quantity: 3, unitPrice: 25, sum: 75 }, { name: 'Шприц 10мл', type: 'Расходник', quantity: 4, unitPrice: 15, sum: 60 }] },
    { id: 11, date: '05.08.26', employee: 'Петров Петр Сергеевич', patient: 'Смирнов Алексей Иванович', birthDate: '15.03.1975', visitCategory: 'Экстренный вызов', therapyName: 'Интенсивная терапия', therapyCost: 5000, items: [{ name: 'Адреналин 0.1% 1мл', type: 'Лекарство', quantity: 2, unitPrice: 180, sum: 360 }, { name: 'Дексаметазон 4мг/мл', type: 'Лекарство', quantity: 1, unitPrice: 85, sum: 85 }] },
  ]);
  const handleArchive = (sheetId: number) => { const sheet = expenseSheets.find(s => s.id === sheetId); if (sheet) addArchivedExpenseSheet(sheet); setArchivedSheets([...archivedSheets, sheetId]); };
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 relative overflow-hidden"><div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500"></div><div className="pl-2"><p className="text-sm text-gray-500">Листов расхода</p><p className="text-2xl font-bold text-red-700 mt-1">{expenseSheets.length}</p></div></div>
      </div>
      <h3 className="text-lg font-semibold text-gray-800">Листы расхода</h3>
      {expenseSheets.filter(s => !archivedSheets.includes(s.id)).map(sheet => { const totalSum = sheet.items.reduce((sum: number, item: any) => sum + item.sum, 0); const limit = sheet.therapyCost * 0.06; const isOverLimit = totalSum >= limit; return (
        <div key={sheet.id} ref={(el) => { sheetRefs.current[sheet.id] = el; }} className={`bg-white rounded-xl shadow-sm border overflow-hidden ${highlightedSheetId === sheet.id ? 'border-blue-500 ring-4 ring-blue-200' : isOverLimit ? 'border-red-200' : 'border-gray-200'}`}>
          <div className={`p-6 border-b ${isOverLimit ? 'bg-gradient-to-r from-red-50 to-orange-50' : 'bg-gradient-to-r from-blue-50 to-indigo-50'}`}>
            <div className="flex items-center justify-between mb-4"><h3 className="text-xl font-bold text-gray-800">Лист расхода #{sheet.id}</h3><div className="flex gap-2"><button onClick={() => handleArchive(sheet.id)} className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm">📦 В архив</button></div></div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm"><span>Дата: <b>{sheet.date}</b></span><span>Сотрудник: <b>{formatPatientName(sheet.employee)}</b></span><span>Пациент: <b>{formatPatientName(sheet.patient)}</b></span><span>Терапия: <b>{sheet.therapyName}</b></span><span>Стоимость: <b className="text-green-600">{sheet.therapyCost.toLocaleString('ru')} ₽</b></span><span className={isOverLimit ? 'text-red-600 font-bold' : 'text-blue-600 font-bold'}>Итого: {totalSum} ₽{isOverLimit && ' ⚠️ ЛИМИТ'}</span></div>
          </div>
          <div className="p-6"><table className="w-full text-sm"><thead><tr className="bg-gray-50 text-left"><th className="px-4 py-3">Название</th><th className="px-4 py-3 text-center">Тип</th><th className="px-4 py-3 text-center">Кол-во</th><th className="px-4 py-3 text-right">Сумма</th></tr></thead><tbody>{sheet.items.map((item: any, i: number) => (<tr key={i} className="border-b"><td className="px-4 py-3 font-medium">{item.name}</td><td className="px-4 py-3 text-center"><span className={`text-xs px-2 py-1 rounded-full ${item.type === 'Лекарство' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>{item.type}</span></td><td className="px-4 py-3 text-center">{item.quantity}</td><td className="px-4 py-3 text-right font-medium text-orange-700">{item.sum} ₽</td></tr>))}</tbody></table></div>
        </div>
      ); })}
    </div>
  );
}
