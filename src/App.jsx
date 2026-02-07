import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// --- LAYOUTS ---
import StudentLayout from './layouts/StudentLayout'; 
import InstructorLayout from './pages/instructor/InstructorLayout';
import CompanyLayout from './pages/company/CompanyLayout'; 

// --- PUBLIC PAGES ---
import Home from './pages/Home';
import PublicProfile from './pages/PublicProfile';
import PublicInstructor from './pages/PublicInstructor';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyOTP from './pages/VerifyOTP';
import Catalog from './pages/Catalog';
import CourseDetail from './pages/CourseDetail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// --- STUDENT PAGES ---
import DashboardHome from './pages/student/DashboardHome';
import ProfilePage from './pages/student/ProfilePage';
import EnrolledCourses from './pages/student/EnrolledCourses';
import BrowseCourses from './pages/student/BrowseCourses';
import CoursePlayer from './pages/student/CoursePlayer'; 
import PaymentsPage from './pages/student/PaymentPage';
import NotificationsPage from './pages/student/NotificationsPage';
import MyTrainings from './pages/student/MyTrainings';
import GoTraining from './pages/student/GoTraining';
import CertificatesPage from './pages/student/CertificatesPage';

// --- INSTRUCTOR PAGES ---
import InstructorDashboard from './pages/instructor/InstructorDashboard'; // Dashboard Component
import MyCourses from './pages/instructor/MyCourses';
import CreateCourse from './pages/instructor/CreateCourse';
import InstructorPayments from './pages/instructor/InstructorPayments';
import InstructorNotifications from './pages/instructor/InstructorNotifications';
import InstructorProfile from './pages/instructor/InstructorProfile';
import InstructorQuizzes from './pages/instructor/InstructorQuizzes'; // List Page
import CreateQuiz from './pages/instructor/CreateQuiz';             // Create Form Page

// --- COMPANY PAGES ---
import CompanyDashboard from './pages/company/CompanyDashboard';
import ManageEmployees from './pages/company/ManageEmployees';
import CreateTraining from './pages/company/CreateTraining';
import CompanySettings from './pages/company/CompanySettings';

// DashboardWrapper: Role-based automatic redirection logic
const DashboardWrapper = () => {
  const { user } = useAuth();
  
  if (user?.role === 'Instructor') return <Navigate to="/instructor/dashboard" replace />;
  if (user?.role === 'Company') return <Navigate to="/company/dashboard" replace />;
  
  return <Navigate to="/dashboard/home" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/course/:courseId" element={<CourseDetail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* --- Full-Screen Specialized Players --- */}
        <Route 
          path="/dashboard/course-content/:slug" 
          element={
            <ProtectedRoute>
              <CoursePlayer /> 
            </ProtectedRoute>
          } 
        />

        {/* --- Central Protected Entry Point --- */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardWrapper />
            </ProtectedRoute>
          } 
        />

        {/* --- NESTED STUDENT DASHBOARD --- */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          {/* Default Redirect to 'home' */}
          <Route index element={<Navigate to="home" replace />} />
          
          <Route path="home" element={<DashboardHome />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="enrolled-courses" element={<EnrolledCourses />} />
          <Route path="my-trainings" element={<MyTrainings />} />
          <Route path="active-trainings" element={<MyTrainings />} />
          <Route path="training/:id" element={<GoTraining />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="certificates" element={<CertificatesPage />} />
          <Route path="browse-courses" element={<BrowseCourses />} />
        </Route>

        {/* --- NESTED INSTRUCTOR TERMINAL --- */}
        <Route 
          path="/instructor" 
          element={
            <ProtectedRoute>
              <InstructorLayout />
            </ProtectedRoute>
          }
        >
          {/* --- FIX FOR BLANK SCREEN: Default Redirect to 'dashboard' --- */}
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<InstructorDashboard />} />
          <Route path="courses" element={<MyCourses />} />
          <Route path="create-course" element={<CreateCourse />} />
          <Route path="courses/edit/:slug" element={<CreateCourse />} />
          
          {/* --- QUIZ ROUTES --- */}
          <Route path="quizzes" element={<InstructorQuizzes />} />        {/* List View */}
          <Route path="quizzes/create" element={<CreateQuiz />} />        {/* Create Form */}
          <Route path="quizzes/edit/:id" element={<CreateQuiz />} />      {/* Edit Form */}
          
          <Route path="payments" element={<InstructorPayments />} />
          <Route path="notifications" element={<InstructorNotifications />} />
          <Route path="profile" element={<InstructorProfile />} />
        </Route>

        {/* --- NESTED COMPANY HQ --- */}
        <Route 
          path="/company" 
          element={
            <ProtectedRoute>
              <CompanyLayout />
            </ProtectedRoute>
          }
        >
          {/* Default Redirect to 'dashboard' */}
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<CompanyDashboard />} />
          <Route path="employees" element={<ManageEmployees />} />
          <Route path="create-training" element={<CreateTraining />} />
          <Route path="settings" element={<CompanySettings />} />
        </Route>

        {/* Fallback Redirect */}
        <Route path="/u/:username" element={<PublicProfile />} />
        <Route path="/instructor/username/:username" element={<PublicInstructor />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;