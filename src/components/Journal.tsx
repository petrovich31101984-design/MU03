import { useState } from 'react';
import { useStore } from '../store/useStore';
import { formatDateTime } from '../utils/dateFormat';

export default function Journal() {
  const journal = useStore(s => s.journal);
  const employees = useStore(s => s.employees);

  const [dateFilter, setDateFilter] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [tableFilter, setTableFilter] = useState('all');

  const getUserName = (userId: string) => {
    if (userId === 'admin') return 'Руководитель';
    if (userId === 'storekeeper') return 'Кладовщик';
    const emp = employees.find(e => e.id === userId);
    return emp?.fullName || userId;
  };

  const filtered = journal.filter(j => {
    const matchesDate = !dateFilter || j.dateTime.startsWith(dateFilter);
    const matchesUser = userFilter === 'all' || j.userId === userFilter;
    const matchesTable = tableFilter === 'all' || j.table === tableFilter;
    return matchesDate && matchesUser && matchesTable;
  }).sort((a, b) => b.dateTime.localeCompare(a.dateTime));

  const tables = [...new Set(journal.map(j => j.table))];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col md:flex-row gap-4">
        <input
          type="date"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={userFilter}
          onChange={e => setUserFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Все пользователи</option>
          <option value="admin">Руководитель</option>
          <option value="storekeeper">Кладовщик</option>
        </select>
        <select
          value={tableFilter}
          onChange={e => setTableFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Все таблицы</option>
          {tables.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <div className="flex-1"></div>
        <span className="text-sm text-gray-500 self-center">Записей: {filtered.length}</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-600">Дата/Время</th>
                <th className="px-4 py-3 font-medium text-gray-600">Пользователь</th>
                <th className="px-4 py-3 font-medium text-gray-600">Таблица</th>
                <th className="px-4 py-3 font-medium text-gray-600">Запись</th>
                <th className="px-4 py-3 font-medium text-gray-600">Поле</th>
                <th className="px-4 py-3 font-medium text-gray-600">Было</th>
                <th className="px-4 py-3 font-medium text-gray-600">Стало</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(entry => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    <div className="text-sm">{formatDateTime(entry.dateTime)}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      entry.userId === 'admin' ? 'bg-blue-100 text-blue-700' :
                      entry.userId === 'storekeeper' ? 'bg-green-100 text-green-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {getUserName(entry.userId)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{entry.table}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs font-mono">{entry.recordId}</td>
                  <td className="px-4 py-3 text-gray-700 font-medium">{entry.field}</td>
                  <td className="px-4 py-3 text-red-600 text-sm">{entry.oldValue || '—'}</td>
                  <td className="px-4 py-3 text-green-600 text-sm font-medium">{entry.newValue || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Нет записей по выбранным фильтрам</p>
        </div>
      )}
    </div>
  );
}
