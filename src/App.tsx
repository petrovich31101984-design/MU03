import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import LayoutStorekeeper from './components/LayoutStorekeeper';
import Dashboard from './components/Dashboard';
import Employees from './components/Employees';
import Nomenclature from './components/Nomenclature';
import Income from './components/Income';
import Expenses from './components/Expenses';
import Report from './components/Report';
import Journal from './components/Journal';
import Chat from './components/Chat';
import Returns from './components/Returns';
import Archive from './components/Archive';
import Stock from './components/Stock';
import DashboardStorekeeper from './components/DashboardStorekeeper';
import NomenclatureStorekeeper from './components/NomenclatureStorekeeper';
import IncomeStorekeeper from './components/IncomeStorekeeper';
import ExpensesStorekeeper from './components/ExpensesStorekeeper';
import StockStorekeeper from './components/StockStorekeeper';
import ReturnsStorekeeper from './components/ReturnsStorekeeper';
import ChatStorekeeper from './components/ChatStorekeeper';
import ReportStorekeeper from './components/ReportStorekeeper';
import ArchiveStorekeeper from './components/ArchiveStorekeeper';
import RoleSelectionScreen from './components/RoleSelectionScreen';
import { useStore } from './store/useStore';
import { UserRole } from './types';

function App() {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const loadData = useStore(state => state.loadData);
  const isLoading = useStore(state => state.isLoading);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-4 shadow-lg animate-pulse">
            <span className="text-white text-3xl font-bold">МУ</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">МедУчёт v.0.2</h1>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <p className="text-sm text-gray-500 mt-4">Загрузка данных из Google Sheets...</p>
        </div>
      </div>
    );
  }

  const handleRoleSelect = (role: UserRole) => {
    setUserRole(role);
    setCurrentPage('dashboard');
  };

  if (!userRole) {
    return <RoleSelectionScreen onSelectRole={handleRoleSelect} />;
  }

  const renderPage = () => {
    if (userRole === 'admin') {
      switch (currentPage) {
        case 'dashboard': return <Dashboard onNavigate={setCurrentPage} />;
        case 'employees': return <Employees />;
        case 'nomenclature': return <Nomenclature />;
        case 'income': return <Income />;
        case 'expenses': return <Expenses />;
        case 'stock': return <Stock />;
        case 'returns': return <Returns />;
        case 'chat': return <Chat />;
        case 'report': return <Report />;
        case 'journal': return <Journal />;
        case 'archive': return <Archive />;
        default: return <Dashboard />;
      }
    } else {
      switch (currentPage) {
        case 'dashboard': return <DashboardStorekeeper onNavigate={setCurrentPage} />;
        case 'nomenclature': return <NomenclatureStorekeeper />;
        case 'income': return <IncomeStorekeeper />;
        case 'expenses': return <ExpensesStorekeeper />;
        case 'stock': return <StockStorekeeper />;
        case 'returns': return <ReturnsStorekeeper />;
        case 'chat': return <ChatStorekeeper />;
        case 'report': return <ReportStorekeeper />;
        case 'archive': return <ArchiveStorekeeper />;
        default: return <DashboardStorekeeper />;
      }
    }
  };

  const LayoutComponent = userRole === 'admin' ? Layout : LayoutStorekeeper;

  const handleLogout = () => {
    setUserRole(null);
    setCurrentPage('dashboard');
  };

  return (
    <LayoutComponent currentPage={currentPage} onNavigate={setCurrentPage} onLogout={handleLogout}>
      {renderPage()}
    </LayoutComponent>
  );
}

export default App;
