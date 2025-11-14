import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { prefetchNextRoute } from './utils/prefetch';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';

import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import CandidateFeatures from './components/CandidateFeatures';
import CompanyFeatures from './components/CompanyFeatures';
import SDGImpact from './components/SDGImpact';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import AnimatedStats from './components/AnimatedStats';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const OAuthMock = lazy(() => import('./pages/OAuthMock'));
const OAuthCallback = lazy(() => import('./pages/OAuthCallback'));

const DashboardLayout = lazy(() => import('./dashboard/components/DashboardLayout'));
const DashboardJobsHome = lazy(() => import('./dashboard/pages/DashboardJobsHome'));
const DashboardOverview = lazy(() => import('./dashboard/pages/DashboardOverview'));
const JobFinder = lazy(() => import('./dashboard/pages/JobFinder'));
const JobSimulation = lazy(() => import('./dashboard/pages/JobSimulation'));
const SkillSnapshot = lazy(() => import('./dashboard/pages/SkillSnapshot'));
const ApprenticeshipTracker = lazy(() => import('./dashboard/pages/ApprenticeshipTracker'));
const ApplicationTracker = lazy(() => import('./dashboard/pages/ApplicationTracker'));
const AutoCV = lazy(() => import('./dashboard/pages/AutoCV'));
const Profile = lazy(() => import('./dashboard/pages/Profile'));
const Settings = lazy(() => import('./dashboard/pages/Settings'));
const Portfolio = lazy(() => import('./dashboard/pages/Portfolio'));
const SimulasiKerja = lazy(() => import('./dashboard/pages/SimulasiKerja'));
const SimulasiDetail = lazy(() => import('./dashboard/pages/SimulasiDetail'));
const SimulasiLeaderboard = lazy(() => import('./dashboard/pages/SimulasiLeaderboard'));
const SimulasiExecution = lazy(() => import('./dashboard/pages/SimulasiExecution'));
const SimulasiResults = lazy(() => import('./dashboard/pages/SimulasiResults'));

const CompanyLayout = lazy(() => import('./company/components/CompanyLayout'));
const CompanyOverview = lazy(() => import('./company/pages/CompanyOverview'));
const CompanyJobs = lazy(() => import('./company/pages/CompanyJobs'));
const CreateJobForm = lazy(() => import('./company/pages/CreateJobForm'));
const EditJobForm = lazy(() => import('./company/pages/EditJobForm'));
const JobApplicants = lazy(() => import('./company/pages/JobApplicants'));
const CompanyInternships = lazy(() => import('./company/pages/CompanyInternships'));
const CreateInternshipForm = lazy(() => import('./company/pages/CreateInternshipForm'));
const EditInternshipForm = lazy(() => import('./company/pages/EditInternshipForm'));
const InternshipApplicants = lazy(() => import('./company/pages/InternshipApplicants'));
const InternshipApplicantDetail = lazy(() => import('./company/pages/InternshipApplicantDetail'));
const CompanyApplicants = lazy(() => import('./company/pages/CompanyApplicants'));
const ApplicantDetail = lazy(() => import('./company/pages/ApplicantDetail'));
const TalentSearch = lazy(() => import('./company/pages/TalentSearch'));
const EvaluationTemplates = lazy(() => import('./company/pages/EvaluationTemplates'));
const TeamManagement = lazy(() => import('./company/pages/TeamManagement'));
const CompanyActivity = lazy(() => import('./company/pages/CompanyActivity'));
const CompanySettings = lazy(() => import('./company/pages/CompanySettings'));
const CompanySimulasi = lazy(() => import('./company/pages/CompanySimulasi'));

const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
    <div className="text-center space-y-4">
      <motion.div
        className="w-16 h-16 mx-auto border-4 border-primary-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <p className="text-gray-600 font-medium">Memuat halaman...</p>
    </div>
  </div>
);

function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <HowItWorks />
      <CandidateFeatures />
      <CompanyFeatures />
      <SDGImpact />
      <AnimatedStats />
      <Testimonials />
      <Footer />
    </div>
  );
}

const useScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const timer = setTimeout(() => {
      prefetchNextRoute(location.pathname);
    }, 1000);
    return () => clearTimeout(timer);
  }, [location.pathname]);
};

