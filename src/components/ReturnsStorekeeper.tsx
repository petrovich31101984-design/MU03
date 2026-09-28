import { useState } from 'react';
import { useStore } from '../store/useStore';
import { UNIT_LABELS, ReturnOperation } from '../types';
import { formatDate } from '../utils/dateFormat';
interface ReturnSheet { id: string; employeeId: string; date: string; items: ReturnOperation[]; }
export default function ReturnsStorekeeper() {
  const returns = useStore(s => s.returns);
  const employees = useStore(s => s.employees);
  const nomenclature = useStore(s => s.nomenclature);
  const correctReturn = useStore(s => s.correctReturn);
  const confirmReturn = useStore(s => s.confirmReturn);
  const updateReturn = useStore(s => s.updateReturn);
  const addArchivedReturns = useStore(s => s.addArchivedReturns);
  const [filter, setFilter] = useState<'all' | 'pending' | 'corrected'>('all');
  const [correctingId, setCorrectingId] = useState<string | null>(null);
  const [newQuantity, setNewQuantity] = useState('');
  const [archivedSheets, setArchivedSheets] = useState<Set<string>>(new Set());
  const [editingReturn, setEditingReturn] = useState<ReturnOperation | null>(null);
  const [editQuantity, setEditQuantity] = useState('');
  const [editReason, setEditReason] = useState('');
  const getEmployeeName = (id: string) => employees.find(e => e.id === id)?.fullName || id;
  const formatEmployeeName = (fullName: string) => { const parts = fullName.split(' '); if (parts.length >= 3) return `${parts[0]} ${parts[1][0]}.${parts[2][0]}.`; return fullName; };
  const getNomenclatureName = (id: string) => nomenclature.find(n => n.id === id)?.name || id;
  const getNomenclatureUnit = (id: string) => nomenclature.find(n => n.id === id)?.unit;
  const groupReturns = (returnsList: ReturnOperation[]): ReturnSheet[] => { const groups: { [key: string]: ReturnSheet } = {}; returnsList.forEach(ret => { const key = `${ret.employeeId}_${ret.date}`; if (!groups[key]) groups[key] = { id: key, employeeId: ret.employeeId, date: ret.date, items: [] }; groups[key].items.push(ret); }); return Object.values(groups).sort((a, b) => b.date.localeCompare(a.date)); };
  const filteredReturns = returns.filter(r => { if (filter === 'pending') return !r.corrected; if (filter === 'corrected') return r.corrected; return true; });
  const allSheets = groupReturns(filteredReturns);
  const sheets = allSheets.filter(sheet => !archivedSheets.has(sheet.id));
  const handleCorrect = (id: string) => { if (!newQuantity) return; correctReturn(id, Number(newQuantity), 'storekeeper'); setCorrectingId(null); setNewQuantity(''); };
  const handleArchiveSheet = (sheetId: string) => { const sheet = allSheets.find(s => s.id === sheetId); if (sheet) addArchivedReturns([sheet]); setArchivedSheets(prev => new Set(prev).add(sheetId)); };
  const handleConfirm = (id: string) => { confirmReturn(id, 'storekeeper'); };
  const handleEdit = (ret: ReturnOperation) => { setEditingReturn(ret); setEditQuantity(String(ret.quantity)); setEditReason(ret.reason || ''); };
  const handleSaveEdit = () => { if (!editingReturn) return; updateReturn(editingReturn.id, { quantity: Number(editQuantity), reason: editReason }, 'storekeeper'); setEditingReturn(null); };
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex gap-2">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'all' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600'}`}>Все ({sheets.length})</button>
        <button onClick={() => setFilter('pending')} className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'pending' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-gray-100 text-gray-600'}`}>Ожидают</button>
        <button onClick={() => setFilter('corrected')} className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'corrected' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600'}`}>Скорректированные</button>
      </div>
      {sheets.map(sheet => { const hasUnconfirmed = sheet.items.some(item => !item.confirmed); return (
        <div key={sheet.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b" style={{ backgroundColor: '#AFEEEE' }}><div className="flex items-center justify-between"><div><h3 className="text-lg font-semibold text-gray-800">Лист возврата от {formatDate(sheet.date)}</h3><p className="text-sm text-gray-600 mt-1">Сотрудник: <span className="font-medium">{formatEmployeeName(getEmployeeName(sheet.employeeId))}</span></p></div><div className="flex items-center gap-2"><button onClick={() => handleArchiveSheet(sheet.id)} disabled={hasUnconfirmed} className={`px-3 py-1.5 rounded-lg text-xs ${hasUnconfirmed ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-600 text-white hover:bg-gray-700'}`}>📦 В архив</button></div></div></div>
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left border-b"><th className="px-4 py-3 font-medium text-gray-600">Номенклатура</th><th className="px-4 py-3 font-medium text-gray-600">Кол-во</th><th className="px-4 py-3 font-medium text-gray-600">Причина</th><th className="px-4 py-3 font-medium text-gray-600">Действия</th></tr></thead><tbody className="divide-y divide-gray-100">{sheet.items.map(ret => { const unit = getNomenclatureUnit(ret.nomenclatureId); return (<tr key={ret.id} className="hover:bg-gray-50"><td className="px-4 py-3 text-gray-700">{getNomenclatureName(ret.nomenclatureId)}{unit && <span className="text-xs text-gray-400 ml-1">({UNIT_LABELS[unit]})</span>}</td><td className="px-4 py-3">{correctingId === ret.id ? (<div className="flex items-center gap-1"><input type="number" value={newQuantity} onChange={e => setNewQuantity(e.target.value)} className="w-16 px-2 py-1 border border-green-300 rounded text-center" autoFocus /><button onClick={() => handleCorrect(ret.id)} className="p-1 bg-green-100 text-green-700 rounded">✓</button><button onClick={() => { setCorrectingId(null); }} className="p-1 bg-gray-100 text-gray-700 rounded">✕</button></div>) : (<span className="font-medium">{ret.quantity}</span>)}</td><td className="px-4 py-3 text-gray-700">{ret.reason || '—'}</td><td className="px-4 py-3"><div className="flex gap-2">{!ret.confirmed && <button onClick={() => handleConfirm(ret.id)} className="text-green-700 text-lg">✓</button>}<button onClick={() => handleEdit(ret)} className="text-green-700 text-lg">✏️</button></div></td></tr>); })}</tbody></table></div>
        </div>
      ); })}
      {sheets.length === 0 && (<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"><p className="text-gray-500">Нет возвратов</p></div>)}
      {editingReturn && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"><h3 className="text-xl font-bold text-gray-800 mb-4">Изменить позицию</h3><div className="space-y-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Количество</label><input type="number" value={editQuantity} onChange={(e) => setEditQuantity(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Причина</label><select value={editReason} onChange={(e) => setEditReason(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg"><option value="Вышел срок годности">Вышел срок годности</option><option value="Поломка оборудования">Поломка оборудования</option><option value="Нарушение упаковки">Нарушение упаковки</option><option value="Другая причина">Другая причина</option></select></div></div><div className="flex gap-3 mt-6"><button onClick={() => setEditingReturn(null)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg">Отмена</button><button onClick={handleSaveEdit} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Сохранить</button></div></div></div>)}
    </div>
  );
}
