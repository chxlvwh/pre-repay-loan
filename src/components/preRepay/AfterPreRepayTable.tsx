import React from 'react';
import { Table, Typography } from 'antd';
import {
	getBeforePreRepayTableColumns,
	getPreRepayTableData,
} from '../../contants';
import { IFormProps } from '../searchForm/SearchForm';

const AfterPreRepayTable = ({
	formValues,
	index,
}: {
	formValues: IFormProps;
	index: number;
}) => {
	return (
		<>
			<Typography.Title level={4}>
				第 {index + 1} 次提前还款后
			</Typography.Title>
			<Table
				bordered={true}
				size={'small'}
				showHeader={false}
				columns={getBeforePreRepayTableColumns()}
				dataSource={getPreRepayTableData(formValues, index).after}
				pagination={false}
			/>
		</>
	);
};

export default AfterPreRepayTable;
