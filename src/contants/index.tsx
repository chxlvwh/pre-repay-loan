import React from 'react';
import { IFormProps } from '../components/searchForm/SearchForm';
import { calMonthAmount, calMonthObj, calTerm } from '../utils/utils';
import currency from 'currency.js';
import dayjs from 'dayjs';

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
export const getBeforePreRepayTableColumns = () => {
	return [
		{
			title: 'name',
			dataIndex: 'name',
			className: 'table-col-sty',
			width: '50%',
			onCell(record: any) {
				console.log('======[index.tsx：onCell：]======', record);
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
type element = { before: number; after: number };
let monthAmountGlobal = 0;
const restInterestList: element[] = [];
const restSeedList: element[] = [];

export const getBeforePreRepayTableData = (formValue: IFormProps) => {
	const seed = formValue.loanAmount;
	const term = formValue.loanYearTerm
		? formValue.loanYearTerm * 12
		: formValue.loanMonthTerm;
	const loanType = Reflect.get(loanTypesMapping, formValue.loanType || 0);
	const monthAmount = calMonthAmount(seed, formValue.rates || 0, term);
	const allInterestAndSeed = monthAmount * term;
	const allInterest = allInterestAndSeed - seed;
	restInterestList.push({ before: allInterest, after: allInterest });
	restSeedList.push({ before: seed, after: seed });
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
	);
	const restSeedAfter: number =
		restSeedBefore - formValue.preRepayList[index].prepayAmount;
	restSeedList[index + 1] = { before: restSeedBefore, after: restSeedAfter };
	restInterestList[index + 1] = {
		before: lastInterest - repaidInterest,
		after: 0,
	};
	console.log('======[index.tsx：restSeedList：]======', restSeedList);
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
	console.log('======[index.tsx：restSeedBefore：]======', restSeedBefore);
	// 还款之后剩余本金 (=贷款金额)
	const restSeedAfter: number =
		restSeedBefore - formValue.preRepayList[index].prepayAmount;
	console.log('======[index.tsx：restSeedAfter：]======', restSeedBefore);
	restSeedList[index + 1].after = restSeedAfter;
	const term = calTerm(restSeedAfter, formValue.rates, monthAmountGlobal);
	const allInterestAndSeed = monthAmountGlobal * term;
	const allInterest = allInterestAndSeed - restSeedAfter;
	restInterestList[index + 1].after = allInterest;
	return [
		{
			key: '1',
			name: '贷款金额',
			value: `${currency(restSeedAfter)} 元`,
		},
		{
			key: '2',
			name: '贷款期限',
			value: `${Math.ceil(term).toFixed(0)} 月`,
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
			value: `${currency(monthAmountGlobal)} 元`,
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
