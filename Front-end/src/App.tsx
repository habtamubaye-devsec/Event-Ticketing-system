import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import Home from "./pages/private/home";
import ProfilePage from "./pages/private/profile";
import PublicLayout from "./layouts/public-layout";
import PrivateLayout from "./layouts/private-layout";
import EventsPage from "./pages/private/admin/events";
import CreateEventsPage from "./pages/private/admin/events/createEvents";
import EditEventsPage from "./pages/private/admin/events/editEvents";
import EventDetail from "./pages/private/events";
import UserBooking from "./pages/private/booking";
import AdminBooking from "./pages/private/admin/booking";
import UsersPage from "./pages/private/admin/user";
import AdminReport from "./pages/private/admin/reports";
import UserReportPage from "./pages/private/reports";
import AdminQrCheckin from "./pages/private/admin/qr-checkin";
import FAQPage from "./pages/public/faqPage";
import TermsPage from "./pages/public/termsPage";
import PrivacyPage from "./pages/public/privacyPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicLayout>
              <Login />
            </PublicLayout>
          }
        />

        <Route
          path="/register"
          element={
            <PublicLayout>
              <Register />
            </PublicLayout>
          }
        />

        <Route path="/faq" element={<FAQPage />} />

        <Route path="/terms" element={<TermsPage />} />

        <Route path="/privacy" element={<PrivacyPage />} />

        <Route
          path="/"
          element={
            <PrivateLayout>
              <Home />
            </PrivateLayout>
          }    
        />

        <Route
          path="/events/:id"
          element={
            <PrivateLayout>
              <EventDetail />
            </PrivateLayout>
          }    
        />

        <Route
          path="/profile"
          element={
            <PrivateLayout>
              <ProfilePage />
            </PrivateLayout>
          }
        />

        <Route
          path="/bookings"
          element={
            <PrivateLayout>
              <UserBooking />
            </PrivateLayout>
          }
        />

        <Route
          path="/reports"
          element={
            <PrivateLayout>
              <UserReportPage />
            </PrivateLayout>
          }
        />

        <Route
          path="/admin/bookings"
          element={
            <PrivateLayout>
              <AdminBooking />
            </PrivateLayout>
          }
        />

        <Route
          path="/admin/users"
          element={
            <PrivateLayout>
              <UsersPage />
            </PrivateLayout>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <PrivateLayout>
              <AdminReport />
            </PrivateLayout>
          }
        />

        <Route
          path="/admin/events"
          element={
            <PrivateLayout>
              <EventsPage />
            </PrivateLayout>
          }
        />

        <Route
          path="/admin/events/create"
          element={
            <PrivateLayout>
              <CreateEventsPage />
            </PrivateLayout>
          }
        />

        <Route
          path="/admin/events/edit/:id"
          element={
            <PrivateLayout>
              <EditEventsPage />
            </PrivateLayout>
          }
        />

        <Route
          path="/admin/qr-checkin"
          element={
            <PrivateLayout>
              <AdminQrCheckin />
            </PrivateLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
