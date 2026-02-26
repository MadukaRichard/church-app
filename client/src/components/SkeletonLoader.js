import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = ({ type = 'card', count = 3 }) => {
  if (type === 'card') {
    return (
      <>
        {[...Array(count)].map((_, i) => (
          <div key={i} className="skeleton-wrapper">
            <div className="skeleton skeleton-image"></div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text short"></div>
            <div className="skeleton skeleton-button"></div>
          </div>
        ))}
      </>
    );
  }

  if (type === 'hero') {
    return (
      <div className="skeleton-hero">
        <div className="skeleton skeleton-hero-image"></div>
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div className="skeleton-text-wrapper">
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text short"></div>
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;
