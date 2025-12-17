import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

// Context
import { BookingProvider } from './src/context/BookingContext';

// Components
import { Navbar, Footer } from './src/components/Layout';
import { ChatWidget } from './src/components/ChatWidget'; // Kept in original components/ folder

// Pages
import Home from './src/pages/Home';
import Search from './src/pages/Search';
import InstructorProfile from './src/pages/InstructorProfile';
import Pricing from './src/pages/Pricing';
import BookingConfirm from './src/pages/BookingConfirm';
import Payment from './src/pages/Payment';
import Dashboard from './src/pages/Dashboard';
import Compare from './src/pages/Compare';
import InfoPage from './src/pages/InfoPage';
import Login from './src/pages/Login';
import Register from './src/pages/Register';
import Learners from './src/pages/Learners';
import AdminDashboard from './src/pages/AdminDashboard';
import { ProtectedRoute } from './src/components/ProtectedRoute';

import { TEST_CENTRES } from './types';

const App = () => {
  return (
    <BookingProvider>
      <HashRouter>
        <div className="min-h-screen flex flex-col font-sans">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/search" element={<Search />} />
              <Route path="/instructor/:id" element={<InstructorProfile />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/booking" element={<Search />} /> {/* Redirect generic book to search first */}

              <Route element={<ProtectedRoute />}>
                <Route path="/booking-confirm" element={<BookingConfirm />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>

              <Route path="/compare" element={<Compare />} />

              <Route path="/test-centres" element={
                <InfoPage title="Test Centres" content={
                  <div className="space-y-4">
                    <p>We cover all major test centres in NSW. Select 'Map View' in Search to see them visually.</p>
                    <ul className="list-disc pl-5">
                      {TEST_CENTRES.map(t => <li key={t.name}>{t.name}</li>)}
                    </ul>
                  </div>
                } />
              } />

              <Route path="/learners" element={<Learners />} />
              <Route path="/instructors" element={<InfoPage title="Join as Instructor" content={<p>Grow your business with EzLicence...</p>} />} />
              <Route path="/gov-info" element={<InfoPage title="Government Info" content={<p>Keys2Drive is an Australian Government funded program...</p>} />} />
              <Route path="/vouchers" element={<InfoPage title="Gift Vouchers" content={<p>Give the gift of safety. Vouchers valid for 3 years...</p>} />} />
              <Route path="/safety" element={<InfoPage title="Safety Information" content={
                <div>
                  <h2 className="text-2xl font-bold mb-4">Essential Road Safety</h2>
                  <p>Driving is a life skill that requires patience, focus, and adherence to rules.</p>
                  <h3 className="text-xl font-bold mt-4 mb-2">The Fatal Five</h3>
                  <ul className="list-disc pl-5 mb-4">
                    <li>Speeding</li>
                    <li>Intoxication (Drink/Drug driving)</li>
                    <li>Failure to wear seatbelts</li>
                    <li>Fatigue</li>
                    <li>Distraction (Mobile phones)</li>
                  </ul>
                  <p>At EzLicence, we teach you not just to pass the test, but to survive on the road.</p>
                </div>
              } />} />
              <Route path="/reviews" element={<InfoPage title="Reviews" content={<p>See what our 10,000+ happy students are saying...</p>} />} />
              <Route path="/about" element={<InfoPage title="About Us" content={<p>EzLicence is Australia's leading platform for driving lessons...</p>} />} />
              <Route path="/faqs" element={<InfoPage title="FAQs" content={<p>Frequently asked questions about booking, cancellations, and tests...</p>} />} />
            </Routes>
          </div>
          <ChatWidget />
          <Footer />
        </div>
      </HashRouter>
    </BookingProvider>
  );
};

export default App;