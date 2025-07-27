import React from 'react';

function SimpleApp() {
  return (
    <div style={{ padding: '20px', backgroundColor: 'lightblue', color: 'black' }}>
      <h1>CorruptGuard - Testing</h1>
      <p>If you can see this, React is working!</p>
      <button onClick={() => alert('Button works!')}>
        Test Button
      </button>
    </div>
  );
}

export default SimpleApp;