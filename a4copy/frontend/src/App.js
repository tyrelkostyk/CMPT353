import { useState } from 'react';
import './App.css';

function App() {
	const [count, setCount] = useState(0);

	function handleClick() {
		const newCount = count + 1;
		setCount(newCount);
	}

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Your very own react App!
        </p>
		<button onClick={handleClick}>
			{count}
		</button>
      </header>
    </div>
  );
}

export default App;
