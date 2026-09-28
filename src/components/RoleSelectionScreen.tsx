type UserRole = 'admin' | 'storekeeper';

interface RoleSelectionScreenProps {
  onSelectRole: (role: UserRole) => void;
}

export default function RoleSelectionScreen({ onSelectRole }: RoleSelectionScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-white text-3xl font-bold">МУ</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">МедУчёт v.0.2</h1>
          <p className="text-lg text-gray-600">Система учёта лекарственных средств</p>
          <p className="text-sm text-gray-500 mt-2">Выберите роль для входа в систему</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <button onClick={() => onSelectRole('admin')} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-transparent hover:border-blue-500 transform hover:-translate-y-2">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors"><span className="text-5xl">👨‍💼</span></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Руководитель</h2>
              <p className="text-sm text-gray-600 text-center mb-4">Полный доступ к управлению подразделением, контроль расходов и остатков</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">Панель управления</span>
                <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">Сотрудники</span>
                <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">Отчёты</span>
                <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">Архив</span>
              </div>
              <div className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium group-hover:bg-blue-700 transition-colors">Войти как руководитель</div>
            </div>
          </button>
          <button onClick={() => onSelectRole('storekeeper')} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-transparent hover:border-green-500 transform hover:-translate-y-2">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors"><span className="text-5xl">📦</span></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Кладовщик</h2>
              <p className="text-sm text-gray-600 text-center mb-4">Управление складом, номенклатурой, приходами и остатками</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full">Номенклатура</span>
                <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full">Приходы</span>
                <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full">Остатки</span>
                <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full">Возвраты</span>
              </div>
              <div className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg font-medium group-hover:bg-green-700 transition-colors">Войти как кладовщик</div>
            </div>
          </button>
        </div>
        <div className="text-center mt-12 text-sm text-gray-500"><p>© 2026 МедУчёт. Все права защищены.</p></div>
      </div>
    </div>
  );
}
