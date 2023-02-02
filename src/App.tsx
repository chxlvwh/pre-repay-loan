import React from 'react';
import './App.css';
import HeaderPage from './components/header/HeaderPage';
import SearchForm from './components/searchForm/SearchForm';

function App() {
	return (
		<div className="App">
			<div className="wrapper">
				<HeaderPage />
				<SearchForm />
			</div>
		</div>
	);
}

export default App;
