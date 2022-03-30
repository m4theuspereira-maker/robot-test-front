import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);
  const [robotDirection, setRobotDirection] = useState("");
  const [robotPosition, setRobotPosition] = useState("");
  const directions = {
    NORTH: "NORTH",
    SOUTH: "SOUTH",
    EAST: "EAST",
    WEST: "WEST",
  };

  const matrix = (() => {
    let matrix = {};
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        matrix[`${i}_${j}`] = false;
      }
    }
    return matrix;
  })();

  async function startGame() {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/table/place-robot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ direction: directions.EAST, tablePosition: [0, 0] }),
      });
      const data = await response.json();

      setRobotPosition(`${data.position[0]}_${data.position[1]}`);
      setRobotDirection(data.initialDirection);
      setLoading(false);
    } catch (e) {
      window.alert('Ops, an unexpected error occurred. Please try again later!')
    }
  }

  async function handleTurnRight() {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/table/turn-right`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ direction: robotDirection }),
      });
      const data = await response.json();
      setRobotDirection(data.robotTurned);
    } catch (e) {
      window.alert('Ops, an unexpected error occurred. Please try again later!')
    }
  }

  async function handleTurnLeft() {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/table/turn-left`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          direction: robotDirection,
        }),
      });
      const data = await response.json();
      setRobotDirection(data.robotTurned);
    } catch (e) {
      window.alert('Ops, an unexpected error occurred. Please try again later!')
    }
  }

  async function handleMove() {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/table/move-robot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          direction: robotDirection,
          position: [Number(robotPosition[0]), Number(robotPosition[2])],
        }),
      });
      const data = await response.json();
      setRobotPosition(`${data.robotMoved[0]}_${data.robotMoved[1]}`);
    } catch (e) {
      window.alert("Invalid position. Try moving to another side!");
    }
  }

  useEffect(() => {
    startGame();
  }, []);

  if (loading) return null;
  return (
    <div className="App">
      <div className="grid">
        {Object.keys(matrix).map((matrix, index) => (
          <div className="item" key={`item-${index}`}>
            {matrix === robotPosition && (
              <div className={`robot robot-direction-${robotDirection}`} />
            )}
          </div>
        ))}
      </div>

      <div className="buttons-container">
        <button className="button" onClick={handleTurnLeft}>
          TURN LEFT
        </button>
        <button className="button" onClick={handleMove}>
          MOVE
        </button>
        <button className="button" onClick={handleTurnRight}>
          TURN RIGHT
        </button>
      </div>
    </div>
  );
}
export default App;
