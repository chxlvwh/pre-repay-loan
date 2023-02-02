import React from 'react';
import { Table, Typography } from 'antd';
import {
	DateFormat,
	getBeforePreRepayTableColumns,
	getPreRepayTableData,
} from '../../contants';
import { IFormProps } from '../searchForm/SearchForm';

const PreRepayTable = ({
	formValues,
	index,
}: {
	formValues: IFormProps;
	index: number;
}) => {
	return (
		<>
			<Typography.Title level={4}>
				第 {index + 1} 次提前还款（
				{formValues.preRepayList[index].prepayDate &&
					formValues.preRepayList[index].prepayDate.format(
						DateFormat.YM,
					)}
				）
			</Typography.Title>
			<Table
				bordered={true}
				size={'small'}
				showHeader={false}
				columns={getBeforePreRepayTableColumns()}
				dataSource={getPreRepayTableData(formValues, index).before}
				pagination={false}
			/>
		</>
	);
};

export default PreRepayTable;