const Page: React.FC<React.PropsWithChildren<{ direction?: 'left' | 'right' }>> = ({ children, direction = 'right' }) => {
  const initialX = direction === 'right' ? 60 : -60;
  return (
    <motion.div
      style={{ perspective: 1200 }}
      initial={{ opacity: 0, x: initialX, scale: 0.975, rotateX: 8, filter: 'blur(8px)' }}
      animate={{ opacity: 1, x: 0, scale: 1, rotateX: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, x: -initialX/2, scale: 0.985, rotateX: -4, filter: 'blur(6px)' }}
      transition={{ type: 'spring', stiffness: 180, damping: 28, mass: 0.9 }}
    >
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 1 },
          show: { opacity: 1, transition: { staggerChildren: 0.025, delayChildren: 0.08 } }
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

const AuthPage: React.FC<React.PropsWithChildren<{ direction?: 'left' | 'right' }>> = ({ children, direction = 'left' }) => {
  const offset = direction === 'left' ? 70 : -70;
  return (
    <motion.div
      initial={{ opacity: 0, x: offset, scale: 0.92, rotateY: 25, filter: 'blur(12px) saturate(60%)' }}
      animate={{ opacity: 1, x: 0, scale: 1, rotateY: 0, filter: 'blur(0px) saturate(100%)' }}
      exit={{ opacity: 0, x: -offset/3, scale: 0.95, rotateY: -12, filter: 'blur(10px) saturate(40%)' }}
      transition={{ type: 'spring', stiffness: 210, damping: 26, mass: 0.85 }}
      className="will-change-transform"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

function App() {
  useScrollToTop();
  const location = useLocation();
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Routes location={location}>
          <Route path="/" element={<Page><HomePage /></Page>} />
          <Route path="/login" element={<AuthPage direction="left"><Login /></AuthPage>} />
            <Route path="/register" element={<AuthPage direction="left"><Register /></AuthPage>} />
            <Route path="/auth/:provider" element={<AuthPage direction="left"><OAuthMock /></AuthPage>} />
            <Route path="/auth/callback" element={<AuthPage direction="left"><OAuthCallback /></AuthPage>} />

            {}
            <Route path="/dashboard" element={
              <ProtectedRoute requiredRole="candidate">
                <Page direction="right">
                  <ErrorBoundary fallback={
                    <div className="min-h-screen flex items-center justify-center bg-gray-50">
                      <div className="text-center space-y-4 max-w-md p-8">
                        <h2 className="text-2xl font-bold text-gray-900">Dashboard Error</h2>
                        <p className="text-gray-600">Terjadi kesalahan pada dashboard. Silakan refresh halaman.</p>
                        <button
                          onClick={() => window.location.reload()}
                          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                        >
                          Refresh Halaman
                        </button>
                      </div>
                    </div>
                  }>
                    <DashboardLayout />
                  </ErrorBoundary>
                </Page>
              </ProtectedRoute>
            }>
              <Route index element={<DashboardOverview />} />
              <Route path="jobs" element={<DashboardJobsHome />} />
              <Route path="job-finder" element={<JobFinder />} />
              <Route path="job-simulation" element={<JobSimulation />} />
              <Route path="simulasi-kerja" element={<SimulasiKerja />} />
              <Route path="simulasi-kerja/leaderboard" element={<SimulasiLeaderboard />} />
              <Route path="simulasi-kerja/:categoryId" element={<SimulasiDetail />} />
              <Route path="simulasi-kerja/:categoryId/execute" element={<SimulasiExecution />} />
              <Route path="simulasi-kerja/results/:resultId" element={<SimulasiResults />} />
              <Route path="apprenticeship-tracker" element={<ApprenticeshipTracker />} />
              <Route path="application-tracker" element={<ApplicationTracker />} />
              <Route path="auto-cv" element={<AutoCV />} />
              <Route path="portfolio" element={<Portfolio />} />
              <Route path="skill-snapshot" element={<SkillSnapshot />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {}
            <Route path="/company" element={
              <ProtectedRoute requiredRole="company">
                <Page direction="right">
                  <ErrorBoundary fallback={
                    <div className="min-h-screen flex items-center justify-center bg-gray-50">
                      <div className="text-center space-y-4 max-w-md p-8">
                        <h2 className="text-2xl font-bold text-gray-900">Company Dashboard Error</h2>
                        <p className="text-gray-600">Terjadi kesalahan pada dashboard perusahaan. Silakan refresh halaman.</p>
                        <button
                          onClick={() => window.location.reload()}
                          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                        >
                          Refresh Halaman
                        </button>
                      </div>
                    </div>
                  }>
                    <CompanyLayout />
                  </ErrorBoundary>
                </Page>
              </ProtectedRoute>
            }>
              <Route index element={<CompanyOverview />} />
              <Route path="jobs" element={<CompanyJobs />} />
              <Route path="jobs/new" element={<CreateJobForm />} />
              <Route path="jobs/:jobId/edit" element={<EditJobForm />} />
              <Route path="jobs/:jobId/applicants" element={<JobApplicants />} />
              <Route path="internships" element={<CompanyInternships />} />
              <Route path="internships/new" element={<CreateInternshipForm />} />
              <Route path="internships/:id/edit" element={<EditInternshipForm />} />
              <Route path="internships/:id/applicants" element={<InternshipApplicants />} />
              <Route path="internships/applicants/:id" element={<InternshipApplicantDetail />} />
              <Route path="simulasi" element={<CompanySimulasi />} />
              <Route path="applicants" element={<CompanyApplicants />} />
              <Route path="applicants/:applicationId" element={<ApplicantDetail />} />
              <Route path="talent" element={<TalentSearch />} />
              <Route path="evaluation-templates" element={<EvaluationTemplates />} />
              <Route path="team" element={<TeamManagement />} />
              <Route path="activity" element={<CompanyActivity />} />
              <Route path="settings" element={<CompanySettings />} />
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
  );
}

export default App;
