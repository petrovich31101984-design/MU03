import { useState } from 'react';
import { useStore } from '../store/useStore';

export default function ExpensesStorekeeper() {
  const [editingSheet, setEditingSheet] = useState<any>(null);
  const [editData, setEditData] = useState<any>(null);
  const [archivedSheets, setArchivedSheets] = useState<number[]>([]);
  const [viewedSheets, setViewedSheets] = useState<number[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [previewSheet, setPreviewSheet] = useState<any>(null);
  const formatPatientName = (fullName: string) => { const parts = fullName.split(' '); if (parts.length >= 3) return `${parts[0]} ${parts[1][0]}.${parts[2][0]}.`; return fullName; };
  const [expenseSheets] = useState([
    { id: 1, date: '15.08.26', employee: 'Иванов Иван Иванович', patient: 'Петров Петр Петрович', birthDate: '12.05.1985', visitCategory: 'Экстренный вызов', therapyName: 'Обезболивающая терапия', therapyCost: 6300, items: [{ name: 'Морфин 1% 1мл', type: 'Лекарство ПКУ', quantity: 1, unitPrice: 500, sum: 500 }, { name: 'Анальгин 50% 2мл', type: 'Лекарство', quantity: 2, unitPrice: 45, sum: 90 }, { name: 'Дексаметазон 4мг/мл', type: 'Лекарство', quantity: 1, unitPrice: 85, sum: 85 }, { name: 'Шприц 5мл', type: 'Расходник', quantity: 3, unitPrice: 12, sum: 36 }, { name: 'Салфетки спиртовые', type: 'Расходник', quantity: 5, unitPrice: 5, sum: 25 }] },
    { id: 2, date: '14.08.26', employee: 'Сидорова Анна Михайловна', patient: 'Козлов Алексей Сергеевич', birthDate: '23.09.1978', visitCategory: 'Плановый вызов', therapyName: 'Сердечно-сосудистая терапия', therapyCost: 8500, items: [{ name: 'Фентанил 0.005% 2мл', type: 'Лекарство ПКУ', quantity: 1, unitPrice: 640, sum: 640 }, { name: 'Промедол 2% 1мл', type: 'Лекарство ПКУ', quantity: 1, unitPrice: 360, sum: 360 }, { name: 'Нитроглицерин 0.5мг', type: 'Лекарство', quantity: 3, unitPrice: 25, sum: 75 }, { name: 'Магния сульфат 25% 5мл', type: 'Лекарство', quantity: 2, unitPrice: 55, sum: 110 }, { name: 'Шприц 10мл', type: 'Расходник', quantity: 4, unitPrice: 15, sum: 60 }] },
    { id: 3, date: '13.08.26', employee: 'Морозова Елена Владимировна', patient: 'Смирнова Ольга Ивановна', birthDate: '05.03.1992', visitCategory: 'Экстренный вызов', therapyName: 'Противовоспалительная терапия', therapyCost: 12400, items: [{ name: 'Преднизолон 30мг/мл', type: 'Лекарство', quantity: 2, unitPrice: 120, sum: 240 }, { name: 'Кеторол 30мг/мл', type: 'Лекарство', quantity: 3, unitPrice: 120, sum: 360 }, { name: 'Натрия хлорид 0.9% 400мл', type: 'Лекарство', quantity: 1, unitPrice: 65, sum: 65 }, { name: 'Система для в/в вливания', type: 'Расходник', quantity: 1, unitPrice: 45, sum: 45 }] },
    { id: 4, date: '12.08.26', employee: 'Иванов Иван Иванович', patient: 'Волков Дмитрий Андреевич', birthDate: '17.11.1965', visitCategory: 'Повторный вызов', therapyName: 'Дыхательная терапия', therapyCost: 15800, items: [{ name: 'Эуфиллин 2.4% 5мл', type: 'Лекарство', quantity: 2, unitPrice: 75, sum: 150 }, { name: 'Сальбутамол 100мкг', type: 'Лекарство', quantity: 1, unitPrice: 250, sum: 250 }, { name: 'Преднизолон 30мг/мл', type: 'Лекарство', quantity: 1, unitPrice: 120, sum: 120 }, { name: 'Маска кислородная', type: 'Расходник', quantity: 1, unitPrice: 35, sum: 35 }] },
    { id: 5, date: '11.08.26', employee: 'Сидорова Анна Михайловна', patient: 'Новикова Мария Петровна', birthDate: '28.07.1988', visitCategory: 'Экстренный вызов', therapyName: 'Неотложная помощь', therapyCost: 18200, items: [{ name: 'Адреналин 0.1% 1мл', type: 'Лекарство', quantity: 2, unitPrice: 180, sum: 360 }, { name: 'Дексаметазон 4мг/мл', type: 'Лекарство', quantity: 2, unitPrice: 85, sum: 170 }, { name: 'Фуросемид 10мг/мл', type: 'Лекарство', quantity: 1, unitPrice: 35, sum: 35 }, { name: 'Катетер венозный 18G', type: 'Расходник', quantity: 1, unitPrice: 85, sum: 85 }] },
    { id: 6, date: '10.08.26', employee: 'Морозова Елена Владимировна', patient: 'Федоров Сергей Николаевич', birthDate: '09.02.1975', visitCategory: 'Плановый вызов', therapyName: 'Неврологическая терапия', therapyCost: 9800, items: [{ name: 'Диазепам 0.5% 2мл', type: 'Лекарство', quantity: 1, unitPrice: 85, sum: 85 }, { name: 'Магния сульфат 25% 5мл', type: 'Лекарство', quantity: 2, unitPrice: 55, sum: 110 }, { name: 'Шприц 5мл', type: 'Расходник', quantity: 4, unitPrice: 12, sum: 48 }] },
    { id: 7, date: '09.08.26', employee: 'Иванов Иван Иванович', patient: 'Кузнецова Татьяна Викторовна', birthDate: '14.12.1982', visitCategory: 'Экстренный вызов', therapyName: 'Антигистаминная терапия', therapyCost: 7600, items: [{ name: 'Димедрол 1% 1мл', type: 'Лекарство', quantity: 2, unitPrice: 55, sum: 110 }, { name: 'Преднизолон 30мг/мл', type: 'Лекарство', quantity: 1, unitPrice: 120, sum: 120 }, { name: 'Натрия хлорид 0.9% 400мл', type: 'Лекарство', quantity: 1, unitPrice: 65, sum: 65 }] },
    { id: 8, date: '08.08.26', employee: 'Сидорова Анна Михайловна', patient: 'Попов Андрей Михайлович', birthDate: '30.06.1970', visitCategory: 'Повторный вызов', therapyName: 'Кардиологическая терапия', therapyCost: 22100, items: [{ name: 'Нитроглицерин 0.5мг', type: 'Лекарство', quantity: 5, unitPrice: 25, sum: 125 }, { name: 'Адреналин 0.1% 1мл', type: 'Лекарство', quantity: 1, unitPrice: 180, sum: 180 }, { name: 'Магния сульфат 25% 5мл', type: 'Лекарство', quantity: 3, unitPrice: 55, sum: 165 }, { name: 'Катетер венозный 20G', type: 'Расходник', quantity: 2, unitPrice: 85, sum: 170 }, { name: 'Система для в/в вливания', type: 'Расходник', quantity: 2, unitPrice: 45, sum: 90 }] },
    { id: 9, date: '07.08.26', employee: 'Морозова Елена Владимировна', patient: 'Соколова Ирина Дмитриевна', birthDate: '21.04.1995', visitCategory: 'Плановый вызов', therapyName: 'Жаропонижающая терапия', therapyCost: 6800, items: [{ name: 'Анальгин 50% 2мл', type: 'Лекарство', quantity: 3, unitPrice: 45, sum: 135 }, { name: 'Димедрол 1% 1мл', type: 'Лекарство', quantity: 1, unitPrice: 55, sum: 55 }, { name: 'Шприц 5мл', type: 'Расходник', quantity: 4, unitPrice: 12, sum: 48 }] },
    { id: 10, date: '06.08.26', employee: 'Иванов Иван Иванович', patient: 'Лебедев Виктор Петрович', birthDate: '08.10.1968', visitCategory: 'Экстренный вызов', therapyName: 'Реанимационная терапия', therapyCost: 25550, items: [{ name: 'Адреналин 0.1% 1мл', type: 'Лекарство', quantity: 3, unitPrice: 180, sum: 540 }, { name: 'Дексаметазон 4мг/мл', type: 'Лекарство', quantity: 2, unitPrice: 85, sum: 170 }, { name: 'Преднизолон 30мг/мл', type: 'Лекарство', quantity: 2, unitPrice: 120, sum: 240 }, { name: 'Фуросемид 10мг/мл', type: 'Лекарство', quantity: 2, unitPrice: 35, sum: 70 }, { name: 'Натрия хлорид 0.9% 400мл', type: 'Лекарство', quantity: 2, unitPrice: 65, sum: 130 }, { name: 'Катетер венозный 18G', type: 'Расходник', quantity: 2, unitPrice: 85, sum: 170 }, { name: 'Система для в/в вливания', type: 'Расходник', quantity: 2, unitPrice: 45, sum: 90 }] },
    { id: 11, date: '05.08.26', employee: 'Петров Петр Сергеевич', patient: 'Смирнов Алексей Иванович', birthDate: '15.03.1975', visitCategory: 'Экстренный вызов', therapyName: 'Интенсивная терапия', therapyCost: 5000, items: [{ name: 'Адреналин 0.1% 1мл', type: 'Лекарство', quantity: 2, unitPrice: 180, sum: 360 }, { name: 'Дексаметазон 4мг/мл', type: 'Лекарство', quantity: 1, unitPrice: 85, sum: 85 }, { name: 'Катетер венозный 20G', type: 'Расходник', quantity: 1, unitPrice: 85, sum: 85 }] },
    { id: 12, date: '04.08.26', employee: 'Сидорова Анна Михайловна', patient: 'Козлова Мария Петровна', birthDate: '22.07.1988', visitCategory: 'Повторный вызов', therapyName: 'Хирургическая помощь', therapyCost: 8000, items: [{ name: 'Преднизолон 30мг/мл', type: 'Лекарство', quantity: 3, unitPrice: 120, sum: 360 }, { name: 'Кеторол 30мг/мл', type: 'Лекарство', quantity: 2, unitPrice: 120, sum: 240 }, { name: 'Система для в/в вливания', type: 'Расходник', quantity: 2, unitPrice: 45, sum: 90 }] }
  ]);
  const handleExportExcel = (sheet?: any) => { setPreviewSheet(sheet || null); };
  const handleDownloadExcel = () => { alert('Скачивание файла Excel (демо-функция)\nВ реальном приложении здесь будет генерация XLSX через SheetJS и скачивание файла.'); };
  const handleEdit = (sheet: any) => { setEditingSheet(sheet); setEditData({ ...sheet }); };
  const handleSaveEdit = () => { console.log('Сохранение изменений:', editData); setEditingSheet(null); setEditData(null); };
  const handleCancelEdit = () => { setEditingSheet(null); setEditData(null); };
  const addArchivedExpenseSheet = useStore(s => s.addArchivedExpenseSheet);
  const handleArchive = (sheetId: number) => { const sheet = expenseSheets.find(s => s.id === sheetId); if (sheet) { addArchivedExpenseSheet(sheet); } setArchivedSheets([...archivedSheets, sheetId]); };
  const handleViewed = (sheetId: number) => { setViewedSheets([...viewedSheets, sheetId]); setTimeout(() => { setArchivedSheets([...archivedSheets, sheetId]); }, 3000); };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 relative overflow-hidden"><div className="absolute left-0 top-0 bottom-0 w-1.5 bg-green-500"></div><div className="pl-2"><p className="text-sm text-gray-500">Листов расхода за месяц</p><p className="text-2xl font-bold text-green-700 mt-1">{expenseSheets.length}</p><p className="text-xs text-gray-400 mt-1">за август 2026</p></div></div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 relative overflow-hidden"><div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500"></div><div className="pl-2"><p className="text-sm text-gray-500">Не просмотренные листы расхода</p><p className="text-2xl font-bold text-red-700 mt-1">{expenseSheets.filter(s => !viewedSheets.includes(s.id) && !archivedSheets.includes(s.id)).length}</p><p className="text-xs text-gray-400 mt-1">требуют просмотра</p></div></div>
      </div>
      <h3 className="text-lg font-semibold text-gray-800">Листы расхода</h3>
      {expenseSheets.filter(sheet => !archivedSheets.includes(sheet.id)).map((sheet) => { const isViewed = viewedSheets.includes(sheet.id); const totalSum = sheet.items.reduce((sum: number, item: any) => sum + item.sum, 0); return (
        <div key={sheet.id} className={`rounded-xl shadow-sm border-2 overflow-hidden transition-all duration-500 ${isViewed ? 'bg-blue-50 border-blue-300' : 'bg-white border-red-500'}`}>
          <div className={`p-6 border-b border-gray-200 ${isViewed ? 'bg-gradient-to-r from-blue-100 to-blue-50' : 'bg-gradient-to-r from-green-50 to-emerald-50'}`}>
            <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-3"><h3 className="text-xl font-bold text-gray-800">Лист расхода</h3>{isViewed && (<span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full border border-blue-200">✓ Просмотрено</span>)}</div><div className="flex gap-2"><button onClick={() => handleEdit(sheet)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium flex items-center gap-2">✏️ Редактировать</button>{!isViewed && (<button onClick={() => handleViewed(sheet.id)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2">✓ Просмотрено</button>)}<button onClick={() => handleExportExcel(sheet)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium flex items-center gap-2">📊 Excel</button></div></div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 items-center"><div className="flex items-center gap-2"><span className="text-xs text-gray-500">Дата создания:</span><span className="text-sm font-medium text-gray-800">{sheet.date}</span></div><div className="flex items-center gap-2"><span className="text-xs text-gray-500">Сотрудник:</span><span className="text-sm font-medium text-gray-800">{formatPatientName(sheet.employee)}</span></div><div className="flex items-center gap-2"><span className="text-xs text-gray-500">Пациент:</span><span className="text-sm font-medium text-gray-800">{formatPatientName(sheet.patient)}</span></div><div className="flex items-center gap-2"><span className="text-xs text-gray-500">Дата рождения:</span><span className="text-sm font-medium text-gray-800">{sheet.birthDate}</span></div><div className="flex items-center gap-2"><span className="text-xs text-gray-500">Фильтр по типу:</span><select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"><option value="all">Все типы</option><option value="Лекарство ПКУ">💊 Лекарство ПКУ</option><option value="Лекарство">💊 Лекарство</option><option value="Расходник">🩹 Расходник</option></select></div></div>
          </div>
          <div className="p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Препараты и материалы</h4>
            <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="bg-gray-50 text-left"><th className="px-4 py-3 font-medium text-gray-600">Название</th><th className="px-4 py-3 font-medium text-gray-600 text-center">Тип</th><th className="px-4 py-3 font-medium text-gray-600 text-center">Кол-во</th></tr></thead><tbody className="divide-y divide-gray-100">{[...sheet.items].filter((item: any) => typeFilter === 'all' || item.type === typeFilter).sort((a: any, b: any) => { if (a.type === 'Лекарство ПКУ' && b.type !== 'Лекарство ПКУ') return -1; if (a.type !== 'Лекарство ПКУ' && b.type === 'Лекарство ПКУ') return 1; return 0; }).map((item: any, index: number) => (<tr key={index} className="hover:bg-gray-50"><td className="px-4 py-3 font-medium text-gray-800">{item.name}</td><td className="px-4 py-3 text-center"><span className={`text-xs px-2 py-1 rounded-full ${item.type === 'Лекарство ПКУ' ? 'bg-red-100 text-red-700 font-bold' : item.type === 'Лекарство' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>{item.type}</span></td><td className="px-4 py-3 text-center text-gray-700">{item.quantity}</td></tr>))}</tbody><tfoot><tr className="bg-gray-50 font-bold"><td className="px-4 py-3" colSpan={3}>ИТОГО ({[...sheet.items].filter((item: any) => typeFilter === 'all' || item.type === typeFilter).length} из {sheet.items.length})</td></tr></tfoot></table></div>
            {sheet.items.filter((item: any) => typeFilter !== 'all' && item.type !== typeFilter).length > 0 && (<p className="text-xs text-gray-500 mt-2 text-center">Скрыто позиций: {sheet.items.filter((item: any) => typeFilter !== 'all' && item.type !== typeFilter).length}</p>)}
          </div>
        </div>
      ); })}
      {previewSheet && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[95vh] flex flex-col overflow-hidden">
            {/* Шапка превью */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📊</span>
                <div>
                  <h2 className="text-lg font-bold text-white">Предварительный просмотр Excel</h2>
                  <p className="text-xs text-green-100">Так будет выглядеть документ при экспорте</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleDownloadExcel} className="px-4 py-2 bg-white text-green-700 rounded-lg hover:bg-green-50 text-sm font-medium flex items-center gap-2">⬇️ Скачать Excel</button>
                <button onClick={() => setPreviewSheet(null)} className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 text-sm font-medium">✕ Закрыть</button>
              </div>
            </div>

            {/* Область превью */}
            <div className="flex-1 overflow-auto bg-gray-100 p-6">
              <div className="bg-white shadow-lg border border-gray-300 rounded mx-auto" style={{ maxWidth: '750px', fontFamily: 'Calibri, Arial, sans-serif' }}>
                {/* Содержимое документа */}
                <div className="p-8">
                  {/* Заголовок документа */}
                  <table className="w-full border-collapse mb-4">
                    <tbody>
                      <tr>
                        <td colSpan={4} className="text-center text-xl font-bold py-3 border-b-2 border-gray-800 text-gray-800">
                          ЛИСТ РАСХОДА
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={4} className="text-center text-sm text-gray-600 py-1">
                          Дата составления: {previewSheet.date}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Блок информации */}
                  <table className="w-full border-collapse mb-4 text-sm">
                    <tbody>
                      <tr className="bg-green-50">
                        <td className="border border-gray-400 px-3 py-2 font-bold bg-green-100 w-1/3">ФИО сотрудника:</td>
                        <td className="border border-gray-400 px-3 py-2">{formatPatientName(previewSheet.employee)}</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-400 px-3 py-2 font-bold bg-green-100">ФИО пациента:</td>
                        <td className="border border-gray-400 px-3 py-2">{formatPatientName(previewSheet.patient)}</td>
                      </tr>
                      <tr className="bg-green-50">
                        <td className="border border-gray-400 px-3 py-2 font-bold bg-green-100">Дата рождения пациента:</td>
                        <td className="border border-gray-400 px-3 py-2">{previewSheet.birthDate}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Заголовок таблицы */}
                  <div className="text-sm font-bold text-gray-700 mb-2">
                    Препараты и материалы{typeFilter !== 'all' ? ` (тип: ${typeFilter})` : ''}:
                  </div>

                  {/* Таблица препаратов */}
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-700 text-white">
                        <th className="border border-gray-700 px-3 py-2 text-center w-12">№</th>
                        <th className="border border-gray-700 px-3 py-2 text-left">Наименование</th>
                        <th className="border border-gray-700 px-3 py-2 text-center w-32">Тип</th>
                        <th className="border border-gray-700 px-3 py-2 text-center w-20">Кол-во</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...previewSheet.items]
                        .filter((item: any) => typeFilter === 'all' || item.type === typeFilter)
                        .sort((a: any, b: any) => {
                          if (a.type === 'Лекарство ПКУ' && b.type !== 'Лекарство ПКУ') return -1;
                          if (a.type !== 'Лекарство ПКУ' && b.type === 'Лекарство ПКУ') return 1;
                          return 0;
                        })
                        .map((item: any, index: number) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="border border-gray-300 px-3 py-2 text-center">{index + 1}</td>
                            <td className="border border-gray-300 px-3 py-2 font-medium">{item.name}</td>
                            <td className="border border-gray-300 px-3 py-2 text-center">
                              <span className={
                                item.type === 'Лекарство ПКУ' ? 'text-red-700 font-bold' :
                                item.type === 'Лекарство' ? 'text-purple-700' : 'text-green-700'
                              }>{item.type}</span>
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-center">{item.quantity}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>

                  {/* Подпись кладовщика */}
                  <div className="mt-8 text-sm">
                    <div className="border-b border-gray-600 mb-1 h-8 w-1/2"></div>
                    <div className="text-xs text-gray-600">Подпись кладовщика / ФИО</div>
                  </div>

                  <div className="mt-6 text-xs text-gray-500 text-center">
                    Документ сформирован автоматически в системе «МедУчёт v.0.2» • {new Date().toLocaleString('ru-RU')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingSheet && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"><div className="p-6"><div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-bold text-gray-800">Редактирование листа расхода</h2><button onClick={handleCancelEdit} className="text-gray-400 hover:text-gray-600 text-2xl">×</button></div><div className="space-y-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Дата создания:</label><input type="text" value={editData.date} onChange={(e) => setEditData({ ...editData, date: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Сотрудник:</label><input type="text" value={editData.employee} onChange={(e) => setEditData({ ...editData, employee: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Пациент:</label><input type="text" value={editData.patient} onChange={(e) => setEditData({ ...editData, patient: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Дата рождения:</label><input type="text" value={editData.birthDate} onChange={(e) => setEditData({ ...editData, birthDate: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Категория выезда:</label><input type="text" value={editData.visitCategory} onChange={(e) => setEditData({ ...editData, visitCategory: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Название терапии:</label><input type="text" value={editData.therapyName} onChange={(e) => setEditData({ ...editData, therapyName: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Стоимость терапии (₽):</label><input type="number" value={editData.therapyCost} onChange={(e) => setEditData({ ...editData, therapyCost: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" /></div></div><div className="flex gap-3 mt-6"><button onClick={handleCancelEdit} className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">Отмена</button><button onClick={handleSaveEdit} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">Сохранить</button></div></div></div></div>)}
    </div>
  );
}
