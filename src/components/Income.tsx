import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Income as IncomeType } from '../types';
import { formatDate } from '../utils/dateFormat';

export default function Income() {
  const employees = useStore(s => s.employees);
  const income = useStore(s => s.income);
  const addIncome = useStore(s => s.addIncome);
  const updateIncome = useStore(s => s.updateIncome);
  const removeIncome = useStore(s => s.removeIncome);

  const [showModal, setShowModal] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [amount, setAmount] = useState('');
  const [modalPeriod, setModalPeriod] = useState('2026-08');
  const [selectedPeriod, setSelectedPeriod] = useState('2026-08');

  const getFilteredIncome = () => {
    if (selectedPeriod === 'all') {
      return income;
    } else if (selectedPeriod === 'year') {
      return income.filter(i => i.period.startsWith('2026'));
    } else if (selectedPeriod === 'half-year') {
      return income.filter(i => {
        const month = parseInt(i.period.split('-')[1]);
        return month >= 1 && month <= 6 && i.period.startsWith('2026');
      });
    } else if (selectedPeriod === 'quarter') {
      return income.filter(i => {
        const month = parseInt(i.period.split('-')[1]);
        return month >= 7 && month <= 9 && i.period.startsWith('2026');
      });
    } else {
      return income.filter(i => i.period === selectedPeriod);
    }
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

  const addArchivedIncome = useStore(s => s.addArchivedIncome);

  const handleArchive = () => {
    if (periodIncome.length === 0) {
      alert('Нет данных для архивирования за выбранный период');
      return;
    }
    setShowArchiveConfirm(true);
  };

  const confirmArchive = () => {
    const incomeByEmployee: { [key: string]: { employeeId: string; totalAmount: number; count: number } } = {};
    
    periodIncome.forEach(inc => {
      if (!incomeByEmployee[inc.employeeId]) {
        incomeByEmployee[inc.employeeId] = {
          employeeId: inc.employeeId,
          totalAmount: 0,
          count: 0
        };
      }
      incomeByEmployee[inc.employeeId].totalAmount += inc.amount;
      incomeByEmployee[inc.employeeId].count += 1;
    });

    const archiveData = {
      period: getPeriodLabel(),
      periodValue: selectedPeriod,
      employees: Object.values(incomeByEmployee).map(emp => ({
        employeeId: emp.employeeId,
        totalAmount: emp.totalAmount,
        count: emp.count
      })),
      totalAmount: totalIncome,
      totalCount: periodIncome.length
    };

    addArchivedIncome(archiveData);
    setShowArchiveConfirm(false);
    alert(`Данные за период "${getPeriodLabel()}" успешно отправлены в архив`);
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
      updateIncome(editingId, {
        employeeId: selectedEmployee,
        amount: Number(amount),
        period: modalPeriod,
      });
    } else {
      addIncome({
        employeeId: selectedEmployee,
        amount: Number(amount),
        period: modalPeriod,
        shifts: 0,
        date: new Date().toISOString().slice(0, 10),
        createdBy: 'admin',
      });
      setSelectedPeriod(modalPeriod);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    removeIncome(id);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Приход на подразделение</h3>
          <button 
            onClick={handleArchive}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium flex items-center gap-2"
          >
            📦 Отправить в архив
          </button>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Выбрать период:</label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
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

        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
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
          <button 
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            + Добавить приход
          </button>
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
                    <td className="px-4 py-3 text-right text-green-700 font-medium">
                      {inc.amount.toLocaleString('ru')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenModal(inc)}
                          className="p-1 text-gray-600 hover:text-blue-600 transition"
                          title="Редактировать"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(inc.id)}
                          className="p-1 text-gray-600 hover:text-red-600 transition"
                          title="Удалить"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {editingId ? 'Редактировать приход' : 'Добавить приход'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Период</label>
                <select
                  value={modalPeriod}
                  onChange={(e) => setModalPeriod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="2026-08">Август 2026</option>
                  <option value="2026-07">Июль 2026</option>
                  <option value="2026-06">Июнь 2026</option>
                  <option value="2026-05">Май 2026</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Сотрудник</label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Выберите сотрудника</option>
                  {employees.filter(e => e.status === 'active').map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.fullName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Сумма прихода (₽)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Введите сумму"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {showArchiveConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-2xl">📦</div>
                <h3 className="text-lg font-bold text-gray-800">Отправить в архив?</h3>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700 mb-2"><span className="font-medium">Период:</span> {getPeriodLabel()}</p>
                <p className="text-sm text-gray-700 mb-2"><span className="font-medium">Сотрудников:</span> {new Set(periodIncome.map(i => i.employeeId)).size}</p>
                <p className="text-sm text-gray-700 mb-2"><span className="font-medium">Приходов:</span> {periodIncome.length}</p>
                <p className="text-sm text-gray-700"><span className="font-medium">Общая сумма:</span> {totalIncome.toLocaleString('ru')} ₽</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowArchiveConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Отмена
                </button>
                <button
                  onClick={confirmArchive}
                  className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
                >
                  Отправить в архив
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
