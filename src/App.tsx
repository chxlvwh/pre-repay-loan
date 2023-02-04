import React from 'react';
import './App.css';
import { router } from './router';
import { RouterProvider } from 'react-router-dom';
import { StoreProvider } from './reducer';

function App() {
	return (
		<StoreProvider>
			<div className="App">
				<div className="wrapper">
					<RouterProvider router={router} />
				</div>
			</div>
		</StoreProvider>
	);
}

export default App;
