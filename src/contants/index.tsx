import React from 'react';
import { IFormProps } from '../components/SearchForm/SearchForm';
import {
	calMonthAmount,
	calMonthObj,
	calTerm,
	formatValue,
} from '../utils/utils';
import currency from 'currency.js';
import dayjs from 'dayjs';
import { Table } from 'antd';
export type element = { before: number; after: number };
export interface ILoanDetailElement {
	key?: string | number;
	term: number;
	date: dayjs.Dayjs | string;
	amount: number;
	interest: number;
	seed: number;
	restSeed: number;
}

export const DateFormat = {
	YM: 'YYYY-MM',
	YMD: 'YYYY-MM-DD',
};
export const loanTermOptions = Array.from(new Array(31).keys()).map((it) => {
	if (it === 0) {
		return {
			key: it,
			label: `自定义贷款期限`,
			value: it,
		};
	}
	return {
		key: it,
		label: `${it}年(${it * 12}月)`,
		value: it,
	};
});

export const loanTypesMapping = {
	0: '等额本息',
	1: '等额本金',
};

export const loanTypes = [
	{
		key: 0,
		label: `等额本息`,
		value: 0,
	},
	{
		key: 1,
		label: `等额本金`,
		value: 1,
	},
];

export const repayPlans = [
	{
		key: 0,
		label: `月供基本不变`,
		value: 0,
	},
	{
		key: 1,
		label: `还款期限不变`,
		value: 1,
	},
	{
		key: 2,
		label: `调整还款期限`,
		value: 2,
	},
	{
		key: 3,
		label: `调整月供金额`,
		value: 3,
	},
];

// ts-ignore
export const getLoanDetailTableColumns = () => {
	return [
		{
			title: '期次',
			dataIndex: 'term',
		},
		{
			title: '还款日期',
			dataIndex: 'date',
		},
		{
			title: '每月还款',
			dataIndex: 'amount',
		},
		{
			title: '偿还利息',
			dataIndex: 'interest',
		},
		{
			title: '偿还本金',
			dataIndex: 'seed',
		},
		{
			title: '剩余本金',
			dataIndex: 'restSeed',
		},
	];
};
export const getLoanDetailTableData = (): ILoanDetailElement[] => {
	const list = JSON.parse(localStorage.getItem('loan_detail_List') || '[]');
	return list.map(
		(it: ILoanDetailElement[], index: number): ILoanDetailElement[] => {
			let prevLength = 0;
			if (Array.isArray(list[index - 1])) {
				for (let i = 0; i < index; i++) {
					prevLength += list[i].length;
				}
			}
			if (Array.isArray(it)) {
				return it.map((item, i: number): ILoanDetailElement => {
					return {
						key: `${item.term}-${i}`,
						term: item.term + 1 + prevLength,
						date: dayjs(firstRepayDate)
							.add(i + prevLength, 'month')
							.format(DateFormat.YM),
						amount: currency(item.amount).value,
						interest: currency(item.interest).value,
						seed: currency(item.seed).value,
						restSeed: currency(item.restSeed).value,
					};
				});
			}
			return it;
		},
	);
};

type preRepayInfo = {
	repayAmount: number;
	restAmount: number;
};
export const getPreRepayInfo = (): preRepayInfo[] => {
	const restSeedList: element[] = JSON.parse(
		localStorage.getItem('rest_seed_list') || '[]',
	);
	const result: preRepayInfo[] = [];
	restSeedList.forEach((item, index) => {
		if (restSeedList[index + 1]) {
			const repayAmount = currency(
				restSeedList[index + 1].before - restSeedList[index + 1].after,
			).value;
			result.push({
				repayAmount,
				restAmount:
					currency(restSeedList[index + 1].before).value -
					repayAmount,
			});
		}
	});
	return result;
};

export const getBeforePreRepayTableColumns = () => {
	return [
		{
			title: 'name',
			dataIndex: 'name',
			className: 'table-col-sty',
			width: '50%',
			onCell(record: any) {
				if (record.name === '节省利息') {
					return {
						...record,
						className: 'danger',
					};
				}
			},
		},
		{
			title: 'value',
			dataIndex: 'value',
			width: '50%',
		},
	];
};
let monthAmountGlobal = 0;
const restInterestList: element[] = [];
const restSeedList: element[] = [];
const detailList: ILoanDetailElement[][] = [];
let originalSeed = 0;
let firstRepayDate: dayjs.Dayjs;

