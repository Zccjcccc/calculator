import React from 'react';
import Button from './Button';
import './Keypad.css';

interface Props {
  mode: 'basic' | 'scientific';
  angleUnit: 'DEG' | 'RAD';
  onDigit: (d: string) => void;
  onOperator: (op: string) => void;
  onFunction: (fn: string) => void;
  onCalculate: () => void;
  onClear: () => void;
  onBackspace: () => void;
  onToggleSign: () => void;
  onPercent: () => void;
  onToggleAngle: () => void;
}

const Keypad: React.FC<Props> = ({
  mode,
  angleUnit,
  onDigit,
  onOperator,
  onFunction,
  onCalculate,
  onClear,
  onBackspace,
  onToggleSign,
  onPercent,
  onToggleAngle,
}) => {
  return (
    <div className="keypad">
      {mode === 'scientific' && (
        <div className="keypad-scientific">
          <div className="keypad-row">
            <Button label={angleUnit} onClick={onToggleAngle} variant="action" />
            <Button label="(" onClick={() => onFunction('(')} variant="function" />
            <Button label=")" onClick={() => onFunction(')')} variant="function" />
            <Button label="%" onClick={onPercent} variant="function" />
            <Button label="C" onClick={onBackspace} variant="action" />
            <Button label="AC" onClick={onClear} variant="action" />
          </div>
          <div className="keypad-row">
            <Button label="sin" onClick={() => onFunction('sin(')} variant="function" />
            <Button label="cos" onClick={() => onFunction('cos(')} variant="function" />
            <Button label="tan" onClick={() => onFunction('tan(')} variant="function" />
            <Button label="log" onClick={() => onFunction('log(')} variant="function" />
            <Button label="ln" onClick={() => onFunction('ln(')} variant="function" />
          </div>
          <div className="keypad-row">
            <Button label="xʸ" onClick={() => onOperator('^')} variant="function" />
            <Button label="x²" onClick={() => onFunction('^(2)')} variant="function" />
            <Button label="√x" onClick={() => onFunction('sqrt(')} variant="function" />
            <Button label="∛x" onClick={() => onFunction('cbrt(')} variant="function" />
            <Button label="n!" onClick={() => onFunction('fact(')} variant="function" />
          </div>
          <div className="keypad-row">
            <Button label="π" onClick={() => onDigit('π')} variant="function" />
            <Button label="e" onClick={() => onDigit('e')} variant="function" />
            <Button label="exp" onClick={() => onFunction('exp(')} variant="function" />
            <Button label="10ˣ" onClick={() => onFunction('10^(')} variant="function" />
            <Button label="|x|" onClick={() => onFunction('abs(')} variant="function" />
          </div>
        </div>
      )}

      <div className="keypad-basic">
        <div className="keypad-row">
          {mode === 'basic' && <Button label="AC" onClick={onClear} variant="action" />}
          {mode === 'basic' && <Button label="C" onClick={onBackspace} variant="action" />}
          <Button label="+/-" onClick={onToggleSign} variant="function" />
          <Button label="÷" onClick={() => onOperator('/')} variant="operator" />
        </div>
        <div className="keypad-row">
          <Button label="7" onClick={() => onDigit('7')} variant="number" />
          <Button label="8" onClick={() => onDigit('8')} variant="number" />
          <Button label="9" onClick={() => onDigit('9')} variant="number" />
          <Button label="×" onClick={() => onOperator('*')} variant="operator" />
        </div>
        <div className="keypad-row">
          <Button label="4" onClick={() => onDigit('4')} variant="number" />
          <Button label="5" onClick={() => onDigit('5')} variant="number" />
          <Button label="6" onClick={() => onDigit('6')} variant="number" />
          <Button label="−" onClick={() => onOperator('-')} variant="operator" />
        </div>
        <div className="keypad-row">
          <Button label="1" onClick={() => onDigit('1')} variant="number" />
          <Button label="2" onClick={() => onDigit('2')} variant="number" />
          <Button label="3" onClick={() => onDigit('3')} variant="number" />
          <Button label="+" onClick={() => onOperator('+')} variant="operator" />
        </div>
        <div className="keypad-row">
          <Button label="0" onClick={() => onDigit('0')} variant="number" wide />
          <Button label="." onClick={() => onDigit('.')} variant="number" />
          <Button label="=" onClick={onCalculate} variant="equals" />
        </div>
      </div>
    </div>
  );
};

export default Keypad;
