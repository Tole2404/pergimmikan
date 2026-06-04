import './Skeleton.css';

/**
 * Reusable Skeleton block component
 * @param {string} className - Additional CSS classes
 * @param {object} style - Inline styles (width, height, etc.)
 * @param {string} variant - 'default' | 'circle' | 'rounded' | 'pill'
 */
export const Skeleton = ({ className = '', style = {}, variant = 'default' }) => {
  const variantClass = variant !== 'default' ? `skeleton--${variant}` : '';
  return <div className={`skeleton ${variantClass} ${className}`} style={style} />;
};

/**
 * Journey page skeleton
 */
export const JourneySkeleton = () => (
  <div className="skeleton-page">
    <div className="skeleton-page__header">
      <Skeleton className="skeleton-page__title" />
      <Skeleton className="skeleton-page__subtitle" />
    </div>

    <div className="skeleton-journey__timeline">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="skeleton-journey__year-card" />
      ))}
    </div>

    <div className="skeleton-journey__content">
      <div>
        <Skeleton className="skeleton-journey__photo-area" />
        <div className="skeleton-journey__thumbnails">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="skeleton-journey__thumb" />
          ))}
        </div>
      </div>

      <div className="skeleton-journey__info">
        <Skeleton className="skeleton-journey__info-title" />
        <Skeleton className="skeleton-journey__info-text" />
        <Skeleton className="skeleton-journey__info-text" />
        <Skeleton className="skeleton-journey__info-text--short skeleton-journey__info-text" />
        <Skeleton className="skeleton-journey__info-text--shorter skeleton-journey__info-text" />
        <div className="skeleton-journey__stats">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="skeleton-journey__stat" />
          ))}
        </div>
        <Skeleton className="skeleton-journey__btn" />
      </div>
    </div>
  </div>
);

/**
 * Team page skeleton
 */
export const TeamSkeleton = () => (
  <div className="skeleton-page">
    <div className="skeleton-page__header">
      <Skeleton className="skeleton-page__title" />
      <Skeleton className="skeleton-page__subtitle" />
    </div>

    <div className="skeleton-team__controls">
      <Skeleton className="skeleton-team__search" />
      <Skeleton className="skeleton-team__filter" />
      <Skeleton className="skeleton-team__filter" />
    </div>

    <div className="skeleton-team__grid">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="skeleton-team__card">
          <Skeleton className="skeleton-team__card-strap" />
          <Skeleton className="skeleton-team__avatar" variant="circle" />
          <Skeleton className="skeleton-team__name" />
          <Skeleton className="skeleton-team__role" />
          <div className="skeleton-team__socials">
            {[...Array(3)].map((_, j) => (
              <Skeleton key={j} className="skeleton-team__social-icon" variant="circle" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/**
 * Activities page skeleton
 */
export const ActivitiesSkeleton = () => (
  <div className="skeleton-page">
    <div className="skeleton-page__header">
      <Skeleton className="skeleton-page__title" />
      <Skeleton className="skeleton-page__subtitle" />
    </div>

    <div className="skeleton-activities__wrapper">
      <div className="skeleton-activities__filters">
        <Skeleton className="skeleton-activities__filter-title" />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="skeleton-activities__filter-btn" />
        ))}
        <Skeleton className="skeleton-activities__filter-title" style={{ marginTop: '12px' }} />
        <Skeleton className="skeleton-activities__filter-btn" />
        <Skeleton className="skeleton-activities__filter-title" style={{ marginTop: '12px' }} />
        <Skeleton className="skeleton-activities__filter-btn" />
      </div>

      <div className="skeleton-activities__list">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="skeleton-activities__item">
            <Skeleton className="skeleton-activities__item-image" />
            <div className="skeleton-activities__item-content">
              <Skeleton className="skeleton-activities__item-title" />
              <div className="skeleton-activities__item-meta">
                <Skeleton className="skeleton-activities__item-meta-item" />
                <Skeleton className="skeleton-activities__item-meta-item" />
                <Skeleton className="skeleton-activities__item-meta-item" />
              </div>
              <Skeleton className="skeleton-activities__item-text" />
              <Skeleton className="skeleton-activities__item-text" />
              <Skeleton className="skeleton-activities__item-text--short skeleton-activities__item-text" />
              <Skeleton className="skeleton-activities__item-btn" variant="pill" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/**
 * Map page skeleton
 */
export const MapSkeleton = () => (
  <div className="skeleton-page">
    <div className="skeleton-page__header">
      <Skeleton className="skeleton-page__title" />
      <Skeleton className="skeleton-page__subtitle" />
    </div>

    <div className="skeleton-map__stats">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="skeleton-map__stat" />
      ))}
    </div>

    <Skeleton className="skeleton-map__area" />

    <div className="skeleton-map__legend">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="skeleton-map__legend-item" variant="pill" />
      ))}
    </div>
  </div>
);

export default Skeleton;