export const getBeforePreRepayTableData = (formValue: IFormProps) => {
	const seed = formValue.loanAmount;
	originalSeed = seed;
	firstRepayDate = formValue.firstRepayDate;
	const term = formValue.loanYearTerm
		? formValue.loanYearTerm * 12
		: formValue.loanMonthTerm;
	const loanType = Reflect.get(loanTypesMapping, formValue.loanType || 0);
	const monthAmount = calMonthAmount(seed, formValue.rates || 0, term);
	const allInterestAndSeed = monthAmount * term;
	const allInterest = allInterestAndSeed - seed;
	restInterestList[0] = { before: allInterest, after: allInterest };
	restSeedList[0] = { before: seed, after: seed };
	localStorage.setItem('rest_seed_list', JSON.stringify(restSeedList));
	monthAmountGlobal = monthAmount;
	return [
		{
			key: '1',
			name: '贷款总额',
			value: `${currency(seed)} 元`,
		},
		{
			key: '2',
			name: '还款月数',
			value: `${
				formValue.loanYearTerm
					? formValue.loanYearTerm * 12
					: formValue.loanMonthTerm
			} 月`,
		},
		{
			key: '3',
			name: '贷款利率',
			value: `${formValue.rates} %`,
		},
		{
			key: '4',
			name: '还款方式',
			value: loanType,
		},
		{
			key: '5',
			name: '每月还款',
			value: `${currency(monthAmount)} 元`,
		},
		{
			key: '6',
			name: '每月递减',
			value: `0.00 元`,
		},
		{
			key: '7',
			name: '利息总额',
			value: `${currency(allInterest)} 元`,
		},
		{
			key: '8',
			name: '本息合计',
			value: `${currency(allInterestAndSeed)} 元`,
		},
	];
};

export const getPreRepayTableData = (formValue: IFormProps, index: number) => {
	const lastInterest: number = restInterestList[index].after;
	const lastSeedAfter: number = restSeedList[index].after;
	const { restSeed: restSeedBefore, repaidInterest } = calMonthObj(
		lastSeedAfter,
		formValue.rates,
		monthAmountGlobal,
		index === 0
			? formValue.firstRepayDate
			: formValue.preRepayList[index - 1].prepayDate,
		formValue.preRepayList[index].prepayDate,
		index,
		detailList,
	);
	const restSeedAfter: number =
		restSeedBefore - formValue.preRepayList[index].prepayAmount;
	restSeedList[index + 1] = { before: restSeedBefore, after: restSeedAfter };
	localStorage.setItem('rest_seed_list', JSON.stringify(restSeedList));
	restInterestList[index + 1] = {
		before: lastInterest - repaidInterest,
		after: 0,
	};
	const after = getAfterPreRepayTableData(formValue, index);
	return {
		before: [
			{
				key: '1',
				name: '已还期次',
				value:
					dayjs(formValue.preRepayList[index].prepayDate).diff(
						formValue.firstRepayDate,
						'month',
					) + 1,
			},
			{
				key: '2',
				name: '已还利息',
				value: `${currency(repaidInterest)} 元`,
			},
			{
				key: '3',
				name: '剩余利息',
				value: `${currency(lastInterest - repaidInterest)} 元`,
			},
			{
				key: '4',
				name: '已还本金',
				value: `${currency(lastSeedAfter - restSeedBefore)} 元`,
			},
			{
				key: '5',
				name: '剩余本金',
				value: `${currency(restSeedBefore)} 元`,
			},
			{
				key: '6',
				name: '提前还款',
				value: `${currency(
					formValue.preRepayList[index].prepayAmount,
				)} 元`,
			},
			{
				key: '7',
				name: '节省利息',
				value: `${currency(
					restInterestList[index + 1].before -
						restInterestList[index + 1].after,
				)} 元`,
			},
		],
		after,
	};
};

export const getAfterPreRepayTableData = (
	formValue: IFormProps,
	index: number,
) => {
	const loanType = Reflect.get(loanTypesMapping, formValue.loanType || 0);
	// 还款之前剩余本金
	const restSeedBefore: number = restSeedList[index + 1].before;
	// 还款之后剩余本金 (=贷款金额)
	const restSeedAfter: number =
		restSeedBefore - formValue.preRepayList[index].prepayAmount;
	restSeedList[index + 1].after = restSeedAfter;
	localStorage.setItem('rest_seed_list', JSON.stringify(restSeedList));
	const term = Math.ceil(
		calTerm(restSeedAfter, formValue.rates, monthAmountGlobal),
	);
	const newMonthAmount = calMonthAmount(
		restSeedAfter,
		formValue.rates || 0,
		term,
	);
	const allInterestAndSeed = newMonthAmount * term;
	const allInterest = allInterestAndSeed - restSeedAfter;
	restInterestList[index + 1].after = allInterest;
	const firstMonth =
		index === 0
			? formValue.firstRepayDate
			: formValue.preRepayList[index].prepayDate;
	calMonthObj(
		restSeedAfter,
		formValue.rates,
		newMonthAmount,
		firstMonth,
		firstMonth.add(term, 'month'),
		index + 1,
		detailList,
	);
	return [
		{
			key: '1',
			name: '贷款金额',
			value: `${currency(restSeedAfter)} 元`,
		},
		{
			key: '2',
			name: '贷款期限',
			value: `${term} 月，最后还款日：${dayjs(
				formValue.preRepayList[index].prepayDate,
			)
				.add(term, 'month')
				.format(DateFormat.YM)}`,
		},
		{
			key: '3',
			name: '贷款利率',
			value: `${formValue.rates} %`,
		},
		{
			key: '4',
			name: '还款方式',
			value: loanType,
		},
		{
			key: '5',
			name: '首月还款',
			value: `${currency(newMonthAmount)} 元`,
		},
		{
			key: '6',
			name: '每月递减',
			value: `0.00 元`,
		},
		{
			key: '7',
			name: '利息总额',
			value: `${currency(allInterest)} 元`,
		},
	];
};
