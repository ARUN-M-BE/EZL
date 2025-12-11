import React, { useState, useEffect, useContext, createContext } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { 
  Search, MapPin, Star, User, Calendar, BookOpen, Shield, Gift, 
  HelpCircle, Info, Home as HomeIcon, LayoutDashboard, ChevronRight, 
  Menu, X, Check, DollarSign, Filter, Map as MapIcon, BarChart3,
  Users
} from 'lucide-react';
import { MOCK_INSTRUCTORS, MOCK_PACKAGES, TEST_CENTRES, Instructor, Package } from './types';
import { PerformanceRadar, PricingBarChart, CoverageMap } from './components/Charts';
import { ChatWidget } from './components/ChatWidget';

// --- Contexts ---
interface BookingState {
  instructor: Instructor | null;
  package: Package | null;
  date: string | null;
}
const BookingContext = createContext<{
  booking: BookingState;
  setBooking: React.Dispatch<React.SetStateAction<BookingState>>;
  comparisonList: Instructor[];
  addToCompare: (i: Instructor) => void;
  removeFromCompare: (id: string) => void;
} | null>(null);

// --- Layout Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { name: 'Search', path: '/search', icon: Search },
    { name: 'Learners', path: '/learners', icon: User },
    { name: 'Instructors', path: '/instructors', icon: Users },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-brand-600 text-white p-1.5 rounded-lg mr-2">
              <MapPin size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">EzLicence Explorer</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {links.map(link => (
              <Link 
                key={link.path} 
                to={link.path}
                className={`flex items-center text-sm font-medium transition-colors hover:text-brand-600 ${location.pathname === link.path ? 'text-brand-600' : 'text-gray-500'}`}
              >
                <link.icon size={16} className="mr-1.5" />
                {link.name}
              </Link>
            ))}
            <Link to="/booking" className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm">
              Book Lesson
            </Link>
          </div>

          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 hover:text-gray-700">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map(link => (
              <Link 
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-600 hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <link.icon size={18} className="mr-3" />
                  {link.name}
                </div>
              </Link>
            ))}
             <Link to="/booking" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-brand-600 font-bold">Book Lesson</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="text-white font-bold mb-4">Discover</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/search" className="hover:text-white">Find Instructor</Link></li>
            <li><Link to="/test-centres" className="hover:text-white">Test Centres</Link></li>
            <li><Link to="/vouchers" className="hover:text-white">Vouchers</Link></li>
            <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/faqs" className="hover:text-white">FAQs</Link></li>
            <li><Link to="/safety" className="hover:text-white">Safety Info</Link></li>
            <li><Link to="/gov-info" className="hover:text-white">Gov & Keys2Drive</Link></li>
            <li><Link to="/reviews" className="hover:text-white">Reviews</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/instructors" className="hover:text-white">Join Team</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">EzLicence</h4>
          <p className="text-sm text-gray-500">
            Making learning to drive simple, safe, and stress-free.
          </p>
        </div>
      </div>
    </footer>
  )
}

// --- View Components ---

