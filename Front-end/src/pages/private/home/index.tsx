import { Button, message } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Funnel } from "lucide-react";
import { getEvents } from "../../../api-services/events-service";
import type { EventType } from "../../../interface";
import EventCard from "./common";
import Filters from "./common/filters";
import Card from "../../../components/ui/Card";
import SectionHeader from "../../../components/ui/SectionHeader";
import EmptyState from "../../../components/ui/EmptyState";
import type { CSSProperties } from "react";
import PageSearch from "../../../components/PageSearch";
import { useNavExtension } from "../../../layouts/nav-extension-context";

function Home() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [filters, setFilters] = useState({
    searchText: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { setHomeSearchConfig } = useNavExtension();

  // const getData = async () => {
  //   try {
  //     const response = await getCurrentUser();
  //     const eventResponse = await getEvents()
  //     setUser(response.data);
  //     setEvents(eventResponse.data)
  //   } catch (error:any) {
  //     message.error(error.response.data.message || error.message);
  //     console.log(error.response.data.message || error.message);
  //   }
  // }

  const getData = useCallback(async (filtersObj: any) => {
    try {
      setLoading(true);
      const response = await getEvents(filtersObj);
      setEvents(response.data);
    } catch (error: any) {
      message.error(error.response.data.message || error.message);
      console.log(error.response.data.message || error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleHeaderSearch = useCallback(() => {
    setFilters((prev) => {
      const trimmed = prev.searchText.trim();
      const nextFilters = { ...prev, searchText: trimmed };
      getData(nextFilters);
      return nextFilters;
    });
  }, [getData]);

  const searchProps = useMemo(
    () => ({
      value: filters.searchText,
      onChange: (value: string) => setFilters((prev) => ({ ...prev, searchText: value })),
      onSearch: handleHeaderSearch,
      placeholder: "Search events",
    }),
    [filters.searchText, handleHeaderSearch]
  );

  useEffect(() => {
    setHomeSearchConfig(searchProps);
    return () => {
      setHomeSearchConfig(null);
    };
  }, [searchProps, setHomeSearchConfig]);

  useEffect(() => {
    getData({ searchText: "", date: "" });
  }, [getData]);

  const filterPanelStyle: CSSProperties = {
    maxHeight: showFilters ? 420 : 0,
    opacity: showFilters ? 1 : 0,
    transform: showFilters ? "translateY(0)" : "translateY(-12px)",
    pointerEvents: showFilters ? "auto" : "none",
  };

  const eventsLabel = loading ? "Loading events…" : `${events.length} event(s) found`;

  return (
    <div className="space-y-5">
      {/* Page header + indicator */}
      <div className="space-y-3 flex lg:items-center lg:justify-between lg:space-y-0">
        <SectionHeader
          title="Discover Events"
          subtitle="Find the best upcoming events and book tickets in seconds"
        />
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          
          <div className="flex justify-end gap-3 text-right md:flex-row md:items-center md:gap-4 md:justify-end">
            <div className="text-right text-[0.65rem] uppercase tracking-[0.35em] text-[var(--muted)]">
              % eventsFound
              <div className="text-sm font-semibold text-[var(--text)]">{eventsLabel}</div>
            </div>
            <Button
              type="text"
              icon={<Funnel size={18} />}
              onClick={() => setShowFilters((prev) => !prev)}
              className="h-10 w-10 rounded-full border border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)] transition hover:text-[var(--text)]"
              aria-label="Toggle filters"
            />
          </div>
        </div>
      </div>
      <div className="md:hidden">
            <PageSearch {...searchProps} className="w-full" />
          </div>

      <div
        className="overflow-hidden transition-all duration-500 ease-out"
        style={filterPanelStyle}
      >
        <Card className="p-4 sm:p-5 q-animate-in">
          <Filters filters={filters} setFilters={setFilters} onFilter={getData} className="mb-5" />
        </Card>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {events.length === 0 && !loading ? (
          <EmptyState
            title="No events match your filters"
            description="Try a different search term or clear the date filter."
          />
        ) : (
          <div className="q-stagger grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {events.map((event: any, index: number) => (
              <div
                key={event._id}
                className="q-stagger-item flex"
                style={{ ['--q-delay' as '--q-delay']: `${Math.min(index, 8) * 60}ms` } as CSSProperties}
              >
                <EventCard event={event} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


export default Home