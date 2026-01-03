import { useState, useEffect, useCallback } from 'react';

import {
  Search,
  Calendar,
  TrendingUp,
  Ticket,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Filter,
  X
} from "lucide-react";
import { getCurrentUser } from "../../api-services/users-service";
import { getEvents } from "../../api-services/events-service";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Badge } from "../../components/ui/Badge";
import { EventCard } from "../../components/EventCard";

interface EventData {
  _id: string;
  name: string;
  description: string;
  organizer: string;
  guest: string[];
  address: string;
  city: string;
  pincode: number;
  date: string;
  time: string;
  media: string[];
  ticketTypes: Array<{
    name: string;
    price: number;
    limit: number;
    booked?: number;
    available?: number;
  }>;
}

function LandingPage() {
  const [user, setUser] = useState<any>(null);
  const [events, setEvents] = useState<EventData[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventData[]>([]);
  const [filters, setFilters] = useState({
    searchText: "",
    date: "",
    category: "all",
    priceRange: [0, 500],
    location: ""
  });
  const [loading, setLoading] = useState(false);
  const [featuredEvents, setFeaturedEvents] = useState<EventData[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'popular' | 'upcoming'>('all');

  const getMinPrice = (ticketTypes: any[]) => {
    if (!ticketTypes || ticketTypes.length === 0) return 0;
    return Math.min(...ticketTypes.map(ticket => ticket.price || 0));
  };

  const getTotalBooked = (ticketTypes: any[]) => {
    if (!ticketTypes) return 0;
    return ticketTypes.reduce((total, ticket) => total + (ticket.booked || 0), 0);
  };

  const categories = [
    { value: 'music', label: 'Music' },
    { value: 'sports', label: 'Sports' },
    { value: 'arts', label: 'Arts' },
    { value: 'business', label: 'Business' },
    { value: 'technology', label: 'Technology' },
    { value: 'food', label: 'Food' },
    { value: 'community', label: 'Community' },
    { value: 'education', label: 'Education' },
    { value: 'general', label: 'General' }
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.data);
      } catch (error) {
        console.log("Welcome guest!");
      }
    };
    fetchUser();
  }, []);

  const getEventsData = useCallback(async (filtersObj: any) => {
    try {
      setLoading(true);
      const response = await getEvents(filtersObj);
      const eventsData: EventData[] = response.data;
      setEvents(eventsData);

      let filtered = [...eventsData];
      if (filtersObj.searchText) {
        const s = filtersObj.searchText.toLowerCase();
        filtered = filtered.filter(e => e.name.toLowerCase().includes(s) || e.city.toLowerCase().includes(s));
      }

      setFilteredEvents(filtered);
      setFeaturedEvents(eventsData.slice(0, 3));
    } catch (error: any) {
      console.error(error.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getEventsData(filters);
  }, [getEventsData, filters]);

  const stats = {
    totalEvents: events.length,
    freeEvents: events.filter(e => getMinPrice(e.ticketTypes || []) === 0).length,
    totalTickets: events.reduce((total, event) => total + getTotalBooked(event.ticketTypes || []), 0),
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/20 mix-blend-overlay" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]" />

        <div className="relative z-10 px-8 py-20 md:py-28 max-w-4xl">
          <Badge variant="secondary" className="mb-6 rounded-full px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 text-primary-light font-bold flex w-fit items-center gap-2">
            <Sparkles size={14} /> NEW EXPERIENCES AWAIT
          </Badge>

          <h1 className="text-white mb-6 text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
            Find your next <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-secondary">unforgettable</span> moment.
          </h1>

          <p className="text-xl text-slate-400 mb-12 leading-relaxed max-w-2xl">
            Welcome back, <span className="text-white font-bold">{user?.name || "Explorer"}</span>.
            Discover thousands of events from around the world on <span className="text-white font-semibold">Qetero.com</span>.
          </p>

          <div className="flex flex-wrap gap-10">
            {[
              { label: 'Events', value: stats.totalEvents, icon: <Calendar className="text-primary" /> },
              { label: 'Free Passes', value: stats.freeEvents, icon: <Ticket className="text-secondary" /> },
              { label: 'Booked Today', value: stats.totalTickets, icon: <TrendingUp className="text-pink-400" /> }
            ].map((stat, idx) => (
              <div key={idx} className="flex items-center gap-4 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em]">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Filter Card */}
      <section className="sticky top-6 z-40 px-4 -mt-16">
        <Card shadow="lg" className="rounded-3xl border-white/40 bg-white/70 backdrop-blur-2xl p-4 shadow-xl shadow-primary/5">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
              <Input
                placeholder="Search events, venues, cities..."
                value={filters.searchText}
                onChange={(e) => setFilters({ ...filters, searchText: e.target.value })}
                className="pl-12 h-14 rounded-2xl border-transparent bg-slate-100/50 focus:bg-white transition-all text-lg"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                options={[{ value: 'all', label: 'All Categories' }, ...categories]}
                className="h-14 min-w-[180px] rounded-2xl border-transparent bg-slate-100/50"
              />
              <Button size="lg" className="h-14 px-8 rounded-2xl shadow-lg shadow-primary/25">
                Explore Events <ChevronRight className="ml-2" size={18} />
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Main Content Sections */}
      <section className="px-2">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Editor's Choice</h2>
            <p className="text-slate-500 font-medium">Hand-picked events just for you</p>
          </div>
          <Button variant="ghost" className="text-primary font-bold">
            View All <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredEvents.length > 0 ? (
            featuredEvents.map((event, idx) => (
              <EventCard key={event._id} event={event} index={idx} featured />
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-slate-400 font-medium">
              No featured events found.
            </div>
          )}
        </div>
      </section>

      <section className="px-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-slate-100 pb-6">
          <div className="flex gap-8">
            {['all', 'popular', 'upcoming'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`text-lg font-bold pb-4 transition-all relative ${activeTab === tab ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                {tab.charAt(0) + tab.slice(1)} Events
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full animate-slide-in-top" />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="rounded-xl bg-slate-50 text-slate-600">
              <Filter size={16} className="mr-2" /> Filters
            </Button>
            {filters.searchText && (
              <Badge variant="primary" className="pl-3 pr-1 py-1 flex items-center gap-2">
                {filters.searchText}
                <X size={14} className="cursor-pointer hover:text-white" onClick={() => setFilters({ ...filters, searchText: "" })} />
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            Array(8).fill(0).map((_, i) => (
              <div key={i} className="h-96 bg-slate-100 rounded-[2rem] animate-pulse" />
            ))
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((event, idx) => (
              <EventCard key={event._id} event={event} index={idx} />
            ))
          ) : (
            <Card className="col-span-full py-20 bg-slate-50 border-dashed border-2 flex flex-col items-center justify-center text-center">
              <Ticket size={48} className="text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No events found</h3>
              <p className="text-slate-500 max-w-xs">Try adjusting your filters or search terms to find what you're looking for.</p>
              <Button
                variant="ghost"
                className="mt-6 text-primary font-bold"
                onClick={() => {
                  setFilters({ searchText: "", date: "", category: "all", priceRange: [0, 500], location: "" });
                }}
              >
                Clear all filters
              </Button>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
