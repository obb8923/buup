import React from 'react';
import BG from '../src/components/BG';
import ModeBubble from './ModeBubble';
import ModeBlock from './ModeBlock';
import useModeStore from '../src/stores/useModeStore';
const App = () => {
  const { mode } = useModeStore();

  return (
    <BG>
      {mode === 'bubble' ? <ModeBubble /> : <ModeBlock />}      
    </BG>
  );
};

export default App;


