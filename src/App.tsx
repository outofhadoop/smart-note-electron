import React from 'react';
import HideToEdgeBox from './components/HideToEdgeBox';
import ClipboardList from './components/ClipboardList';

const App: React.FC = () => {
  return (
    <HideToEdgeBox>
      <ClipboardList />
    </HideToEdgeBox>
  );
};

export default App;