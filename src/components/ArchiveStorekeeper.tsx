import { useState } from 'react';
import { useStore } from '../store/useStore';
import { formatDate } from '../utils/dateFormat';

export default function ArchiveStorekeeper() {
  const employees = useStore(s => s.employees);
  const nomenclature = useStore(s => s.nomenclature);
  const archivedExpenseSheets = useStore(s => s.archivedExpenseSheets);
  const archivedReturns = useStore(s => s.archivedReturns);
  const archivedIncome = useStore(s => s.archivedIncome);
  const [searchDate, setSearchDate] = useState('');
  const [searchPatient, setSearchPatient] = useState('');
  const [searchBirthDate, setSearchBirthDate] = useState('');
  const [activeTab, setActiveTab] = useState<'sheets' | 'returns' | 'income' | 'employees'>('sheets');

  const archivedEmployees = employees.filter(e => e.archived);

  const filteredSheets = archivedExpenseSheets.filter(sheet => {
    const matchesDate = !searchDate || sheet.date.includes(searchDate);
    const matchesPatient = !searchPatient || sheet.patient.toLowerCase().includes(searchPatient.toLowerCase()) || formatPatientName(sheet.patient).toLowerCase().includes(searchPatient.toLowerCase());
    const matchesBirthDate = !searchBirthDate || sheet.birthDate.includes(searchBirthDate);
    return matchesDate && matchesPatient && matchesBirthDate;
  });

  const filteredEmployees = archivedEmployees.filter(emp => {
    return emp.fullName.toLowerCase().includes(searchPatient.toLowerCase()) || emp.personalNumber.includes(searchPatient);
  });

  const filteredReturns = archivedReturns.filter(sheet => {
    const emp = employees.find(e => e.id === sheet.employeeId);
    const empName = emp?.fullName || '';
    const matchesDate = !searchDate || sheet.date.includes(searchDate);
    const matchesEmployee = !searchPatient || empName.toLowerCase().includes(searchPatient.toLowerCase()) || formatPatientName(empName).toLowerCase().includes(searchPatient.toLowerCase());
    return matchesDate && matchesEmployee;
  });

  const filteredIncome = archivedIncome.filter(data => {
    const matchesPeriod = !searchDate || data.period.toLowerCase().includes(searchDate.toLowerCase());
    const matchesEmployee = !searchPatient || data.employees.some((emp: any) => {
      const empData = employees.find(e => e.id === emp.employeeId);
      const empName = empData?.fullName || '';
      return empName.toLowerCase().includes(searchPatient.toLowerCase()) || formatPatientName(empName).toLowerCase().includes(searchPatient.toLowerCase());
    });
    return matchesPeriod && matchesEmployee;
  });

  const getNomenclatureName = (id: string) => nomenclature.find(n => n.id === id)?.name || id;
  const getNomenclatureUnit = (id: string) => nomenclature.find(n => n.id === id)?.unit || '';
  const formatPatientName = (fullName: string) => {
    const parts = fullName.split(' ');
    if (parts.length >= 3) {
      return `${parts[0]} ${parts[1][0]}.${parts[2][0]}.`;
    }
    return fullName;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">📁 Архив</h2>
            <p className="text-sm text-gray-500 mt-1">Информация, отправленная в архив</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <input type="text" placeholder="Дата создания (дд.мм.гг)" value={searchDate} onChange={e => setSearchDate(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm" />
            <input type="text" placeholder="Пациент (ФИО)" value={searchPatient} onChange={e => setSearchPatient(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm" />
            <input type="text" placeholder="Дата рождения (дд.мм.гггг)" value={searchBirthDate} onChange={e => setSearchBirthDate(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm" />
            {(searchDate || searchPatient || searchBirthDate) && (
              <button onClick={() => { setSearchDate(''); setSearchPatient(''); setSearchBirthDate(''); }} className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">✕ Сбросить</button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
          <p className="text-sm text-gray-700 font-medium">Листов расхода в архиве</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{archivedExpenseSheets.length}</p>
          <p className="text-xs text-gray-500 mt-1">проверено кладовщиком</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200">
          <p className="text-sm text-purple-700 font-medium">Возвратов в архиве</p>
          <p className="text-2xl font-bold text-purple-800 mt-1">{archivedReturns.length}</p>
          <p className="text-xs text-purple-600 mt-1">листов возвратов</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
          <p className="text-sm text-green-700 font-medium">Приходов в архиве</p>
          <p className="text-2xl font-bold text-green-800 mt-1">{archivedIncome.length}</p>
          <p className="text-xs text-green-600 mt-1">карточек приходов</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
          <p className="text-sm text-blue-700 font-medium">Сотрудников в архиве</p>
          <p className="text-2xl font-bold text-blue-800 mt-1">{archivedEmployees.length}</p>
          <p className="text-xs text-blue-600 mt-1">неактивных</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button onClick={() => setActiveTab('sheets')} className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'sheets' ? 'bg-green-50 text-green-700 border-b-2 border-green-500' : 'text-gray-600 hover:bg-gray-50'}`}>
            📋 Листы расхода ({archivedExpenseSheets.length})
          </button>
          <button onClick={() => setActiveTab('returns')} className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'returns' ? 'bg-green-50 text-green-700 border-b-2 border-green-500' : 'text-gray-600 hover:bg-gray-50'}`}>
            ↩️ Возвраты ({archivedReturns.length})
          </button>
          <button onClick={() => setActiveTab('income')} className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'income' ? 'bg-green-50 text-green-700 border-b-2 border-green-500' : 'text-gray-600 hover:bg-gray-50'}`}>
            📥 Приходы ({archivedIncome.length})
          </button>
          <button onClick={() => setActiveTab('employees')} className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'employees' ? 'bg-green-50 text-green-700 border-b-2 border-green-500' : 'text-gray-600 hover:bg-gray-50'}`}>
            👥 Сотрудники ({archivedEmployees.length})
          </button>
        </div>

        <div className="p-4 max-h-[600px] overflow-y-auto">
          {activeTab === 'sheets' && (
            filteredSheets.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-sm">Архив листов расхода пуст</p>
                <p className="text-xs mt-1">Листы расхода, проверенные кладовщиком, будут отображаться здесь</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSheets.map((sheet, idx) => {
                  const totalSum = sheet.items.reduce((sum: number, item: any) => sum + item.sum, 0);
                  return (
                    <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-gray-800">Лист расхода #{sheet.id}</h4>
                          <span className="text-xs text-gray-500">Архивирован: {new Date(sheet.archivedDate).toLocaleDateString('ru-RU')}</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                          <div><span className="text-gray-500">Дата создания:</span><span className="ml-1 font-medium">{sheet.date}</span></div>
                          <div><span className="text-gray-500">Сотрудник:</span><span className="ml-1 font-medium">{formatPatientName(sheet.employee)}</span></div>
                          <div><span className="text-gray-500">Пациент:</span><span className="ml-1 font-medium">{formatPatientName(sheet.patient)}</span></div>
                          <div><span className="text-gray-500">Дата рождения:</span><span className="ml-1 font-medium">{sheet.birthDate}</span></div>
                          <div><span className="text-gray-500">Категория выезда:</span><span className="ml-1 font-medium">{sheet.visitCategory}</span></div>
                          <div><span className="text-gray-500">Название терапии:</span><span className="ml-1 font-medium">{sheet.therapyName}</span></div>
                        </div>
                      </div>
                      <div className="p-4">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-50 text-left">
                              <th className="px-3 py-2 font-medium text-gray-600">Название</th>
                              <th className="px-3 py-2 font-medium text-gray-600 text-center">Тип</th>
                              <th className="px-3 py-2 font-medium text-gray-600 text-center">Кол-во</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {sheet.items.map((item: any, index: number) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-3 py-2 font-medium text-gray-800">{item.name}</td>
                                <td className="px-3 py-2 text-center">
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${item.type === 'Лекарство ПКУ' ? 'bg-red-100 text-red-700 font-bold' : item.type === 'Лекарство' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>{item.type === 'Лекарство ПКУ' ? 'ЛС пку' : item.type}</span>
                                </td>
                                <td className="px-3 py-2 text-center text-gray-700">{item.quantity}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}

          {activeTab === 'returns' && (
            filteredReturns.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-sm">Архив возвратов пуст</p>
                <p className="text-xs mt-1">Возвраты, отправленные в архив, будут отображаться здесь</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReturns.map((sheet: any, idx: number) => {
                  const emp = employees.find(e => e.id === sheet.employeeId);
                  const empName = emp?.fullName || sheet.employeeId;
                  return (
                    <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-gray-800">Возврат от {formatDate(sheet.date)}</h4>
                          <span className="text-xs text-gray-500">Архивирован: {new Date(sheet.archivedDate).toLocaleDateString('ru-RU')}</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                          <div><span className="text-gray-500">Сотрудник:</span><span className="ml-1 font-medium">{formatPatientName(empName)}</span></div>
                          <div><span className="text-gray-500">Дата:</span><span className="ml-1 font-medium">{formatDate(sheet.date)}</span></div>
                          <div><span className="text-gray-500">Позиций:</span><span className="ml-1 font-medium">{sheet.items.length}</span></div>
                        </div>
                      </div>
                      <div className="p-4">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-50 text-left">
                              <th className="px-3 py-2 font-medium text-gray-600">Номенклатура</th>
                              <th className="px-3 py-2 font-medium text-gray-600 text-center">Кол-во</th>
                              <th className="px-3 py-2 font-medium text-gray-600 text-center">Ед.</th>
                              <th className="px-3 py-2 font-medium text-gray-600 text-center">Статус</th>
                              <th className="px-3 py-2 font-medium text-gray-600">Причина</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {sheet.items.map((item: any, index: number) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-3 py-2 font-medium text-gray-800">{getNomenclatureName(item.nomenclatureId)}</td>
                                <td className="px-3 py-2 text-center text-gray-700">{item.quantity}</td>
                                <td className="px-3 py-2 text-center text-gray-600">{getNomenclatureUnit(item.nomenclatureId)}</td>
                                <td className="px-3 py-2 text-center">
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${item.corrected ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{item.corrected ? 'Исправлено' : 'Ожидает'}</span>
                                </td>
                                <td className="px-3 py-2 text-gray-600 text-xs">{item.reason || '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}

          {activeTab === 'income' && (
            filteredIncome.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-sm">Архив приходов пуст</p>
                <p className="text-xs mt-1">Приходы, отправленные в архив, будут отображаться здесь</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredIncome.map((data: any, idx: number) => (
                  <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="p-4 bg-green-50 border-b border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-gray-800">📥 Приходы за период: {data.period}</h4>
                        <span className="text-xs text-gray-500">Архивирован: {new Date(data.archivedDate).toLocaleDateString('ru-RU')}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                        <div><span className="text-gray-500">Всего сотрудников:</span><span className="ml-1 font-bold text-green-700">{data.employees.length}</span></div>
                        <div><span className="text-gray-500">Всего приходов:</span><span className="ml-1 font-bold text-green-700">{data.totalCount}</span></div>
                        <div><span className="text-gray-500">Общая сумма:</span><span className="ml-1 font-bold text-green-700">{data.totalAmount.toLocaleString('ru')} ₽</span></div>
                      </div>
                    </div>
                    <div className="p-4">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 text-left">
                            <th className="px-3 py-2 font-medium text-gray-600">Сотрудник</th>
                            <th className="px-3 py-2 font-medium text-gray-600 text-center">Кол-во приходов</th>
                            <th className="px-3 py-2 font-medium text-gray-600 text-right">Сумма прихода</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {data.employees.map((emp: any, empIdx: number) => {
                            const empData = employees.find(e => e.id === emp.employeeId);
                            const empName = empData?.fullName || emp.employeeId;
                            return (
                              <tr key={empIdx} className="hover:bg-gray-50">
                                <td className="px-3 py-2 font-medium text-gray-800">{formatPatientName(empName)}</td>
                                <td className="px-3 py-2 text-center text-gray-700">{emp.count}</td>
                                <td className="px-3 py-2 text-right font-bold text-green-700">{emp.totalAmount.toLocaleString('ru')} ₽</td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr className="bg-green-50 font-bold">
                            <td className="px-3 py-2">ИТОГО</td>
                            <td className="px-3 py-2 text-center text-gray-800">{data.totalCount}</td>
                            <td className="px-3 py-2 text-right text-green-700">{data.totalAmount.toLocaleString('ru')} ₽</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {activeTab === 'employees' && (
            filteredEmployees.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-sm">Архив сотрудников пуст</p>
                <p className="text-xs mt-1">Сотрудники, отправленные в архив, будут отображаться здесь</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-3 font-medium text-gray-600">№</th>
                    <th className="px-4 py-3 font-medium text-gray-600">ФИО</th>
                    <th className="px-4 py-3 font-medium text-gray-600 text-center">Статус</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Дата найма</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Последняя активность</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredEmployees.map(emp => (
                    <tr key={emp.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500">{emp.personalNumber}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{emp.fullName}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200">В архиве</span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{emp.hireDate}</td>
                      <td className="px-4 py-3 text-gray-600">{emp.lastActivityDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <h4 className="font-semibold text-green-800 text-sm mb-2">ℹ️ О разделе "Архив"</h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Листы расхода попадают в архив после проверки кладовщиком</li>
          <li>• Возвраты попадают в архив после подтверждения всех позиций</li>
          <li>• Приходы попадают в архив из раздела "Приходы"</li>
          <li>• В архиве хранится полная информация о препаратах, возвратах и приходах</li>
          <li>• Архивные сотрудники не отображаются в активных списках</li>
          <li>• Поиск работает по дате, ФИО, дате рождения</li>
        </ul>
      </div>
    </div>
  );
}
