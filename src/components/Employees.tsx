import { useState } from 'react';
import { useStore } from '../store/useStore';
import { EmployeeStatus, STATUS_LABELS, STATUS_COLORS, Employee } from '../types';

export default function Employees() {
  const employees = useStore(s => s.employees);
  const updateEmployeeStatus = useStore(s => s.updateEmployeeStatus);
  const updateEmployee = useStore(s => s.updateEmployee);
  const addEmployee = useStore(s => s.addEmployee);
  const archiveEmployee = useStore(s => s.archiveEmployee);
  const removeEmployee = useStore(s => s.removeEmployee);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionsMenuId, setActionsMenuId] = useState<string | null>(null);
  const [showStatusModal, setShowStatusModal] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState<Employee | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpNumber, setNewEmpNumber] = useState('');
  const [newEmpPassword, setNewEmpPassword] = useState('');
  const [editName, setEditName] = useState('');
  const [editNumber, setEditNumber] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [newStatus, setNewStatus] = useState<EmployeeStatus>('active');

  const filtered = employees.filter(e => {
    const matchesSearch = e.fullName.toLowerCase().includes(search.toLowerCase()) || e.personalNumber.includes(search);
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    if (showArchived) { return matchesSearch && e.archived === true; } else { return matchesSearch && matchesStatus && !e.archived; }
  });

  const handleAddEmployee = () => { if (!newEmpName || !newEmpNumber || !newEmpPassword) return; addEmployee({ personalNumber: newEmpNumber, fullName: newEmpName, password: newEmpPassword, status: 'active', hireDate: new Date().toISOString().slice(0, 10), lastActivityDate: new Date().toISOString().slice(0, 10) }); setNewEmpName(''); setNewEmpNumber(''); setNewEmpPassword(''); setShowAddModal(false); };
  const handleStatusChange = (empId: string) => { updateEmployeeStatus(empId, newStatus); setShowStatusModal(null); setActionsMenuId(null); };
  const handleBlock = (empId: string) => { updateEmployeeStatus(empId, 'blocked'); setActionsMenuId(null); };
  const handleFire = (empId: string) => { updateEmployeeStatus(empId, 'fired'); setActionsMenuId(null); };
  const handleArchive = (empId: string) => { archiveEmployee(empId); setActionsMenuId(null); };
  const handleEdit = (emp: Employee) => { setEditName(emp.fullName); setEditNumber(emp.personalNumber); setEditPassword(emp.password || ''); setShowEditModal(emp); setActionsMenuId(null); };
  const handleEditSave = () => { if (!showEditModal) return; updateEmployee(showEditModal.id, { fullName: editName, personalNumber: editNumber, password: editPassword }); setShowEditModal(null); };
  const handleDelete = (empId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этого сотрудника?')) {
      removeEmployee(empId);
      setActionsMenuId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col md:flex-row gap-4">
        <input type="text" placeholder="Поиск по ФИО или номеру..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} disabled={showArchived} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"><option value="all">Все статусы</option><option value="active">Активен</option><option value="inactive">Неактивен</option><option value="blocked">Заблокирован</option><option value="fired">Уволен</option></select>
        <button onClick={() => setShowArchived(!showArchived)} className={`px-4 py-2 rounded-lg flex items-center gap-2 ${showArchived ? 'bg-amber-600 text-white hover:bg-amber-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}><span>📁</span> {showArchived ? 'Активные' : 'Архив'}</button>
        <button onClick={() => setShowAddModal(true)} disabled={showArchived} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"><span>+</span> Добавить сотрудника</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {showArchived && (<div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-sm text-amber-800">📁 Отображаются архивные сотрудники</div>)}
        <div className="overflow-x-auto" style={{ maxHeight: '600px', overflowY: 'auto' }}>
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-50 z-10">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium text-gray-600">№</th>
                <th className="px-4 py-3 font-medium text-gray-600">ФИО</th>
                <th className="px-4 py-3 font-medium text-gray-600 text-center">Статус</th>
                {!showArchived && <th className="px-4 py-3 font-medium text-gray-600 text-center">Действия</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(emp => (
                <tr key={emp.id} className="hover:bg-gray-50 relative">
                  <td className="px-4 py-3 text-gray-500">{emp.personalNumber}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{emp.fullName}</td>
                  <td className="px-4 py-3 text-center"><span className={`text-xs px-2 py-1 rounded-full border ${STATUS_COLORS[emp.status]}`}>{STATUS_LABELS[emp.status]}</span></td>
                  {!showArchived && (
                    <td className="px-4 py-3 text-center relative">
                      <button onClick={() => setActionsMenuId(actionsMenuId === emp.id ? null : emp.id)} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">⋮ Действия</button>
                      {actionsMenuId === emp.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActionsMenuId(null)} />
                          <div className="absolute right-4 top-full mt-1 z-20 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                            <button onClick={() => handleEdit(emp)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 flex items-center gap-2"><span>✏️</span> Редактировать</button>
                            <button onClick={() => { setShowStatusModal(emp.id); setNewStatus(emp.status); setActionsMenuId(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 flex items-center gap-2"><span>🔄</span> Изменить статус</button>
                            <div className="border-t border-gray-100 my-1"></div>
                            {emp.status !== 'blocked' && (<button onClick={() => handleBlock(emp.id)} className="w-full text-left px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 flex items-center gap-2"><span>🔒</span> Заблокировать</button>)}
                            {emp.status !== 'fired' && (<button onClick={() => handleFire(emp.id)} className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center gap-2"><span>🚫</span> Уволить</button>)}
                            <div className="border-t border-gray-100 my-1"></div>
                            <button onClick={() => handleDelete(emp.id)} className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center gap-2"><span>🗑️</span> Удалить</button>
                            <div className="border-t border-gray-100 my-1"></div>
                            <button onClick={() => handleArchive(emp.id)} className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 flex items-center gap-2"><span>📁</span> Отправить в архив</button>
                          </div>
                        </>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (<div className="p-8 text-center text-gray-400"><p>Сотрудники не найдены</p></div>)}
      </div>

      {showAddModal && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"><div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-gray-800">Добавить сотрудника</h3><button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">×</button></div><div className="space-y-4"><div><label className="text-sm text-gray-600">ФИО</label><input type="text" value={newEmpName} onChange={e => setNewEmpName(e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Иванов Иван Иванович" /></div><div><label className="text-sm text-gray-600">Персональный номер</label><input type="text" value={newEmpNumber} onChange={e => setNewEmpNumber(e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="1031" /></div><div><label className="text-sm text-gray-600">Пароль</label><input type="text" value={newEmpPassword} onChange={e => setNewEmpPassword(e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Введите пароль" /></div><div className="flex gap-3 pt-2"><button onClick={() => setShowAddModal(false)} className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Отмена</button><button onClick={handleAddEmployee} className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Добавить</button></div></div></div></div>)}

      {showStatusModal && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"><div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-gray-800">Изменить статус</h3><button onClick={() => setShowStatusModal(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button></div><div className="space-y-4"><div><label className="text-sm text-gray-600 block mb-2">Выберите статус:</label><div className="space-y-2">{(['active', 'inactive', 'blocked', 'fired'] as EmployeeStatus[]).map(status => (<label key={status} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"><input type="radio" name="status" value={status} checked={newStatus === status} onChange={() => setNewStatus(status)} className="w-4 h-4" /><span className={`text-xs px-2 py-1 rounded-full border ${STATUS_COLORS[status]}`}>{STATUS_LABELS[status]}</span></label>))}</div></div><div className="flex gap-3 pt-2"><button onClick={() => setShowStatusModal(null)} className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Отмена</button><button onClick={() => handleStatusChange(showStatusModal)} className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Сохранить</button></div></div></div></div>)}

      {showEditModal && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"><div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-gray-800">Редактировать сотрудника</h3><button onClick={() => setShowEditModal(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button></div><div className="space-y-4"><div><label className="text-sm text-gray-600">ФИО</label><input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" /></div><div><label className="text-sm text-gray-600">Персональный номер</label><input type="text" value={editNumber} onChange={e => setEditNumber(e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" /></div><div><label className="text-sm text-gray-600">Пароль</label><input type="text" value={editPassword} onChange={e => setEditPassword(e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Введите новый пароль" /></div><div className="flex gap-3 pt-2"><button onClick={() => setShowEditModal(null)} className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Отмена</button><button onClick={handleEditSave} className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Сохранить</button></div></div></div></div>)}
    </div>
  );
}
