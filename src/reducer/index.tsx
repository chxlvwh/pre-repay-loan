import { ILoanDetailElement } from '../contants';
import React, {
	createContext,
	Dispatch,
	ReactNode,
	useContext,
	useReducer,
} from 'react';

type dispatchType = { type: string; payload: any };
export const reducer = (state: IStateProps, action: dispatchType) => {
	switch (action.type) {
		case 'toggle_button':
			console.log('======[index.tsx：reducer：]======', action.payload);
			return {
				...state,
			};

		default:
			return state;
	}
};

export interface IStateProps {
	detailList?: ILoanDetailElement[][];
}

export const initialState: IStateProps = {
	detailList: [],
};

const Context = createContext<{
	state: IStateProps;
	dispatch: Dispatch<dispatchType>;
}>({ state: initialState, dispatch: () => ({}) });

export const useStore = () => useContext(Context);

export const StoreProvider = ({
	children,
}: {
	children: ReactNode | undefined;
}) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<Context.Provider value={{ state, dispatch }}>
			{children}
		</Context.Provider>
	);
};
