import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Income as IncomeType, Category, UNIT_LABELS } from '../types';
import { formatDate } from '../utils/dateFormat';

export default function IncomeStorekeeper() {
  const employees = useStore(s => s.employees);
  const income = useStore(s => s.income);
  const nomenclature = useStore(s => s.nomenclature);
  const addIncome = useStore(s => s.addIncome);
  const updateIncome = useStore(s => s.updateIncome);
  const removeIncome = useStore(s => s.removeIncome);
  const addInitialStock = useStore(s => s.addInitialStock);
  
  const [showModal, setShowModal] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [amount, setAmount] = useState('');
  const [modalPeriod, setModalPeriod] = useState('2026-08');
  const [selectedPeriod, setSelectedPeriod] = useState('2026-08');
  
  // Состояние для модального окна внесения прихода на сотрудника
  const [incomeEmployeeId, setIncomeEmployeeId] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('medicine');
  const [incomeItems, setIncomeItems] = useState<{nomenclatureId: string, quantity: number}[]>([]);

  const getFilteredIncome = () => { 
    if (selectedPeriod === 'all') return income; 
    else if (selectedPeriod === 'year') return income.filter(i => i.period.startsWith('2026')); 
    else if (selectedPeriod === 'half-year') return income.filter(i => { 
      const month = parseInt(i.period.split('-')[1]); 
      return month >= 1 && month <= 6 && i.period.startsWith('2026'); 
    }); 
    else if (selectedPeriod === 'quarter') return income.filter(i => { 
      const month = parseInt(i.period.split('-')[1]); 
      return month >= 7 && month <= 9 && i.period.startsWith('2026'); 
    }); 
    else return income.filter(i => i.period === selectedPeriod); 
  };
  
  const periodIncome = getFilteredIncome();
  const totalIncome = periodIncome.reduce((s, i) => s + i.amount, 0);
  
  const getPeriodLabel = () => { 
    switch (selectedPeriod) { 
      case 'all': return 'Все время'; 
      case 'year': return '2026 год'; 
      case 'half-year': return '1-е полугодие 2026'; 
      case 'quarter': return '3-й квартал 2026'; 
      case '2026-08': return 'Август 2026'; 
      case '2026-07': return 'Июль 2026'; 
      case '2026-06': return 'Июнь 2026'; 
      case '2026-05': return 'Май 2026'; 
      default: return selectedPeriod; 
    } 
  };

  const handleOpenModal = (incomeData?: IncomeType) => { 
    if (incomeData) { 
      setEditingId(incomeData.id); 
      setSelectedEmployee(incomeData.employeeId); 
      setAmount(String(incomeData.amount)); 
      setModalPeriod(incomeData.period); 
    } else { 
      setEditingId(null); 
      setSelectedEmployee(''); 
      setAmount(''); 
      setModalPeriod(selectedPeriod === 'all' || selectedPeriod === 'year' || selectedPeriod === 'half-year' || selectedPeriod === 'quarter' ? '2026-08' : selectedPeriod); 
    } 
    setShowModal(true); 
  };
  
  const handleCloseModal = () => { 
    setShowModal(false); 
    setEditingId(null); 
    setSelectedEmployee(''); 
    setAmount(''); 
    setModalPeriod('2026-08'); 
  };
  
  const handleSave = () => { 
    if (!selectedEmployee || !amount) return; 
    if (editingId) { 
      updateIncome(editingId, { employeeId: selectedEmployee, amount: Number(amount), period: modalPeriod }); 
    } else { 
      addIncome({ employeeId: selectedEmployee, amount: Number(amount), period: modalPeriod, shifts: 0, date: new Date().toISOString().slice(0, 10), createdBy: 'storekeeper' }); 
      setSelectedPeriod(modalPeriod); 
    } 
    handleCloseModal(); 
  };
  
  const handleDelete = (id: string) => { 
    removeIncome(id); 
  };

  // Открыть модальное окно внесения прихода на сотрудника
  const handleOpenIncomeModal = (employeeId: string) => {
    setIncomeEmployeeId(employeeId);
    setSelectedCategory('medicine');
    setIncomeItems([]);
    setShowIncomeModal(true);
  };

  // Добавить позицию в приход
  const handleAddIncomeItem = (nomenclatureId: string) => {
    const existingItem = incomeItems.find(item => item.nomenclatureId === nomenclatureId);
    if (existingItem) {
      setIncomeItems(incomeItems.map(item => 
        item.nomenclatureId === nomenclatureId 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setIncomeItems([...incomeItems, { nomenclatureId, quantity: 1 }]);
    }
  };

  // Удалить позицию из прихода
  const handleRemoveIncomeItem = (nomenclatureId: string) => {
    setIncomeItems(incomeItems.filter(item => item.nomenclatureId !== nomenclatureId));
  };

  // Изменить количество позиции
  const handleChangeQuantity = (nomenclatureId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveIncomeItem(nomenclatureId);
    } else {
      setIncomeItems(incomeItems.map(item => 
        item.nomenclatureId === nomenclatureId 
          ? { ...item, quantity }
          : item
      ));
    }
  };

  // Сохранить приход на сотрудника
  const handleSaveIncome = () => {
    if (!incomeEmployeeId || incomeItems.length === 0) {
      alert('Выберите хотя бы одну позицию');
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    
    // Добавляем каждую позицию в initialStocks
    incomeItems.forEach(item => {
      addInitialStock({
        employeeId: incomeEmployeeId,
        nomenclatureId: item.nomenclatureId,
        quantity: item.quantity,
        date: today,
        createdBy: 'storekeeper'
      });
    });

    alert(`Приход успешно внесен для сотрудника`);
    setShowIncomeModal(false);
    setIncomeEmployeeId('');
    setIncomeItems([]);
  };

  // Получить номенклатуру по выбранной категории
  const getNomenclatureByCategory = () => {
    return nomenclature.filter(n => n.category === selectedCategory && n.active);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Приход на подразделение</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Выбрать период:</label>
          <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
            <option value="2026-08">Август 2026</option>
            <option value="2026-07">Июль 2026</option>
            <option value="2026-06">Июнь 2026</option>
            <option value="2026-05">Май 2026</option>
            <option value="quarter">3-й квартал 2026</option>
            <option value="half-year">1-е полугодие 2026</option>
            <option value="year">2026 год</option>
            <option value="all">Все время</option>
          </select>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{getPeriodLabel()}</p>
              <p className="text-3xl font-bold text-green-700">{totalIncome.toLocaleString('ru')} ₽</p>
              <p className="text-sm text-gray-500 mt-2">Общая сумма приходов всех сотрудников</p>
            </div>
            <div className="text-6xl opacity-20">💰</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Приходы за период: {getPeriodLabel()}</h3>
          <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">+ Добавить приход</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-600">ФИО</th>
                <th className="px-4 py-3 font-medium text-gray-600">Дата внесения</th>
                <th className="px-4 py-3 font-medium text-gray-600 text-right">Сумма (₽)</th>
                <th className="px-4 py-3 font-medium text-gray-600 text-center">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {periodIncome.map(inc => { 
                const emp = employees.find(e => e.id === inc.employeeId); 
                if (!emp) return null; 
                return (
                  <tr key={inc.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{emp.fullName}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(inc.date)}</td>
                    <td className="px-4 py-3 text-right text-green-700 font-medium">{inc.amount.toLocaleString('ru')}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleOpenIncomeModal(emp.id)} 
                          className="p-1 text-gray-600 hover:text-green-600 transition" 
                          title="Внести приход"
                        >
                          📩
                        </button>
                        <button onClick={() => handleOpenModal(inc)} className="p-1 text-gray-600 hover:text-green-600 transition" title="Редактировать">✏️</button>
                        <button onClick={() => handleDelete(inc.id)} className="p-1 text-gray-600 hover:text-red-600 transition" title="Удалить">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ); 
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Модальное окно редактирования прихода */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{editingId ? 'Редактировать приход' : 'Добавить приход'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Период</label>
                <select value={modalPeriod} onChange={(e) => setModalPeriod(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                  <option value="2026-08">Август 2026</option>
                  <option value="2026-07">Июль 2026</option>
                  <option value="2026-06">Июнь 2026</option>
                  <option value="2026-05">Май 2026</option>
                  <option value="2026-04">Апрель 2026</option>
                  <option value="2026-03">Март 2026</option>
                  <option value="2026-02">Февраль 2026</option>
                  <option value="2026-01">Январь 2026</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Сотрудник</label>
                <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                  <option value="">Выберите сотрудника</option>
                  {employees.filter(e => e.status === 'active').map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.fullName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Сумма прихода (₽)</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Введите сумму" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleCloseModal} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">Отмена</button>
              <button onClick={handleSave} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Сохранить</button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно внесения прихода на сотрудника */}
      {showIncomeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-xl font-bold text-white">Внесение прихода на сотрудника</h2>
                <p className="text-sm text-green-100 mt-1">
                  {employees.find(e => e.id === incomeEmployeeId)?.fullName}
                </p>
              </div>
              <button onClick={() => setShowIncomeModal(false)} className="text-white hover:text-green-200 text-2xl">×</button>
            </div>

            <div className="flex-1 overflow-auto p-6">
              {/* Выбор категории */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Категория номенклатуры:</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedCategory('medicine')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${selectedCategory === 'medicine' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'}`}
                  >
                    💊 Лекарства
                  </button>
                  <button 
                    onClick={() => setSelectedCategory('medicine_pku')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${selectedCategory === 'medicine_pku' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}
                  >
                    💉 ЛС пку
                  </button>
                  <button 
                    onClick={() => setSelectedCategory('equipment')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${selectedCategory === 'equipment' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                  >
                    🩺 Оборудование
                  </button>
                  <button 
                    onClick={() => setSelectedCategory('consumable')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${selectedCategory === 'consumable' ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
                  >
                    🩹 Расходные материалы
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Список номенклатуры */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800">Доступная номенклатура</h3>
                  </div>
                  <div className="max-h-96 overflow-auto">
                    {getNomenclatureByCategory().length === 0 ? (
                      <div className="p-8 text-center text-gray-400">
                        <p className="text-sm">Нет доступной номенклатуры в этой категории</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {getNomenclatureByCategory().map(nom => (
                          <div key={nom.id} className="p-3 hover:bg-gray-50 flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-gray-800 text-sm">{nom.name}</p>
                              <p className="text-xs text-gray-500">{UNIT_LABELS[nom.unit]}</p>
                            </div>
                            <button 
                              onClick={() => handleAddIncomeItem(nom.id)}
                              className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                            >
                              + Добавить
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Выбранные позиции */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-green-50 px-4 py-3 border-b border-green-200">
                    <h3 className="font-semibold text-gray-800">Позиции прихода ({incomeItems.length})</h3>
                  </div>
                  <div className="max-h-96 overflow-auto">
                    {incomeItems.length === 0 ? (
                      <div className="p-8 text-center text-gray-400">
                        <p className="text-sm">Добавьте позиции из списка слева</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {incomeItems.map(item => {
                          const nom = nomenclature.find(n => n.id === item.nomenclatureId);
                          if (!nom) return null;
                          return (
                            <div key={item.nomenclatureId} className="p-3 hover:bg-gray-50">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex-1">
                                  <p className="font-medium text-gray-800 text-sm">{nom.name}</p>
                                  <p className="text-xs text-gray-500">{UNIT_LABELS[nom.unit]}</p>
                                </div>
                                <button 
                                  onClick={() => handleRemoveIncomeItem(item.nomenclatureId)}
                                  className="p-1 text-red-600 hover:text-red-800"
                                  title="Удалить"
                                >
                                  🗑️
                                </button>
                              </div>
                              <div className="flex items-center gap-2">
                                <label className="text-xs text-gray-600">Количество:</label>
                                <input 
                                  type="number" 
                                  value={item.quantity} 
                                  onChange={(e) => handleChangeQuantity(item.nomenclatureId, Number(e.target.value))}
                                  className="w-20 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                                  min="1"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end gap-3 flex-shrink-0">
              <button 
                onClick={() => setShowIncomeModal(false)} 
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
              >
                Отмена
              </button>
              <button 
                onClick={handleSaveIncome} 
                disabled={incomeItems.length === 0}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Внести приход
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
