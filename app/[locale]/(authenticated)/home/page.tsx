import React from 'react';

export default function HomePage() {
  return (
    <div className='min-h-screen p-8'>
      <h1 className='text-3xl font-bold text-gray-900'>
        Bienvenido al Dashboard
      </h1>
      <p className='mt-4 text-gray-600'>
        Esta es tu página de inicio protegida.
      </p>
    </div>
  );
}
