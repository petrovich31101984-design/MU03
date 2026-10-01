import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout?: () => void;
}

export default function Layout({ children, currentPage, onNavigate, onLogout }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const menuItems = [
    { id: 'dashboard', label: 'Панель руководителя', icon: '🏠' },
    { id: 'employees', label: 'Сотрудники', icon: '👥' },
    { id: 'nomenclature', label: 'Номенклатура', icon: '💊' },
    { id: 'income', label: 'Приход к сотруднику', icon: '📥' },
    { id: 'expenses', label: 'Расход у сотрудника', icon: '📤' },
    { id: 'stock', label: 'Остатки у сотрудника', icon: '🧰' },
    { id: 'returns', label: 'Возвраты', icon: '↩️' },
    { id: 'chat', label: 'Сообщения', icon: '💬' },
    { id: 'report', label: 'Отчёты', icon: '📊' },
    { id: 'journal', label: 'Журнал', icon: '📝' },
    { id: 'archive', label: 'Архив', icon: '📁' },
  ];
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 flex-shrink-0`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">МУ</div>
            {sidebarOpen && (<div className="flex-1"><h1 className="font-bold text-gray-800 text-sm">МедУчёт v.0.2</h1><p className="text-xs text-gray-500">Выездное подразделение</p></div>)}
          </div>
          {sidebarOpen ? (<button onClick={() => setSidebarOpen(false)} className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100 text-xs">◀ Свернуть</button>) : (<button onClick={() => setSidebarOpen(true)} className="mt-2 w-full flex items-center justify-center px-2 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100 text-sm">▶</button>)}
        </div>
        <nav className="flex-1 p-2">
          {menuItems.map(item => (<button key={item.id} onClick={() => onNavigate(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all text-left ${currentPage === item.id ? 'bg-blue-50 text-blue-700 font-medium border border-blue-200' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}><span className="text-lg flex-shrink-0">{item.icon}</span>{sidebarOpen && (<span className="text-sm flex-1">{item.label}</span>)}</button>))}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div><h2 className="text-lg font-semibold text-gray-800">{menuItems.find(m => m.id === currentPage)?.label}</h2></div>
          {currentPage === 'dashboard' && (<div className="flex-1 mx-6 overflow-hidden"><div className="marquee-container"><div className="marquee-content"><p className="text-base whitespace-nowrap font-bold" style={{ color: '#0000FF' }}><span style={{ fontStyle: 'normal' }}>🖐</span><span className="italic">Здравствуйте, руководитель! </span><span style={{ fontStyle: 'normal' }}>🤖</span><span className="italic">Программа "МедУчёт" желает Вам продуктивного рабочего дня! Не забудьте отчитаться за прошлый месяц до 5-го числа. Спасибо! </span><span style={{ fontStyle: 'normal' }}>🙏</span></p></div></div></div>)}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2"><div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm">👨‍💼</div><div className="text-sm font-medium text-gray-800">Руководитель</div></div>
            {onLogout && (<button onClick={onLogout} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition">🚪 Выйти</button>)}
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
