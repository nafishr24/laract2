import Fraction from 'fraction.js';
import React, { useEffect, useState } from 'react';

type Coefficient = {
    value: number | null;
    display: string;
};

type Equation = {
    coefficients: Coefficient[];
    constant: Coefficient;
};

export default function SPL() {
    const [variableCount, setVariableCount] = useState<number>(0);
    const [equationCount, setEquationCount] = useState<number>(0);
    const [showInputForm, setShowInputForm] = useState<boolean>(false);
    const [equations, setEquations] = useState<Equation[]>([]);
    const [solutions, setSolutions] = useState<number[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [resetKey, setResetKey] = useState<number>(0);

    // Initialize equations when counts are set
    useEffect(() => {
        if (variableCount > 0 && equationCount > 0) {
            const newEquations: Equation[] = [];
            for (let i = 0; i < equationCount; i++) {
                newEquations.push({
                    coefficients: Array(variableCount)
                        .fill(null)
                        .map(() => ({
                            value: null,
                            display: '',
                        })),
                    constant: {
                        value: null,
                        display: '',
                    },
                });
            }
            setEquations(newEquations);
            setShowInputForm(true);
            setSolutions(null);
            setError(null);
        }
    }, [variableCount, equationCount]);

    const calculateInputWidth = (text: string) => {
        // Minimal 4ch, maksimal 25ch, default 8ch jika kosong
        return `${Math.max(4, Math.min(25, text.length > 0 ? text.length + 2 : 8))}ch`;
    };

    const handleCoefficientChange = (eqIndex: number, varIndex: number, value: string) => {
        const newEquations = [...equations];
        try {
            const numValue = value === '' ? null : new Fraction(value).valueOf();
            newEquations[eqIndex].coefficients[varIndex] = {
                value: numValue,
                display: value,
            };
        } catch {
            newEquations[eqIndex].coefficients[varIndex] = {
                value: null,
                display: value,
            };
        }
        setEquations(newEquations);
    };

    const handleConstantChange = (eqIndex: number, value: string) => {
        const newEquations = [...equations];
        try {
            const numValue = value === '' ? null : new Fraction(value).valueOf();
            newEquations[eqIndex].constant = {
                value: numValue,
                display: value,
            };
        } catch {
            newEquations[eqIndex].constant = {
                value: null,
                display: value,
            };
        }
        setEquations(newEquations);
    };

    const solveSystem = () => {
        // Reset solutions and error before calculation
        setSolutions(null);
        setError(null);

        try {
            // Validate all inputs first
            for (const eq of equations) {
                for (const coeff of eq.coefficients) {
                    if (coeff.value === null && coeff.display !== '') {
                        throw new Error(`Koefisien tidak valid: ${coeff.display}`);
                    }
                }
                if (eq.constant.value === null && eq.constant.display !== '') {
                    throw new Error(`Konstanta tidak valid: ${eq.constant.display}`);
                }
            }

            const coefficients = equations.map((eq) => eq.coefficients.map((coeff) => (coeff.value === null ? 0 : coeff.value)));
            const constants = equations.map((eq) => (eq.constant.value === null ? 0 : eq.constant.value));

            const result = solveLinearSystem(coefficients, constants);
            setSolutions(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
        }
    };

    const resetSystem = () => {
        setVariableCount(0);
        setEquationCount(0);
        setShowInputForm(false);
        setEquations([]);
        setSolutions(null);
        setError(null);
        setResetKey((prev) => prev + 1);
    };

    const handleCountSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (variableCount < 1 || equationCount < 1) {
            setError('Jumlah variabel dan persamaan harus minimal 1');
            return;
        }
        setError(null);
    };

    return (
        <div key={resetKey} className="min-h-screen bg-sky-50 p-6">
            <div className="mx-auto max-w-4xl">
                <h1 className="mb-8 text-center text-3xl font-bold text-sky-800">Sistem Persamaan Linear</h1>

                {!showInputForm ? (
                    <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
                        <h2 className="mb-4 text-xl font-semibold text-gray-800">Masukkan Jumlah Variabel dan Persamaan</h2>
                        <form onSubmit={handleCountSubmit} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Jumlah Variabel:</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={variableCount || ''}
                                    onChange={(e) => setVariableCount(parseInt(e.target.value) || 0)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-center focus:ring-2 focus:ring-sky-500 focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Jumlah Persamaan:</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={equationCount || ''}
                                    onChange={(e) => setEquationCount(parseInt(e.target.value) || 0)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-center focus:ring-2 focus:ring-sky-500 focus:outline-none"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="cursor-pointer rounded-md bg-sky-600 px-4 py-2 text-white transition transition-colors hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none"
                            >
                                Buat Form Input
                            </button>
                            {error && <div className="rounded-md bg-red-50 p-3 text-red-600">{error}</div>}
                        </form>
                    </div>
                ) : (
                    <>
                        <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-800">Input Persamaan</h2>
                                <div className="text-sm text-gray-500">
                                    {variableCount} Variabel, {equationCount} Persamaan
                                </div>
                            </div>

                            {equations.map((equation, eqIndex) => (
                                <div key={`eq-${eqIndex}`} className="mb-4 flex flex-wrap items-center gap-2 rounded-lg bg-gray-50 p-4">
                                    <span className="mr-2 font-medium text-gray-700">Persamaan {eqIndex + 1}:</span>
                                    {equation.coefficients.map((coeff, varIndex) => (
                                        <React.Fragment key={`eq-${eqIndex}-var-${varIndex}`}>
                                            {varIndex > 0 && <span className="mx-1 text-gray-700">+</span>}
                                            <input
                                                type="text"
                                                value={coeff.display}
                                                onChange={(e) => handleCoefficientChange(eqIndex, varIndex, e.target.value)}
                                                style={{ width: calculateInputWidth(coeff.display) }}
                                                className="rounded border border-gray-300 px-2 py-1 text-center transition-all duration-200 focus:ring-1 focus:ring-sky-500 focus:outline-none"
                                                placeholder="0"
                                                pattern="-?\d+/\d+|[-+]?\d*\.?\d+"
                                                title="Masukkan angka (contoh: 0.5 atau 1/2)"
                                            />
                                            <span className="text-gray-700">
                                                x<sub>{varIndex + 1}</sub>
                                            </span>
                                        </React.Fragment>
                                    ))}
                                    <span className="mx-1 text-gray-700">=</span>
                                    <input
                                        type="text"
                                        value={equation.constant.display}
                                        onChange={(e) => handleConstantChange(eqIndex, e.target.value)}
                                        style={{ width: calculateInputWidth(equation.constant.display) }}
                                        className="rounded border border-gray-300 px-2 py-1 text-center transition-all duration-200 focus:ring-1 focus:ring-sky-500 focus:outline-none"
                                        placeholder="0"
                                        pattern="-?\d+/\d+|[-+]?\d*\.?\d+"
                                        title="Masukkan angka (contoh: 0.5 atau 1/2)"
                                    />
                                </div>
                            ))}

                            <div className="mt-6 flex flex-wrap gap-4">
                                <button
                                    onClick={solveSystem}
                                    className="cursor-pointer rounded-md bg-sky-600 px-4 py-2 text-white transition transition-colors hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none"
                                >
                                    Selesaikan Persamaan
                                </button>
                                <button
                                    onClick={resetSystem}
                                    className="cursor-pointer rounded-md bg-gray-200 px-4 py-2 text-gray-800 transition transition-colors hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
                                >
                                    Reset Semua
                                </button>
                            </div>
                        </div>

                        {(solutions || error) && (
                            <div className="rounded-xl bg-white p-6 shadow-md">
                                <h2 className="mb-4 text-xl font-semibold text-gray-800">Hasil Penyelesaian</h2>
                                {error ? (
                                    <div className="rounded-lg bg-red-50 p-4 text-red-600">
                                        <strong>Error:</strong> {error}
                                        <div className="mt-1 text-sm">Pastikan semua input valid (angka desimal atau pecahan)</div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {solutions?.map((solution, index) => (
                                            <div key={`sol-${index}`} className="flex items-center rounded-lg bg-sky-50 p-3">
                                                <span className="mr-2 text-gray-700">
                                                    x<sub>{index + 1}</sub> =
                                                </span>
                                                <span className="font-mono text-sky-800">{displayResult(solution)}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function solveLinearSystem(coefficients: number[][], constants: number[]): number[] {
    const n = coefficients.length;
    const m = coefficients[0].length;

    // Create augmented matrix
    const matrix = coefficients.map((row, i) => [...row, constants[i]]);

    // Forward elimination
    for (let col = 0, row = 0; col < m && row < n; col++) {
        // Find pivot with maximum absolute value
        let maxRow = row;
        for (let i = row + 1; i < n; i++) {
            if (Math.abs(matrix[i][col]) > Math.abs(matrix[maxRow][col])) {
                maxRow = i;
            }
        }

        // Swap rows if needed
        if (maxRow !== row) {
            [matrix[row], matrix[maxRow]] = [matrix[maxRow], matrix[row]];
        }

        // Skip if pivot is zero (or very close to zero)
        if (Math.abs(matrix[row][col]) < 1e-10) {
            continue;
        }

        // Eliminate this column in other rows
        for (let i = 0; i < n; i++) {
            if (i !== row) {
                const factor = matrix[i][col] / matrix[row][col];
                for (let j = col; j <= m; j++) {
                    matrix[i][j] -= factor * matrix[row][j];
                }
            }
        }
        row++;
    }

    // Back substitution
    const solutions = new Array(m).fill(0);
    for (let i = 0; i < n; i++) {
        let pivotCol = -1;
        for (let j = 0; j < m; j++) {
            if (Math.abs(matrix[i][j]) > 1e-10) {
                pivotCol = j;
                break;
            }
        }

        if (pivotCol === -1) {
            if (Math.abs(matrix[i][m]) > 1e-10) {
                throw new Error('Sistem persamaan tidak konsisten (tidak ada solusi)');
            }
            continue;
        }

        solutions[pivotCol] = matrix[i][m] / matrix[i][pivotCol];
    }

    // Check for free variables
    for (let j = 0; j < m; j++) {
        if (Math.abs(solutions[j]) < 1e-10) {
            let allZero = true;
            for (let i = 0; i < n; i++) {
                if (Math.abs(matrix[i][j]) > 1e-10) {
                    allZero = false;
                    break;
                }
            }
            if (allZero) {
                throw new Error('Sistem memiliki solusi tak terhingga (variabel bebas)');
            }
        }
    }

    return solutions;
}

const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const displayResult = (value: number): string => {
    // Bulatkan angka yang hampir integer
    if (Math.abs(value - Math.round(value)) < 1e-10) {
        return formatNumber(Math.round(value));
    }

    const frac = new Fraction(value);
    const simplified = frac.simplify();

    if (simplified.d === 1) {
        return formatNumber(simplified.n);
    }

    return `${formatNumber(simplified.n)}/${formatNumber(simplified.d)}`;
};
