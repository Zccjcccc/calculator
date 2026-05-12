import React, { useCallback } from 'react';
import { useCalculator } from './hooks/useCalculator';
import Display from './components/Display';
import Keypad from './components/Keypad';
import './App.css';

const App: React.FC = () => {
  const {
    displayExpr,
    result,
    mode,
    angleUnit,
    error,
    append,
    clear,
    backspace,
    calculate,
    toggleSign,
    setMode,
    setAngleUnit,
  } = useCalculator();

  const handleDigit = useCallback((d: string) => append(d), [append]);
  const handleOperator = useCallback((op: string) => append(op), [append]);

  const handleFunction = useCallback((fn: string) => {
    append(fn);
  }, [append]);

  const handlePercent = useCallback(() => {
    append('/100');
  }, [append]);

  const handleToggleAngle = useCallback(() => {
    setAngleUnit(prev => prev === 'DEG' ? 'RAD' : 'DEG');
  }, [setAngleUnit]);

  return (
    <div className="app">
      <div className="calculator">
        <div className="mode-switch">
          <button
            className={`mode-btn${mode === 'basic' ? ' active' : ''}`}
            onClick={() => setMode('basic')}
          >
            Basic
          </button>
          <button
            className={`mode-btn${mode === 'scientific' ? ' active' : ''}`}
            onClick={() => setMode('scientific')}
          >
            Scientific
          </button>
        </div>
        <Display expression={displayExpr} result={result} error={error} />
        <Keypad
          mode={mode}
          angleUnit={angleUnit}
          onDigit={handleDigit}
          onOperator={handleOperator}
          onFunction={handleFunction}
          onCalculate={calculate}
          onClear={clear}
          onBackspace={backspace}
          onToggleSign={toggleSign}
          onPercent={handlePercent}
          onToggleAngle={handleToggleAngle}
        />
      </div>
    </div>
  );
};

export default App;
