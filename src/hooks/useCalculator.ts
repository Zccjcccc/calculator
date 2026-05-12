import { useState, useCallback, useMemo } from 'react';
import { evaluate } from '../utils/evaluate';

export type Mode = 'basic' | 'scientific';
export type AngleUnit = 'DEG' | 'RAD';

export function useCalculator() {
  const [expr, setExpr] = useState('');
  const [lastResult, setLastResult] = useState<number | null>(null);
  const [mode, setMode] = useState<Mode>('scientific');
  const [angleUnit, setAngleUnit] = useState<AngleUnit>('DEG');
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    if (!expr.trim()) return null;
    try {
      const val = evaluate(expr, angleUnit);
      setError(null);
      if (isNaN(val) || !isFinite(val)) {
        setError('Error');
        return null;
      }
      return val;
    } catch {
      return null;
    }
  }, [expr, angleUnit]);

  const displayExpr = useMemo(() => {
    return expr
      .replace(/\*/g, '×')
      .replace(/\//g, '÷');
  }, [expr]);

  const append = useCallback((s: string) => {
    setError(null);
    setLastResult(null);
    setExpr(prev => prev + s);
  }, []);

  const clear = useCallback(() => {
    setExpr('');
    setLastResult(null);
    setError(null);
  }, []);

  const backspace = useCallback(() => {
    setError(null);
    setExpr(prev => {
      if (prev.length === 0) return prev;
      // Remove entire function name + trailing '(' if present
      const funcMatch = prev.match(/(sin|cos|tan|asin|acos|atan|log|ln|sqrt|cbrt|abs|exp|fact)\($/);
      if (funcMatch) {
        return prev.slice(0, -funcMatch[0].length);
      }
      return prev.slice(0, -1);
    });
  }, []);

  const calculate = useCallback(() => {
    if (!expr.trim()) return;
    try {
      const val = evaluate(expr, angleUnit);
      if (isNaN(val) || !isFinite(val)) {
        setError('Error');
        return;
      }
      setLastResult(val);
      setExpr(formatNumber(val));
      setError(null);
    } catch {
      setError('Error');
    }
  }, [expr, angleUnit]);

  const toggleSign = useCallback(() => {
    setExpr(prev => {
      if (!prev) return prev;
      if (prev.startsWith('-')) return prev.slice(1);
      return '-' + prev;
    });
  }, []);

  return {
    expr,
    displayExpr,
    result,
    lastResult,
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
  };
}

function formatNumber(n: number): string {
  if (Number.isInteger(n)) return n.toString();
  // Limit to 10 significant digits
  return parseFloat(n.toPrecision(10)).toString();
}