const HomeView = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-600 to-brand-900 text-white py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/1920/1080?blur=5')] opacity-10 bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Master the Road with Confidence
          </h1>
          <p className="text-xl md:text-2xl text-brand-100 mb-10 max-w-3xl mx-auto">
            Find the perfect driving instructor in your area. Compare ratings, check real-time availability, and book instantly.
          </p>
          
          <div className="max-w-2xl mx-auto bg-white p-2 rounded-full shadow-2xl flex items-center">
             <MapPin className="text-gray-400 ml-4 hidden sm:block" />
             <input 
              type="text" 
              placeholder="Enter your suburb or postcode"
              className="flex-1 p-4 rounded-full text-gray-800 focus:outline-none"
             />
             <button 
              onClick={() => navigate('/search')}
              className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-full font-bold transition-colors"
            >
              Search
             </button>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose EzLicence?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: User, title: 'Verified Instructors', desc: 'All instructors are fully vetted, licensed, and hold Working with Children checks.' },
              { icon: Calendar, title: 'Real-time Booking', desc: 'See availability instantly and book lessons that fit your schedule 24/7.' },
              { icon: Shield, title: 'Secure Payments', desc: 'Your money is safe. We hold payments until the lesson is successfully completed.' }
            ].map((feature, i) => (
              <div key={i} className="text-center p-6 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-brand-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-600">
                  <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to start your engine?</h2>
          <div className="flex justify-center gap-4">
            <Link to="/search" className="bg-brand-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-brand-700 transition">Find an Instructor</Link>
            <Link to="/learners" className="bg-white text-gray-700 border border-gray-300 px-8 py-3 rounded-lg font-bold hover:bg-gray-50 transition">Learn More</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const SearchView = () => {
  const [filters, setFilters] = useState({ vehicle: 'All', sort: 'Rating' });
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const { addToCompare, comparisonList } = useContext(BookingContext)!;
  const navigate = useNavigate();

  const filteredInstructors = MOCK_INSTRUCTORS.filter(i => 
    filters.vehicle === 'All' || i.vehicle === filters.vehicle
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Find an Instructor</h1>
            <p className="text-gray-500">Showing {filteredInstructors.length} results near Sydney</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-brand-100 text-brand-700' : 'bg-white text-gray-500'}`}
            >
              <Menu size={20} />
            </button>
             <button 
              onClick={() => setViewMode('map')}
              className={`p-2 rounded ${viewMode === 'map' ? 'bg-brand-100 text-brand-700' : 'bg-white text-gray-500'}`}
            >
              <MapIcon size={20} />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm h-fit">
            <div className="flex items-center gap-2 mb-6 font-bold text-lg">
              <Filter size={20} /> Filters
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
              <select 
                value={filters.vehicle}
                onChange={(e) => setFilters({...filters, vehicle: e.target.value})}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-brand-500 focus:ring-brand-500 p-2 border"
              >
                <option value="All">All Types</option>
                <option value="Auto">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select className="w-full border-gray-300 rounded-lg shadow-sm focus:border-brand-500 focus:ring-brand-500 p-2 border">
                <option>Highest Rated</option>
                <option>Price: Low to High</option>
                <option>Most Reviews</option>
              </select>
            </div>

            {comparisonList.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="font-bold mb-3">Compare ({comparisonList.length})</h3>
                <button 
                  onClick={() => navigate('/compare')}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm hover:bg-indigo-700"
                >
                  View Comparison
                </button>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {viewMode === 'map' ? (
               <div className="bg-white p-4 rounded-xl shadow-sm">
                  <h3 className="font-bold mb-4">Coverage & Test Centres</h3>
                  <CoverageMap instructors={filteredInstructors} testCentres={TEST_CENTRES} />
               </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredInstructors.map(instructor => (
                  <div key={instructor.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
                    <div className="flex p-4 gap-4">
                      <img src={instructor.image} alt={instructor.name} className="w-20 h-20 rounded-full object-cover" />
                      <div>
                        <h3 className="font-bold text-lg">{instructor.name}</h3>
                        <div className="flex items-center text-yellow-500 text-sm mb-1">
                          <Star size={14} fill="currentColor" />
                          <span className="ml-1 text-gray-700 font-semibold">{instructor.rating}</span>
                          <span className="text-gray-400 mx-1">•</span>
                          <span className="text-gray-500">{instructor.reviews} reviews</span>
                        </div>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin size={14} /> {instructor.location}
                        </p>
                        <span className={`inline-block mt-2 text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 font-medium`}>
                          {instructor.vehicle}
                        </span>
                      </div>
                    </div>
                    <div className="px-4 pb-4">
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{instructor.bio}</p>
                      <div className="flex justify-between items-center border-t border-gray-50 pt-4">
                        <div className="font-bold text-xl">${instructor.price}<span className="text-sm text-gray-500 font-normal">/hr</span></div>
                        <div className="flex gap-2">
                           <button 
                              onClick={() => addToCompare(instructor)}
                              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                              title="Add to Compare"
                           >
                              <BarChart3 size={20} />
                           </button>
                           <Link to={`/instructor/${instructor.id}`} className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-bold">
                             View Profile
                           </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const InstructorProfileView = () => {
  const { id } = useParams(); // Fixed: using useParams from react-router-dom directly
  // Just grabbing the first one for demo if ID not found or matching mock
  const instructor = MOCK_INSTRUCTORS.find(i => i.id === id) || MOCK_INSTRUCTORS[0];
  const { setBooking } = useContext(BookingContext)!;
  const navigate = useNavigate();

  const handleBook = () => {
    setBooking(prev => ({ ...prev, instructor }));
    navigate('/pricing');
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
           <div className="flex flex-col md:flex-row gap-8 items-start">
             <img src={instructor.image} className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg" alt={instructor.name} />
             <div className="flex-1">
               <h1 className="text-3xl font-bold mb-2">{instructor.name}</h1>
               <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                 <span className="flex items-center gap-1"><MapPin size={16}/> {instructor.location}</span>
                 <span className="flex items-center gap-1"><Star size={16} className="text-yellow-500"/> {instructor.rating} ({instructor.reviews} reviews)</span>
                 <span className="bg-brand-100 text-brand-800 px-2 py-0.5 rounded font-medium">{instructor.vehicle}</span>
               </div>
               <p className="max-w-2xl text-gray-700">{instructor.bio}</p>
             </div>
             <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center min-w-[200px]">
                <p className="text-gray-500 text-sm mb-1">Hourly Rate</p>
                <p className="text-3xl font-bold text-gray-900 mb-4">${instructor.price}</p>
                <button onClick={handleBook} className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 shadow-md transform transition hover:-translate-y-0.5">
                  Book Lesson
                </button>
             </div>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
               <h2 className="text-xl font-bold mb-6">Instructor Performance</h2>
               <PerformanceRadar data={instructor.performance} />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
               <h2 className="text-xl font-bold mb-6">Student Reviews</h2>
               {/* Mock Reviews */}
               <div className="space-y-6">
                 {[1,2,3].map(i => (
                   <div key={i} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                     <div className="flex justify-between mb-2">
                       <span className="font-bold">Student User</span>
                       <span className="text-gray-400 text-sm">2 weeks ago</span>
                     </div>
                     <div className="flex text-yellow-400 text-xs mb-2">★★★★★</div>
                     <p className="text-gray-600">Great instructor! Very patient and helped me pass my test on the first try.</p>
                   </div>
                 ))}
               </div>
               <div className="mt-6 text-center">
                 <Link to="/reviews" className="text-brand-600 font-medium hover:underline">View all reviews</Link>
               </div>
            </div>
         </div>

         <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-bold mb-4">Availability</h3>
              <div className="grid grid-cols-4 gap-2 text-center text-sm mb-4">
                {['Mon','Tue','Wed','Thu'].map(d => (
                  <div key={d} className="bg-green-50 text-green-700 py-1 rounded">{d}</div>
                ))}
                 {['Fri','Sat','Sun'].map(d => (
                  <div key={d} className="bg-gray-100 text-gray-400 py-1 rounded">{d}</div>
                ))}
              </div>
              <p className="text-sm text-gray-500">Next available slot: <span className="font-bold text-gray-800">Monday, 10:00 AM</span></p>
            </div>
         </div>
      </div>
    </div>
  );
};

const CompareView = () => {
  const { comparisonList, removeFromCompare } = useContext(BookingContext)!;
  
  if (comparisonList.length === 0) {
    return <div className="p-8 text-center text-gray-500">No instructors selected for comparison.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Compare Instructors</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {comparisonList.map(instructor => (
          <div key={instructor.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden relative">
            <button 
              onClick={() => removeFromCompare(instructor.id)}
              className="absolute top-2 right-2 p-1 bg-gray-100 rounded-full hover:bg-red-100 text-gray-500 hover:text-red-600"
            >
              <X size={16}/>
            </button>
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-4">
               <img src={instructor.image} className="w-16 h-16 rounded-full" />
               <div>
                 <h3 className="font-bold">{instructor.name}</h3>
                 <p className="text-sm text-gray-500">{instructor.location}</p>
               </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">Price</div>
                <div className="font-bold">${instructor.price}/hr</div>
                <div className="text-gray-500">Vehicle</div>
                <div>{instructor.vehicle}</div>
                <div className="text-gray-500">Rating</div>
                <div className="text-yellow-600 font-bold">{instructor.rating} ★</div>
              </div>
              <div className="h-48 border-t border-gray-100 pt-4">
                 <p className="text-xs text-center text-gray-400 mb-2">Performance Profile</p>
                 <PerformanceRadar data={instructor.performance} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const PricingView = () => {
  const { setBooking, booking } = useContext(BookingContext)!;
  const navigate = useNavigate();

  const handleSelect = (pkg: Package) => {
    setBooking(prev => ({ ...prev, package: pkg }));
    navigate('/booking-confirm');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-4">Choose Your Package</h1>
      <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
        Save up to 10% when you bundle lessons. Packages are valid for 3 years.
      </p>

      <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
             <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><BarChart3/> Price Efficiency Calculator</h3>
             <PricingBarChart packages={MOCK_PACKAGES} />
             <p className="text-xs text-gray-400 mt-2 text-center">Based on standard hourly rate of $75/hr</p>
           </div>
        </div>
        <div className="space-y-4">
           {MOCK_PACKAGES.map(pkg => (
             <div 
                key={pkg.id} 
                onClick={() => handleSelect(pkg)}
                className={`bg-white border p-6 rounded-xl cursor-pointer transition-all hover:border-brand-500 hover:shadow-md flex justify-between items-center ${booking.package?.id === pkg.id ? 'border-brand-500 ring-2 ring-brand-100' : 'border-gray-200'}`}
             >
                <div>
                  <h3 className="font-bold text-lg">{pkg.name}</h3>
                  <p className="text-sm text-gray-500">{pkg.lessons} Lesson{pkg.lessons > 1 ? 's' : ''}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">${pkg.price}</div>
                  {pkg.discount > 0 && <div className="text-xs text-green-600 font-medium">Save {pkg.discount}%</div>}
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

const BookingConfirmView = () => {
  const { booking } = useContext(BookingContext)!;
  const navigate = useNavigate();

  if (!booking.instructor || !booking.package) {
    return <div className="p-12 text-center">Please select an instructor and package first. <Link to="/search" className="text-brand-600 underline">Search</Link></div>
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Confirm Booking</h1>
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="font-bold text-lg">Booking Summary</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex gap-4 items-center">
            <img src={booking.instructor.image} className="w-16 h-16 rounded-full" />
            <div>
              <p className="text-sm text-gray-500">Instructor</p>
              <p className="font-bold text-lg">{booking.instructor.name}</p>
              <p className="text-sm text-gray-600">{booking.instructor.vehicle}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Package</p>
              <p className="font-bold">{booking.package.name}</p>
              <p className="text-sm">{booking.package.lessons} Lessons</p>
            </div>
            <div>
               <p className="text-sm text-gray-500">Total Cost</p>
               <p className="font-bold text-xl text-brand-600">${booking.package.price}</p>
            </div>
          </div>
        </div>
        <div className="p-6 bg-gray-50">
          <button 
            onClick={() => navigate('/payment')}
            className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-700 transition shadow-lg"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  )
}

const PaymentView = () => {
    return (
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-4">Secure Payment</h2>
                <p className="text-gray-500 mb-8">This is a demo application. No actual payment will be processed.</p>
                <div className="space-y-4">
                     <button className="w-full bg-black text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2">
                        Pay with Apple Pay
                     </button>
                     <button className="w-full border border-gray-300 py-3 rounded-lg font-bold text-gray-700">
                        Pay with Credit Card
                     </button>
                </div>
                <Link to="/dashboard" className="block mt-6 text-brand-600 text-sm hover:underline">Skip to Dashboard</Link>
            </div>
        </div>
    )
}

const DashboardView = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Upcoming */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Calendar className="text-brand-600"/> Upcoming Lessons</h2>
                        <div className="p-4 bg-blue-50 text-blue-800 rounded-lg mb-4">
                            <p className="font-bold">Monday, 14th Oct @ 10:00 AM</p>
                            <p className="text-sm">with Sarah Jenkins (1.5 hrs)</p>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg opacity-60">
                            <p className="font-bold">Wednesday, 20th Oct @ 2:00 PM</p>
                            <p className="text-sm">with Sarah Jenkins (1.5 hrs)</p>
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-bold mb-4">Learning Progress</h2>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1"><span>Parking</span><span className="font-bold">80%</span></div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-brand-500 w-[80%]"></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1"><span>Highway Driving</span><span className="font-bold">45%</span></div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-yellow-400 w-[45%]"></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1"><span>Night Driving</span><span className="font-bold">20%</span></div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-red-400 w-[20%]"></div></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="font-bold text-gray-700 mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                             <Link to="/search" className="block w-full text-center py-2 bg-brand-600 text-white rounded hover:bg-brand-700">Book Lesson</Link>
                             <button className="block w-full text-center py-2 border border-gray-300 rounded hover:bg-gray-50">View History</button>
                             <Link to="/vouchers" className="block w-full text-center py-2 border border-gray-300 rounded hover:bg-gray-50">Buy Voucher</Link>
                        </div>
                    </div>
                    <div className="bg-indigo-900 text-white p-6 rounded-xl">
                        <h3 className="font-bold mb-2">Keys2Drive</h3>
                        <p className="text-sm opacity-80 mb-4">Don't forget to claim your free lesson provided by the government.</p>
                        <Link to="/gov-info" className="text-sm underline">Learn more</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

// --- Static Info Page Component ---
const InfoPage = ({ title, content }: { title: string, content: React.ReactNode }) => (
    <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">{title}</h1>
        <div className="prose prose-lg max-w-none text-gray-600">
            {content}
        </div>
    </div>
);

// --- Main App & Routing ---

const App = () => {
  const [booking, setBooking] = useState<BookingState>({ instructor: null, package: null, date: null });
  const [comparisonList, setComparisonList] = useState<Instructor[]>([]);

  const addToCompare = (inst: Instructor) => {
    if (!comparisonList.find(i => i.id === inst.id) && comparisonList.length < 3) {
      setComparisonList([...comparisonList, inst]);
    }
  };

  const removeFromCompare = (id: string) => {
    setComparisonList(comparisonList.filter(i => i.id !== id));
  };

  return (
    <BookingContext.Provider value={{ booking, setBooking, comparisonList, addToCompare, removeFromCompare }}>
      <HashRouter>
        <div className="min-h-screen flex flex-col font-sans">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/search" element={<SearchView />} />
              <Route path="/instructor/:id" element={<InstructorProfileView />} />
              <Route path="/pricing" element={<PricingView />} />
              <Route path="/booking" element={<SearchView />} /> {/* Redirect generic book to search first */}
              <Route path="/booking-confirm" element={<BookingConfirmView />} />
              <Route path="/payment" element={<PaymentView />} />
              <Route path="/compare" element={<CompareView />} />
              <Route path="/dashboard" element={<DashboardView />} />
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
              <Route path="/learners" element={<InfoPage title="For Learners" content={<p>Start your journey with verified instructors...</p>} />} />
              <Route path="/instructors" element={<InfoPage title="Join as Instructor" content={<p>Grow your business with EzLicence...</p>} />} />
              <Route path="/gov-info" element={<InfoPage title="Government Info" content={<p>Keys2Drive is an Australian Government funded program...</p>} />} />
              <Route path="/vouchers" element={<InfoPage title="Gift Vouchers" content={<p>Give the gift of safety. Vouchers valid for 3 years...</p>} />} />
              <Route path="/safety" element={<InfoPage title="Safety Information" content={<p>Safety is our top priority. All vehicles are dual-control...</p>} />} />
              <Route path="/reviews" element={<InfoPage title="Reviews" content={<p>See what our 10,000+ happy students are saying...</p>} />} />
              <Route path="/about" element={<InfoPage title="About Us" content={<p>EzLicence is Australia's leading platform for driving lessons...</p>} />} />
              <Route path="/faqs" element={<InfoPage title="FAQs" content={<p>Frequently asked questions about booking, cancellations, and tests...</p>} />} />
            </Routes>
          </div>
          <ChatWidget />
          <Footer />
        </div>
      </HashRouter>
    </BookingContext.Provider>
  );
};

export default App;