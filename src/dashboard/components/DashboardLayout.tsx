import { Outlet } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';

const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 transition-colors">
      <DashboardHeader />
      <main className="max-w-7xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
