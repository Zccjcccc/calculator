import React from 'react';
import './Display.css';

interface Props {
  expression: string;
  result: number | null;
  error: string | null;
}

const Display: React.FC<Props> = ({ expression, result, error }) => {
  return (
    <div className="display">
      <div className="display-expr">{expression || ' '}</div>
      {error ? (
        <div className="display-result error">{error}</div>
      ) : result !== null ? (
        <div className="display-result">{formatResult(result)}</div>
      ) : null}
    </div>
  );
};

function formatResult(n: number): string {
  if (!isFinite(n)) return 'Error';
  if (Number.isInteger(n)) return n.toLocaleString();
  // Show up to 10 significant digits
  const s = parseFloat(n.toPrecision(10)).toString();
  // For very large or very small numbers, use exponential notation
  if (Math.abs(n) >= 1e15 || (Math.abs(n) < 1e-10 && n !== 0)) {
    return n.toExponential(6);
  }
  return s;
}

export default Display;
