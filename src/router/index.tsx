import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import LoanDetail from '../components/LoanDetail/LoanDetail';
import SearchForm from '../components/SearchForm/SearchForm';

export const router = createBrowserRouter([
	{
		path: '/',
		element: (
			<>
				<SearchForm />
			</>
		),
	},
	{
		path: '/detail',
		element: (
			<>
				<LoanDetail />
			</>
		),
	},
]);
