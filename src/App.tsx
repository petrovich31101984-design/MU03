import { useState } from 'react';
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

type UserRole = 'admin' | 'storekeeper' | null;

function App() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleRoleSelect = (role: UserRole) => {
    setUserRole(role);
    setCurrentPage('dashboard');
  };

  // Если роль не выбрана, показываем экран выбора роли
  if (!userRole) {
    return <RoleSelectionScreen onSelectRole={handleRoleSelect} />;
  }

  const renderPage = () => {
    if (userRole === 'admin') {
      // Приложение руководителя
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
      // Приложение кладовщика
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
