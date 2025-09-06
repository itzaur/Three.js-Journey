import React from 'react';

export const metadata = {
  title: 'R3F Урок 2 - Геометрия',
  description: 'Второй урок по React Three Fiber',
};

export default function R3FLesson02() {
  return (
    <div>
      <h3>R3F Урок 2</h3>
      <p>Работа с геометрией в R3F</p>
      <div
        style={{
          width: '100%',
          height: '300px',
          backgroundColor: '#f0f8ff',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '8px',
          border: '2px dashed #add8e6',
        }}
      >
        <span style={{ color: '#4682b4' }}>Геометрическая сцена</span>
      </div>
    </div>
  );
}
