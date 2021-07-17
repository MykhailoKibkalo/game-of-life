import './App.scss';
import {useCallback, useRef, useState} from "react";
import produce from "immer";

const numRows = 30;
const numCols = 70;

const operations = [
    [0, 1],
    [0, -1],
    [1, 0],
    [1, 1],
    [1, -1],
    [-1, 0],
    [-1, 1],
    [-1, -1]
]

const generateEmptyGrid = () => {
    const rows = []
    for (let i = 0; i < numRows; i++) {
        rows.push(Array.from(Array(numCols), () => 0))
    }

    return rows
}

function App() {

    const [grid, setGrid] = useState(() => {
        return generateEmptyGrid()
    })

    const [running, setRunning] = useState(false);

    const runningRef = useRef(running);
    runningRef.current = running;

    const runSimulation = useCallback(() => {
        if (!runningRef.current) {
            return;
        }

        setGrid((g) => {
            return produce(g, gridCopy => {
                for (let i = 0; i < numRows; i++) {
                    for (let k = 0; k < numCols; k++) {
                        let neighbors = 0;
                        operations.forEach(([x, y]) => {
                            const newI = i + x;
                            const newK = k + y;
                            if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                                neighbors += g[newI][newK]
                            }
                        });

                        if (neighbors < 2 || neighbors > 3) {
                            gridCopy[i][k] = 0
                        } else if (g[i][k] === 0 && neighbors === 3) {
                            gridCopy[i][k] = 1
                        }
                    }
                }
            })
        })
        setTimeout(runSimulation, 100)
    }, [])
    return (
        <>
            <div className='control-panel'>

                <button
                    className={ running ? 'btn__stop' : 'btn__start'}
                    onClick={() => {
                        setRunning(!running);
                        if (!running) {
                            runningRef.current = true;
                            runSimulation();
                        }
                    }}
                >
                    {running ? 'stop' : 'start'}
                </button>

                <button
                    className='btn'
                    onClick={() => {
                        setGrid(generateEmptyGrid())
                    }}
                >
                    clear
                </button>

                <button
                    className='btn'
                    onClick={() => {
                        const rows = []
                        for (let i = 0; i < numRows; i++) {
                            rows.push(Array.from(Array(numCols), () => Math.random() > .8 ? 1 : 0))
                        }

                        setGrid(rows)
                    }}
                >
                    random
                </button>

            </div>


            <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${numCols}, 20px)`
            }}
            >
                {grid.map((rows, i) =>
                    rows.map((cols, k) =>
                        <div
                            onClick={() => {
                                const newGrid = produce(grid, gridCopy => {
                                    gridCopy[i][k] = grid[i][k] ? 0 : 1
                                })
                                setGrid(newGrid);
                            }}
                            key={`${i}=${k}`}
                            style={{
                                width: 20,
                                height: 20,
                                backgroundColor: grid[i][k] ? 'pink' : undefined,
                                border: 'solid 1px rgba(0, 0, 0, 0.1)',
                                borderRadius: '10px',
                            }}
                        />
                    ))}
            </div>
        </>
    )
}

export default App;
