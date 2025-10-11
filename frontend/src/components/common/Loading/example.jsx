import React, { useState } from 'react';
import Loading from './index';

const LoadingExample = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Example of how to use the Loading component
  return (
    <div style={{ padding: '20px' }}>
      <h2>Loading Component Examples</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Small Loading</h3>
        <Loading size="small" text="Loading..." />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Medium Loading (Default)</h3>
        <Loading />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Large Loading</h3>
        <Loading size="large" text="Please wait..." />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Custom Text</h3>
        <Loading text="Fetching data..." />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>No Text</h3>
        <Loading text="" />
      </div>

      <button 
        onClick={() => setIsLoading(!isLoading)}
        style={{ marginBottom: '20px' }}
      >
        Toggle Overlay Loading
      </button>

      {isLoading && (
        <Loading overlay text="Loading overlay..." />
      )}
    </div>
  );
};

export default LoadingExample;
