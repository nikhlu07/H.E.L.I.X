import React from 'react';

export function SimpleTest() {
  return (
    <div style={{ padding: '20px', backgroundColor: 'lightblue', color: 'black' }}>
      <h1>CorruptGuard Test</h1>
      <p>If you can see this, React is working!</p>
      <button onClick={() => alert('Button works!')}>
        Test Button
      </button>
    </div>
  );
}