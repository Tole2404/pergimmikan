import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faSearch, faSort, faUsers, faFilter, faTags } from '@fortawesome/free-solid-svg-icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { showWarning } from '../../utils/sweetalert';
import DynamicSEO from '../common/DynamicSEO';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './Team.css';
import './highlight.css';

const API_URL = import.meta.env.VITE_API_URL;
const SITE_URL = 'https://pergimmikan.site';

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      const element = document.getElementById(hash);
      
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('pgm-team__card--highlighted');
          setTimeout(() => {
            element.classList.remove('pgm-team__card--highlighted');
          }, 2000);
        }, 500);
      }
    }
  }, [teamMembers]);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch(`${API_URL}/api/team`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch team members');
        }

        const data = await response.json();
        setTeamMembers(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch team members');
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  const roles = useMemo(() => {
    const uniqueRoles = [...new Set(teamMembers.map(member => member.role))];
    return ['all', ...uniqueRoles];
  }, [teamMembers]);

  const { leaderMembers, momiMembers, otherMembers } = useMemo(() => {
    const filtered = teamMembers
      .filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            member.role.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || member.role === roleFilter;
        return (matchesSearch && matchesRole) && member.status !== 'inactive';
      });

    const leaders = filtered.filter(member => member.role === 'Ketua');
    const momis = filtered.filter(member => member.role === 'Momi');
    const others = filtered.filter(member => member.role !== 'Ketua' && member.role !== 'Momi');
    
    if (sortBy && sortOrder) {
      others.sort((a, b) => {
        const aValue = a[sortBy].toLowerCase();
        const bValue = b[sortBy].toLowerCase();
        const compareResult = aValue.localeCompare(bValue);
        return sortOrder === 'asc' ? compareResult : -compareResult;
      });
    }
    
    return { leaderMembers: leaders, momiMembers: momis, otherMembers: others };
  }, [teamMembers, searchTerm, roleFilter, sortBy, sortOrder]);

  const allFilteredAndSortedMembers = useMemo(() => {
    return [...leaderMembers, ...momiMembers, ...otherMembers];
  }, [leaderMembers, momiMembers, otherMembers]);

  // Generate structured data for all team members
  const generateStructuredData = () => {
    const members = teamMembers.map(member => ({
      "@type": "Person",
      "name": member.name,
      ...(member.short_name && { "alternateName": member.short_name }),
      "jobTitle": member.role,
      "image": `${API_URL}${member.image_url}`,
      "url": `${SITE_URL}/team#${member.name.toLowerCase().replace(/\s+/g, '-')}`,
      "description": member.description,
      "memberOf": {
        "@type": "Organization",
        "name": "PERGIMMIKAN"
      },
      ...(member.linkedin && { "sameAs": [member.linkedin] }),
      ...(member.github && { "sameAs": [member.github] }),
      ...(member.instagram && { "sameAs": [member.instagram] })
    }));

    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": members.map((member, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": member
      }))
    };
  };

  const TeamMemberCard = ({ member, isLeader = false, isMomi = false }) => {
    const handleSocialClick = (platform, url) => {
      if (url && url.trim() !== '') {
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        showWarning(
          'No Link Available', 
          `This team member has not provided their ${platform} profile link.`
        );
      }
    };

    const anchorId = member.name.toLowerCase().replace(/\s+/g, '-');

    return (
      <article 
        id={anchorId} 
        className={`pgm-team__card ${isLeader ? 'pgm-team__card--leader' : ''} ${isMomi ? 'pgm-team__card--momi' : ''}`}
        itemScope 
        itemType="https://schema.org/Person"
      >
        {isMomi && <div className="pgm-team__momi-label">MOMI</div>}
        {isLeader && (
          <>
            <div className="pgm-team__leader-decoration pgm-team__leader-decoration--left"></div>
            <div className="pgm-team__leader-decoration pgm-team__leader-decoration--right"></div>
            <div className="pgm-team__leader-label">KETUA</div>
          </>
        )}
        <div className="lanyard-strap"></div>
        <div className="lanyard-hole"></div>
        <div className="pgm-team__card-frame">
          <img 
            src={`${API_URL}${member.image_url}`}
            alt={member.name} 
            className="pgm-team__image"
            loading="lazy"
            itemProp="image"
          />
        </div>
        <div className="pgm-team__card-content">
          <div>
            <h2 id={`${member.name.toLowerCase().replace(/\s+/g, '-')}-profile`} className="pgm-team__name" itemProp="name">{member.name}</h2>
            <p className="pgm-team__role" itemProp="jobTitle">{member.role}</p>
          </div>
          <div className="pgm-team__social" style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            {member.linkedin && <link itemProp="sameAs" href={member.linkedin} />}
            {member.github && <link itemProp="sameAs" href={member.github} />}
            {member.instagram && <link itemProp="sameAs" href={member.instagram} />}
            <span 
              onClick={() => handleSocialClick('LinkedIn', member.linkedin)}
              className={`pgm-team__social-icon ${member.linkedin ? 'pgm-team__social-icon--active' : 'pgm-team__social-icon--inactive'}`}
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </span>
            
            <span 
              onClick={() => handleSocialClick('GitHub', member.github)}
              className={`pgm-team__social-icon ${member.github ? 'pgm-team__social-icon--active' : 'pgm-team__social-icon--inactive'}`}
            >
              <FontAwesomeIcon icon={faGithub} />
            </span>
            
            <span 
              onClick={() => handleSocialClick('Instagram', member.instagram)}
              className={`pgm-team__social-icon ${member.instagram ? 'pgm-team__social-icon--active' : 'pgm-team__social-icon--inactive'}`}
            >
              <FontAwesomeIcon icon={faInstagram} />
            </span>
          </div>
        </div>
      </article>
    );
  };

  const Controls = () => (
    <div className="pgm-team__controls">
      <div className="pgm-team__search-container">
        <div className="pgm-team__search">
          <FontAwesomeIcon icon={faSearch} className="pgm-team__search-icon" />
          <input
            type="text"
            placeholder="Search by name or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pgm-team__search-input"
          />
        </div>
      </div>

      <div className="pgm-team__filters-container">
        <div className="pgm-team__filter-group">
          <FontAwesomeIcon icon={faTags} className="pgm-team__filter-icon" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="pgm-team__filter-select"
          >
            {roles.map(role => (
              <option key={role} value={role}>
                {role === 'all' ? 'All Roles' : role}
              </option>
            ))}
          </select>
        </div>

        <div className="pgm-team__sort-group">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="pgm-team__sort-select"
          >
            <option value="name">Sort by Name</option>
            <option value="role">Sort by Role</option>
          </select>
          <button
            onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
            className="pgm-team__sort-direction"
            aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
          >
            <FontAwesomeIcon 
              icon={faSort} 
              className={`pgm-team__sort-icon ${sortOrder === 'desc' ? 'reversed' : ''}`}
            />
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="pgm-team">
        <div className="pgm-team__container">
          <div className="pgm-team__loading-container">
            <div className="pgm-team__loading-card">
              <div className="pgm-team__loading-lanyard"></div>
              <div className="pgm-team__loading-spinner">
                <div className="pgm-team__loading-circle"></div>
                <FontAwesomeIcon icon={faUsers} className="pgm-team__loading-icon" />
              </div>
              <div className="pgm-team__loading-text">
                <div className="pgm-team__loading-line"></div>
                <div className="pgm-team__loading-line pgm-team__loading-line--short"></div>
              </div>
              <div className="pgm-team__loading-label">Loading Team Members...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pgm-team">
        <div className="pgm-team__container">
          <div className="pgm-team__error">{error}</div>
        </div>
      </div>
    );
  }

  // Generate member names for meta description
  const memberNames = allFilteredAndSortedMembers.slice(0, 10).map(m => m.name).join(', ') || 'Tim Petualang';
  const totalMembers = teamMembers.filter(m => m.status !== 'inactive').length;
  const pageTitle = totalMembers > 0 ? `Tim PERGIMMIKAN - ${totalMembers} Anggota Petualang Indonesia` : 'Tim PERGIMMIKAN - Komunitas Petualang Indonesia';
  const ogTitle = totalMembers > 0 ? `Tim PERGIMMIKAN - ${totalMembers} Anggota Petualang` : 'Tim PERGIMMIKAN - Komunitas Petualang';

  return (
    <>
      {/* Dynamic SEO from database or fallback */}
      <DynamicSEO 
        pageType="team"
        fallback={{
          title: pageTitle,
          description: `Kenali tim PERGIMMIKAN: ${memberNames}${totalMembers > 10 ? ' dan lainnya' : ''}. Komunitas petualang dan pendaki gunung Indonesia yang solid dan berpengalaman.`,
          keywords: `PERGIMMIKAN team, ${teamMembers.map(m => m.name).join(', ') || 'tim pendaki'}, tim pendaki Indonesia, komunitas petualangan, ${teamMembers.map(m => m.short_name).filter(Boolean).join(', ')}`,
          og_title: ogTitle,
          og_description: `Kenali tim PERGIMMIKAN: ${memberNames}${totalMembers > 10 ? ' dan lainnya' : ''}. Komunitas petualang Indonesia.`,
          canonical_url: `${SITE_URL}/team`,
          structured_data: generateStructuredData()
        }}
      />

      <div className="pgm-team">
        <div className="pgm-team__container">
          <div className="pgm-team__header">
            <div className="pgm-team__header-background"></div>
            <div className="pgm-team__header-icon"><FontAwesomeIcon icon={faUsers} /></div>
            <h1 className="pgm-team__title">Our Team</h1>
            <p className="pgm-team__subtitle">The Creative Minds Behind PERGIMMIKAN</p>
            <div className="pgm-team__header-decoration"></div>
          </div>
        
        <div className="pgm-team__seo-anchors" style={{ display: 'none' }}>
          {teamMembers.map(member => (
            <React.Fragment key={member.id}>
              <h2 id={`${member.name.toLowerCase().replace(/\s+/g, '-')}-seo`}>
                {member.name} - {member.role} at PERGIMMIKAN
              </h2>
              {member.short_name && (
                <h3 id={`${member.short_name.toLowerCase().replace(/\s+/g, '-')}-seo`}>
                  {member.short_name} ({member.name}) - {member.role} PERGIMMIKAN
                </h3>
              )}
            </React.Fragment>
          ))}
        </div>

        <Controls />

        {leaderMembers.length > 0 && (
          <div className="pgm-team__leader-section">
            {isMobile ? (
              <Swiper
                slidesPerView={1}
                spaceBetween={20}
                centeredSlides={true}
                loop={true}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                }}
                modules={[Autoplay, Pagination]}
                className="pgm-team__leader-swiper"
              >
                {leaderMembers.map((member) => (
                  <SwiperSlide key={member.id}>
                    <TeamMemberCard member={member} isLeader={true} />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="pgm-team__leader-grid">
                {leaderMembers.map((member) => (
                  <TeamMemberCard key={member.id} member={member} isLeader={true} />
                ))}
              </div>
            )}
          </div>
        )}
        
        {momiMembers.length > 0 && (
          <div className="pgm-team__momi-section">
            {isMobile ? (
              <Swiper
                slidesPerView={1}
                spaceBetween={20}
                centeredSlides={true}
                loop={true}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                }}
                modules={[Autoplay, Pagination]}
                className="pgm-team__momi-swiper"
              >
                {momiMembers.map((member) => (
                  <SwiperSlide key={member.id}>
                    <TeamMemberCard member={member} isMomi={true} />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="pgm-team__momi-grid">
                {momiMembers.map((member) => (
                  <TeamMemberCard key={member.id} member={member} isMomi={true} />
                ))}
              </div>
            )}
          </div>
        )}
        
        {otherMembers.length > 0 && (
          <div className="pgm-team__regular-section">
            {isMobile ? (
              <Swiper
                slidesPerView={1.5}
                spaceBetween={20}
                centeredSlides={true}
                loop={true}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                }}
                modules={[Autoplay, Pagination]}
                className="pgm-team__swiper"
              >
                {otherMembers.map((member) => (
                  <SwiperSlide key={member.id}>
                    <TeamMemberCard member={member} />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="pgm-team__grid">
                {otherMembers.map((member) => (
                  <TeamMemberCard key={member.id} member={member} />
                ))}
              </div>
            )}
          </div>
        )}

        {allFilteredAndSortedMembers.length === 0 && (
          <div className="pgm-team__empty">
            <p>No team members found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Team;
