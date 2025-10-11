import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { FaCalendar, FaMapMarkerAlt, FaClock, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import './Events.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const API_URL = import.meta.env.VITE_API_URL;
const DESKTOP_ITEMS_PER_PAGE = 3;
const MOBILE_ITEMS_PER_PAGE = 1;

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    location: 'all',
    date: 'all',
    status: 'all'
  });
  const [locations, setLocations] = useState([]);
  const [dates, setDates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [itemsPerPage, setItemsPerPage] = useState(isMobile ? MOBILE_ITEMS_PER_PAGE : DESKTOP_ITEMS_PER_PAGE);
  
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const stampRef = useRef(null);
  const titleRef = useRef(null);
  const dividerRef = useRef(null);
  const descriptionRef = useRef(null);
  const filtersRef = useRef(null);
  const searchBoxRef = useRef(null);
  const dropdownGroupRef = useRef(null);
  const eventsGridRef = useRef(null);
  const paginationRef = useRef(null);
  const eventCardRefs = useRef([]);
  
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setItemsPerPage(window.innerWidth < 768 ? MOBILE_ITEMS_PER_PAGE : DESKTOP_ITEMS_PER_PAGE);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchEvents();
  }, []);
  
  useEffect(() => {
    if (!loading && events.length > 0) {
      eventCardRefs.current = Array(events.length).fill().map(() => React.createRef());
      
      setTimeout(() => {
        setupAnimations();
      }, 100);
    }
  }, [loading, events]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);
  
  useLayoutEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setItemsPerPage(mobile ? MOBILE_ITEMS_PER_PAGE : DESKTOP_ITEMS_PER_PAGE);
    };
    
    checkScreenSize();
    
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  const setupAnimations = () => {
    if (isMobile) {
      gsap.to(sectionRef.current, {
        opacity: 1,
        duration: 0.5,
        ease: "power1.out"
      });

      const elements = [
        { ref: headerRef.current, delay: 0 },
        { ref: titleRef.current, delay: 0.1 },
        { ref: dividerRef.current, delay: 0.2 },
        { ref: descriptionRef.current, delay: 0.3 },
        { ref: filtersRef.current, delay: 0.4 }
      ];

      elements.forEach(({ ref, delay }) => {
        if (ref) {
          gsap.fromTo(ref,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              delay,
              ease: "power1.out"
            }
          );
        }
      });

      if (eventsGridRef.current) {
        gsap.fromTo(eventsGridRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: 0.5,
            ease: "power1.out"
          }
        );

        const eventCards = document.querySelectorAll('.event-card_landing');
        eventCards.forEach((card, index) => {
          gsap.fromTo(card,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              delay: 0.6 + (index * 0.1),
              ease: "power1.out"
            }
          );
        });
      }

      if (paginationRef.current) {
        gsap.fromTo(paginationRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: 0.7,
            ease: "power1.out"
          }
        );
      }

      return;
    }

    if (sectionRef.current) {
      gsap.fromTo(sectionRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          clearProps: "all"
        }
      );
    }

    const headerElements = [
      { ref: headerRef.current, delay: 0 },
      { ref: stampRef.current, delay: 0.2 },
      { ref: titleRef.current, delay: 0.3 },
      { ref: dividerRef.current, delay: 0.4 },
      { ref: descriptionRef.current, delay: 0.5 }
    ];

    headerElements.forEach(({ ref, delay }) => {
      if (ref) {
        gsap.fromTo(ref,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            delay,
            clearProps: "all",
            scrollTrigger: {
              trigger: ref,
              start: "top 90%",
              toggleActions: "play none none none"
            }
          }
        );
      }
    });

    if (filtersRef.current) {
      gsap.fromTo(filtersRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: 0.6,
          clearProps: "all",
          scrollTrigger: {
            trigger: filtersRef.current,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        }
      );
    }

    if (eventsGridRef.current) {
      gsap.fromTo(eventsGridRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: 0.7,
          clearProps: "all",
          scrollTrigger: {
            trigger: eventsGridRef.current,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        }
      );

      const eventCards = document.querySelectorAll('.event-card_landing');
      eventCards.forEach((card, index) => {
        gsap.fromTo(card,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            delay: 0.8 + (index * 0.1),
            clearProps: "all",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none none"
            }
          }
        );
      });
    }

    if (paginationRef.current) {
      gsap.fromTo(paginationRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: 0.9,
          clearProps: "all",
          scrollTrigger: {
            trigger: paginationRef.current,
            start: "top 95%",
            toggleActions: "play none none none"
          }
        }
      );
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_URL}/api/events`);
      
      if (!response.ok) throw new Error('Failed to fetch events');
      
      const data = await response.json();
      console.log('Data dari API:', data);
      
      const statusValues = data.map(event => event.status);
      console.log('Status values dalam data:', statusValues);
      console.log('Jumlah upcoming events:', data.filter(event => event.status === 'upcoming').length);
      
      const processedEvents = data.map(event => ({
        ...event,
        status: event.status || 'upcoming'
      }));
      
      const sortedEvents = processedEvents
        .sort((a, b) => {
          if (a.status === 'upcoming' && b.status !== 'upcoming') return -1;
          if (a.status !== 'upcoming' && b.status === 'upcoming') return 1;
          
          return new Date(a.event_date) - new Date(b.event_date);
        });
      
      setEvents(sortedEvents);
      
      const uniqueLocations = [...new Set(sortedEvents.map(event => event.location))];
      const uniqueDates = [...new Set(sortedEvents.map(event => 
        format(new Date(event.event_date), 'MMMM yyyy')
      ))];
      
      setLocations(uniqueLocations);
      setDates(uniqueDates);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again later.');
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         event.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesLocation = filters.location === 'all' || event.location === filters.location;
    const matchesDate = filters.date === 'all' || 
                       format(new Date(event.event_date), 'MMMM yyyy') === filters.date;
    const matchesStatus = filters.status === 'all' || event.status === filters.status;
    
    if (filters.status !== 'all' && event.status !== filters.status) {
      console.log(`Event dengan judul ${event.title} tidak cocok dengan filter status:`, {
        'Filter status': filters.status,
        'Event status': event.status
      });
    }
    
    return matchesSearch && matchesLocation && matchesDate && matchesStatus;
  });
  
  useEffect(() => {
    if (!loading) {
      console.log('Filter aktif:', filters);
      console.log('Total events sebelum filter:', events.length);
      console.log('Total events setelah filter:', filteredEvents.length);
      console.log('Events dengan status upcoming:', events.filter(e => e.status === 'upcoming').length);
      console.log('Events dengan status completed:', events.filter(e => e.status === 'completed').length);
      console.log('Events dengan status cancelled:', events.filter(e => e.status === 'cancelled').length);
    }
  }, [filteredEvents, events, filters, loading]);

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    
    setTimeout(() => {
      setupAnimations();
      ScrollTrigger.refresh();
    }, 100);
  };

  const handleJoinEvent = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!userId || !token) {
        toast.error('Please login to join events');
        return;
      }

      const response = await fetch(`${API_URL}/api/events/${eventId}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to join event');
      }

      toast.success('Successfully registered for the event!');
      fetchEvents(); // Refresh events list
    } catch (err) {
      console.error('Error joining event:', err);
      toast.error(err.message || 'Failed to join event');
    }
  };

  if (loading) {
    return (
      <section className="events-section" ref={sectionRef}>
        <div className="container">
          <h2 className="section-title">Loading events...</h2>
          <div className="loading-spinner"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="events-section" ref={sectionRef}>
        <div className="container">
          <h2 className="section-title">Error</h2>
          <p className="section-subtitle">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="events-section" ref={sectionRef}>
      <div className="container">
        <div className="section-header retro" ref={headerRef}>
          <div className="vintage-stamp" ref={stampRef}>
            <span className="vintage-stamp-text">EVENTS</span>
          </div>
          <div className="header-content">
            <h2 className="section-title" ref={titleRef}>Upcoming Events</h2>
            <div className="section-divider" ref={dividerRef}>
              <span className="divider-star">★</span>
              <span className="divider-line"></span>
              <span className="divider-star">★</span>
              <span className="divider-line"></span>
              <span className="divider-star">★</span>
            </div>
          </div>
        </div>
        
        <div className="section-description" ref={descriptionRef}>
          <p>Join our exciting activities and create memories together</p>
        </div>
        
        <div className="events-filters-container" role="search" aria-label="Event filters" ref={filtersRef}>
          <div className="events-search-box" ref={searchBoxRef}>
            <FaSearch className="events-search-icon" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search events..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              aria-label="Search events"
              className="events-search-input"
            />
          </div>
          
          <div className="events-filter-dropdown-group" ref={dropdownGroupRef}>
            <select
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="events-location-select"
              aria-label="Filter by location"
            >
              <option value="all">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>

            <select
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
              className="events-date-select"
              aria-label="Filter by date"
            >
              <option value="all">All Dates</option>
              {dates.map(date => (
                <option key={date} value={date}>{date}</option>
              ))}
            </select>
            
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="events-status-select"
              aria-label="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="no-events">
            <p>No events found matching your criteria</p>
          </div>
        ) : (
          <>
            <div className="events-grid" ref={eventsGridRef}>
              {paginatedEvents.map((event, index) => (
                <div 
                  key={event.id} 
                  className={`event-card_landing ${event.status === 'completed' ? 'event-completed' : ''}`}
                >
                  <div className="event-content">
                    <h3 className="event-title">
                      {event.title}
                      <span className={`event-status event-status-${event.status}`}>
                        {event.status === 'upcoming' ? 'Akan Datang' : event.status === 'completed' ? 'Selesai' : 'Dibatalkan'}
                      </span>
                    </h3>
                    <p className="event-description">{event.description}</p>
                    <div className="event-details">
                      <div className="detail-item">
                        <FaCalendar className="detail-icon" />
                        <span>{format(new Date(event.event_date), 'dd MMMM yyyy')}</span>
                      </div>
                      <div className="detail-item">
                        <FaClock className="detail-icon" />
                        <span>{event.event_time}</span>
                      </div>
                      <div className="detail-item">
                        <FaMapMarkerAlt className="detail-icon" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <div className="event-footer">
                      {event.status === 'upcoming' ? (
                        <>
                          <button 
                            className="event-button"
                            onClick={() => handleJoinEvent(event.id)}
                          >
                            Join Event
                          </button>
                          <span className="participants-count">
                            {event.max_participants} spots available
                          </span>
                        </>
                      ) : event.status === 'completed' ? (
                        <span className="event-completed-text">Event telah selesai</span>
                      ) : (
                        <span className="event-cancelled-text">Event dibatalkan</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="events-pagination" ref={paginationRef}>
                <button
                  className="events-pagination-arrow"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Halaman sebelumnya"
                >
                  <FaChevronLeft />
                </button>
                
                <div className="events-page-indicator">
                  <div className="events-current-page">
                    {currentPage}
                  </div>
                  <div className="events-total-pages">
                    dari {totalPages}
                  </div>
                </div>

                <button
                  className="events-pagination-arrow"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Halaman berikutnya"
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Events;