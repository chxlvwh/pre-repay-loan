import React from 'react';
import HeaderDesc from './HeaderDesc';
import { Typography } from 'antd';

const HeaderPage = () => (
	<>
		<Typography.Title level={2}>房贷提前还款计算器</Typography.Title>
		<HeaderDesc />
	</>
);

export default HeaderPage;
