import { useState } from 'react';
import { useStore } from '../store/useStore';
import { CATEGORY_LABELS, UNIT_LABELS, Category, Unit } from '../types';
import { formatDate } from '../utils/dateFormat';

export default function Nomenclature() {
  const nomenclature = useStore(s => s.nomenclature);
  const priceHistory = useStore(s => s.priceHistory);
  const updatePrice = useStore(s => s.updatePrice);
  const updatePackagePrice = useStore(s => s.updatePackagePrice);
  const addNomenclature = useStore(s => s.addNomenclature);
  const removeNomenclature = useStore(s => s.removeNomenclature);
  const getCurrentPrice = useStore(s => s.getCurrentPrice);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState('');
  const [showHistory, setShowHistory] = useState<string | null>(null);

  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<Category>('medicine');
  const [newUnit, setNewUnit] = useState<Unit>('ampoule');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newPackageQuantity, setNewPackageQuantity] = useState('');
  const [newPricePerPackage, setNewPricePerPackage] = useState('');

  const filtered = nomenclature.filter(n => { const matchesSearch = n.name.toLowerCase().includes(search.toLowerCase()); const matchesCategory = categoryFilter === 'all' || n.category === categoryFilter; return matchesSearch && matchesCategory; });

  const handleAddItem = () => {
    if (!newName) return;
    const newItem: any = { name: newName, category: newCategory, unit: newUnit, active: true, packageQuantity: Number(newPackageQuantity) || 0, pricePerPackage: Number(newPricePerPackage) || 0 };
    addNomenclature(newItem);
    setNewName(''); setNewPackageQuantity(''); setNewPricePerPackage(''); setShowAddModal(false);
  };

  const handleUpdatePrice = (nomenclatureId: string) => { updatePackagePrice(nomenclatureId, Number(newPrice) || 0, 'admin'); setNewPrice(''); setEditingPrice(null); };

  const totalValue = nomenclature.reduce((sum, n) => sum + getCurrentPrice(n.id), 0);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col md:flex-row gap-4">
        <input type="text" placeholder="Поиск по названию..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"><option value="all">Все категории</option><option value="medicine">💊 Лекарства</option><option value="medicine_pku">💉 ЛС пку</option><option value="equipment">🩺 Оборудование</option><option value="consumable">🩹 Расходные материалы</option></select>
        <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"><span>+</span> Добавить позицию</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"><p className="text-sm text-gray-500">Всего позиций</p><p className="text-2xl font-bold text-gray-800">{nomenclature.length}</p></div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"><p className="text-sm text-gray-500">Лекарств</p><p className="text-2xl font-bold text-purple-700">{nomenclature.filter(n => n.category === 'medicine').length}</p></div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"><p className="text-sm text-gray-500">ПКУ ЛС</p><p className="text-2xl font-bold text-indigo-700">{nomenclature.filter(n => n.category === 'medicine_pku').length}</p></div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"><p className="text-sm text-gray-500">Расходники</p><p className="text-2xl font-bold text-green-700">{nomenclature.filter(n => n.category === 'consumable').length}</p></div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"><p className="text-sm text-gray-500">Оборудование</p><p className="text-2xl font-bold text-blue-700">{nomenclature.filter(n => n.category === 'equipment').length}</p></div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="bg-gray-50 text-left"><th className="px-4 py-3 font-medium text-gray-600">Наименование</th><th className="px-4 py-3 font-medium text-gray-600 text-center">Категория</th><th className="px-4 py-3 font-medium text-gray-600 text-center">Единица измерения</th><th className="px-4 py-3 font-medium text-gray-600 text-right">Цена за упаковку (₽)</th><th className="px-4 py-3 font-medium text-gray-600 text-right">Цена за единицу (₽)</th><th className="px-4 py-3 font-medium text-gray-600 text-center">Действия</th></tr></thead><tbody className="divide-y divide-gray-100">{filtered.map(nom => { const price = getCurrentPrice(nom.id); return (<tr key={nom.id} className="hover:bg-gray-50"><td className="px-4 py-3"><div className="font-medium text-gray-800">{nom.name}</div></td><td className="px-4 py-3 text-center">{nom.category === 'medicine_pku' ? (<span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700"><svg width="16" height="16" viewBox="0 0 16 16" className="inline"><ellipse cx="8" cy="8" rx="7" ry="5" fill="#6366f1" stroke="#4f46e5" strokeWidth="0.5"/><text x="8" y="10" fontSize="4" fontWeight="bold" textAnchor="middle" fill="white">ПКУ</text></svg>ПКУ</span>) : (<span className={`text-xs px-2 py-1 rounded-full ${nom.category === 'medicine' ? 'bg-purple-100 text-purple-700' : nom.category === 'equipment' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{CATEGORY_LABELS[nom.category]}</span>)}</td><td className="px-4 py-3 text-center text-gray-600">{UNIT_LABELS[nom.unit]}</td><td className="px-4 py-3 text-right">{editingPrice === nom.id ? (<div className="flex items-center gap-2 justify-end"><input type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} className="w-24 px-2 py-1 border border-blue-300 rounded text-right focus:ring-2 focus:ring-blue-500" autoFocus /><button onClick={() => handleUpdatePrice(nom.id)} className="p-1 bg-green-100 text-green-700 rounded hover:bg-green-200">✓</button><button onClick={() => { updatePackagePrice(nom.id, 0, 'admin'); setEditingPrice(null); setNewPrice('0'); }} className="p-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">✕</button></div>) : (<span className="font-medium text-gray-800">{nom.pricePerPackage ? nom.pricePerPackage.toLocaleString('ru') : '—'}</span>)}</td><td className="px-4 py-3 text-right">{editingPrice === nom.id ? (<span className="font-medium text-blue-700">{newPrice && nom.packageQuantity ? (Number(newPrice) / nom.packageQuantity).toFixed(2) : price.toLocaleString('ru')}</span>) : (<span className="font-medium text-gray-800">{nom.packageQuantity && nom.pricePerPackage ? (nom.pricePerPackage / nom.packageQuantity).toFixed(2) : price.toLocaleString('ru')}</span>)}</td><td className="px-4 py-3 text-center"><div className="flex items-center justify-center gap-2"><button onClick={() => { setEditingPrice(nom.id); setNewPrice(String(nom.pricePerPackage || 0)); }} className="px-3 py-1 text-xs text-gray-600 hover:text-gray-900 transition" title="Изменить цену за упаковку">💰 Изменить цену</button><button onClick={() => setShowHistory(showHistory === nom.id ? null : nom.id)} className="px-3 py-1 text-xs text-gray-600 hover:text-gray-900 transition" title="История цен">📊 История цены</button><button onClick={() => { removeNomenclature(nom.id); }} className="px-3 py-1 text-xs text-gray-600 hover:text-gray-900 transition" title="Удалить позицию">🗑️ Удалить</button></div></td></tr>); })}</tbody></table></div></div>

      {showHistory && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-auto"><div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-gray-800">История цен: {nomenclature.find(n => n.id === showHistory)?.name}</h3><button onClick={() => setShowHistory(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button></div><div className="space-y-2">{priceHistory.filter(p => p.nomenclatureId === showHistory).sort((a, b) => b.changeDate.localeCompare(a.changeDate)).map(p => (<div key={p.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"><span className="text-sm text-gray-500 w-24">{formatDate(p.changeDate)}</span><span className="font-medium text-gray-800">{p.price} ₽</span><span className="text-xs text-gray-400 ml-auto">изменил: {p.changedBy}</span></div>))}{priceHistory.filter(p => p.nomenclatureId === showHistory).length === 0 && (<p className="text-center text-gray-400 py-8">История цен пуста</p>)}</div></div></div>)}

      {showAddModal && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"><div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-gray-800">Добавить позицию</h3><button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">×</button></div><div className="space-y-4"><div><label className="text-sm text-gray-600">Наименование</label><input type="text" value={newName} onChange={e => setNewName(e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Название препарата или оборудования" /></div><div><label className="text-sm text-gray-600">Категория</label><select value={newCategory} onChange={e => setNewCategory(e.target.value as Category)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"><option value="medicine">💊 Лекарство</option><option value="medicine_pku">💉 ЛС пку</option><option value="equipment">🩺 Оборудование</option><option value="consumable">🩹 Расходный материал</option></select></div><div><label className="text-sm text-gray-600">Единица измерения</label><select value={newUnit} onChange={e => setNewUnit(e.target.value as Unit)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"><option value="ampoule">Ампулы</option><option value="tablet">Таблетки</option><option value="flacon">Флаконы</option><option value="piece">Штуки</option></select></div><div className="border-t border-gray-200 pt-4 mt-4"><p className="text-sm font-medium text-gray-700 mb-3">Данные упаковки</p></div><div><label className="text-sm text-gray-600">Количество в упаковке</label><input type="number" value={newPackageQuantity} onChange={e => setNewPackageQuantity(e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Например: 10" min="1" /></div><div><label className="text-sm text-gray-600">Цена за позицию (упаковку) (₽)</label><input type="number" value={newPricePerPackage} onChange={e => setNewPricePerPackage(e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Например: 500" min="0" step="0.01" /></div><div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-4 mt-3"><div className="flex items-center justify-between"><div><p className="text-xs text-blue-600 font-medium mb-1">💡 Автоматический расчёт</p><p className="text-sm text-gray-700"><span className="font-medium">Цена за единицу:</span></p></div><div className="text-right">{newPackageQuantity && newPricePerPackage && Number(newPackageQuantity) > 0 ? (<><p className="text-2xl font-bold text-blue-700">{(Number(newPricePerPackage) / Number(newPackageQuantity)).toFixed(2)} ₽</p><p className="text-xs text-gray-500 mt-1">{newPricePerPackage} ₽ ÷ {newPackageQuantity} шт.</p></>) : (<p className="text-lg text-gray-400">— ₽</p>)}</div></div></div><button onClick={handleAddItem} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Добавить</button></div></div></div>)}
    </div>
  );
}
