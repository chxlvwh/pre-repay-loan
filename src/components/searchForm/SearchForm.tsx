import React, { useState } from 'react';
import {
	Button,
	Card,
	DatePicker,
	Divider,
	FloatButton,
	Form,
	Input,
	Select,
	Space,
	Tooltip,
} from 'antd';
import { loanTermOptions, loanTypes, repayPlans } from '../../contants';
import dayjs from 'dayjs';
import BeforePreRepayTable from '../preRepay/BeforePreRepayTable';
import PreRepayTable from '../preRepay/preRepayTable';
import AfterPreRepayTable from '../preRepay/AfterPreRepayTable';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

export interface IFormProps {
	loanAmount: number;
	loanYearTerm?: number;
	loanMonthTerm: number;
	loanType?: number;
	rates: number;
	firstRepayDate: dayjs.Dayjs;
	preRepayList: {
		prepayDate: dayjs.Dayjs;
		prepayType: number;
		prepayAmount: number;
		newRates?: number;
		newRepayType?: number;
		repayPlan?: number;
		newMonthlyAmount?: number;
	}[];
}
const SearchForm: React.FC = () => {
	const [form] = Form.useForm<IFormProps>();
	const initialValues: IFormProps = {
		loanAmount: 1190000,
		loanYearTerm: 0,
		loanMonthTerm: 360,
		loanType: 0,
		rates: 6.027,
		firstRepayDate: dayjs('2019-10'),
		preRepayList: [
			{
				prepayDate: dayjs('2023-03'),
				prepayType: 0,
				prepayAmount: 100000,
				newRates: 6.027,
				newRepayType: 0,
				repayPlan: 0,
				newMonthlyAmount: 7155.32,
			},
		],
	};
	const [formValues, setFormValues] = useState<IFormProps>(initialValues);
	const onCheck = async () => {
		try {
			const values = await form.validateFields();
			console.log('======[SearchForm.tsx：onCheck：]======', values);
			setFormValues(values);
		} catch (errorInfo) {
			console.log('Failed:', errorInfo);
		}
	};

	return (
		<>
			<Form
				form={form}
				className="search-form-wrapper"
				labelCol={{ span: 8 }}
				wrapperCol={{ span: 8 }}
				layout="horizontal"
				initialValues={initialValues}
			>
				<Form.Item label="贷款金额：" name="loanAmount">
					<Input suffix="元" />
				</Form.Item>
				<Form.Item label="贷款期限：" name="loanYearTerm">
					<Select options={loanTermOptions} />
				</Form.Item>
				<Form.Item label="贷款月数：" name="loanMonthTerm">
					<Input suffix="月" />
				</Form.Item>
				<Form.Item label="还款方式：" name="loanType">
					<Select options={loanTypes} />
				</Form.Item>
				<Form.Item label="贷款利率：" name="rates">
					<Input suffix="%" />
				</Form.Item>
				<Form.Item label="首次还款日期：" name="firstRepayDate">
					<DatePicker style={{ width: '400px' }} picker="month" />
				</Form.Item>
				<Form.List name="preRepayList">
					{(fields, { add, remove }) => (
						<>
							{fields.map((field, index) => (
								<Space
									key={field.key}
									align="baseline"
									style={{ textAlign: 'left' }}
								>
									<Card
										title={`第${index + 1}次还款计划`}
										size="small"
									>
										<Form.Item
											label="提前还款日期："
											name={[field.name, 'prepayDate']}
										>
											<DatePicker picker="month" />
										</Form.Item>
										<Form.Item
											label="提前还款方式："
											name={[field.name, 'prepayType']}
										>
											<Select options={loanTypes} />
										</Form.Item>
										<Form.Item
											label="提前还款金额："
											name={[field.name, 'prepayAmount']}
										>
											<Input suffix="元" />
										</Form.Item>
										<Form.Item
											label="新的贷款利率："
											name={[field.name, 'newRates']}
										>
											<Input suffix="%" />
										</Form.Item>
										<Form.Item
											label="新的还款方式："
											name={[field.name, 'newRepayType']}
										>
											<Select options={loanTypes} />
										</Form.Item>
										<Form.Item
											label="调整还款方案："
											name={[field.name, 'repayPlan']}
										>
											<Select options={repayPlans} />
										</Form.Item>
										<Form.Item
											label="新的月供金额："
											name={[
												field.name,
												'newMonthlyAmount',
											]}
										>
											<Input suffix="元" />
										</Form.Item>
									</Card>

									<MinusCircleOutlined
										onClick={() => remove(field.name)}
									/>
								</Space>
							))}

							<Form.Item wrapperCol={{ offset: 0 }}>
								<Button
									size="large"
									type="primary"
									onClick={onCheck}
									block
									style={{ width: '400px' }}
								>
									计算
								</Button>
							</Form.Item>

							<Tooltip title="添加提前还款计划">
								<FloatButton
									shape="circle"
									type="primary"
									onClick={() =>
										add(initialValues.preRepayList[0])
									}
									style={{ top: 100, right: 94 }}
									icon={<PlusOutlined />}
								/>
							</Tooltip>
						</>
					)}
				</Form.List>
			</Form>
			<BeforePreRepayTable formValues={formValues} />
			{formValues.preRepayList.map((val, index) => {
				return (
					<div key={index}>
						<Divider />
						<PreRepayTable formValues={formValues} index={index} />
						<Divider />
						<AfterPreRepayTable
							formValues={formValues}
							index={index}
						/>
					</div>
				);
			})}
		</>
	);
};

export default SearchForm;
