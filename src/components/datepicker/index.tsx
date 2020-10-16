import React, {
	PropsWithChildren,
	ReactNode,
	useMemo,
	useState,
	useRef,
	CSSProperties,
	useEffect,
} from "react";
import styled, { css } from "styled-components";
import { color, typography } from "../shared/styles";
import { darken, rgba, opacify } from "polished";
import { easing, modalOpenAnimate, modalCloseAnimate } from "../shared/animation";
import { useClickOutside } from './hooks';
import { useStateAnimation } from "../modal/hooks";
import { getDateData, validateDate } from './utils';
import Button from "../button";
import { Icon } from "../icon";

const CalendarWrapper = styled.div<{ visible: boolean; delay: number }>`
	position: absolute;
	border: 1px solid black;
	transition: all ${(props) => props.delay / 1000}s cubic-bezier(0.23, 1, 0.32, 1);
	background: ${color.lightest};
	${(props) =>
		props.visible &&
		css`
			animation: ${modalOpenAnimate} ${props.delay / 1000}s ease-in;
		`}
	${(props) =>
		!props.visible &&
		css`
			animation: ${modalCloseAnimate} ${props.delay / 1000}s ease-in;
		`}
`;
const CalendarDateRow = styled.tr``;
const tableItemStyle = css`
	display: inline-block;
	min-width: 24px;
	height: 24px;
	line-height: 24px;
	border-radius: 2px;
	margin: 2px;
	text-align: center;
`;
const CalendarHeadItem = styled.td`
	${tableItemStyle}
	cursor:default;
`;
interface DateItem {
	isonDay?: boolean;
	isonMonth?: boolean;
}
const CalendarDate = styled.td<Partial<DateItem>>`
	display: inline-block;
	min-width: 24px;
	height: 24px;
	line-height: 24px;
	border-radius: 2px;
	margin: 2px;
	text-align: center;
	cursor: pointer;
	${(props) => {
		if (props.isonDay) {
			//当天的 
			return `color:${color.lightest};background:${color.primary};`;
		}
		return `&:hover {color: ${color.secondary};};`;
	}}
	${(props) => {
		if (props.isonMonth === false) {
			//不是当月显示灰色
			return `color:${color.mediumdark};`;
		}
		return "";
	}}
`;
const CalendarHeadWrapper = styled.div`
	padding: 10px;
	display: flex;
	color: ${rgba(0, 0, 0, 0.85)};
	border-bottom: 1px solid #f0f0f0;
	justify-content: center;
`;
const btnStyle = {
	padding: "0px",
	background: color.lightest,
};
const IconWrapper = styled.span`
	display: inline-block;
	vertical-align: middle;
	> svg {
		height: 12px;
	}
`;
const BtnDiv = styled.div`
	display: flex;
	jutify-content: center;
	align-items: center;
	height: 24px;
	line-height: 24px;
`;
const MonthWrapper = styled.div`
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	position: relative;
`;
const MonthItem = styled.div<{ toGrey?: boolean }>`
	width: 25%;
	height: 60px;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	${(props) => props.toGrey && `color:${color.mediumdark};`}
	&:hover {
		color: ${color.secondary};
	}
`;
const Bwrapper = styled.b`
	cursor: pointer;
	&:hover {
		color: ${color.primary};
	}
`;
const CalendarIcon = styled.span`
	display: inline-block;
`;
const DatePickerWrapper = styled.div`
	display: inline-block;
	border-color: #40a9ff;
	border-right-width: 1px !important;
	outline: 0;
	box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
`;

/*---工具方法---*/
// 通过系统来计算年月
const getYearMonthDay = function(date: number): calDataType {
	let tmp = new Date(date);
	return [tmp.getFullYear(), tmp.getMonth(),tmp.getDate()];
};
const changeCalData = function(
	sign: number,
	calData: calDataType
): calDataType {
	const oldDate = new Date(calData[0], calData[1]);
	const newDate = oldDate.setMonth(oldDate.getMonth() +sign);
	return getYearMonthDay(newDate);
};
const changeCalYear = function(sign: number, calData: calDataType) {
	const oldDate = new Date(calData[0], calData[1]);
	const newDate = oldDate.setFullYear(oldDate.getFullYear()+ sign);
	return getYearMonthDay(newDate);
};
const generateDate = (calData: calDataType)=>{
	return `${calData[0]}-${calData[1] + 1}-${calData[2]}`
}
const getStartYear =function(calData: calDataType){
	return calData[0]-calData[0]%10
}

type modeType = 'date'|'month'|'year'
type calDataType = [number, number,number];
type DatepickerProps = {
	/** 日期选择的回调 */
	callback?: (v: string) => void;
	/**  动画的持续时间 */
	delay?: number;
	/** 初始值*/
	initDate?: string;
	/** 外层样式*/
	style?: CSSProperties;
	/** 外层类名 */
	classname?: string;
};

export function DatePicker(props: DatepickerProps) {
	const { callback, delay, initDate, style, classname } = props

	// 已选择的日期
	const [calData, setCalData] = useState<calDataType>(() => [
		new Date().getFullYear(),
		new Date().getMonth(),
		new Date().getDate(),
	]);
	// 输入框中的显示内容
	const [state, setState] = useState(() => {
		if (initDate && validateDate(initDate)) {
			return initDate;
		} else {
			return generateDate(calData);
		}
	});
	const [show, setShow] = useState(false);
	// 模式：年、月、日
	const [mode, setMode] = useState<modeType>('date')

	/*---事件---*/
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setState(e.target.value);
	};
	const handleClick = () => {
		setShow(true);
	};
	const handleBlur = () => {
		if (state !== generateDate(calData)) {
			//如果相等，说明是calData赋值上去的
			let res = validateDate(state); //验证格式
			if (!res) {
				//错误用原来的
				setState(generateDate(calData));
			} else {
				//否则计算新值
				let p = state.split("-");
				let newDate = new Date(
					parseInt(p[0]),
					parseInt(p[1]) - 1,
					parseInt(p[2])
				);
				const newCal: calDataType = [
					newDate.getFullYear(),
					newDate.getMonth(),
					newDate.getDate(),
				];
				setCalData(newCal);
				setState(generateDate(newCal));
			}
		}
	};

	const ref = useRef<HTMLDivElement>(null);

	/*---自定义hooks---*/
	// 
	const [st, setst, unmount] = useStateAnimation(setShow, delay);// setShow被setst包裹着。   st   --->   <CalendarWrapper visible={st} delay={delay!}></CalendarWrapper>
	// 监听window的点击事件，判断被点击的元素是否在ref中
	useClickOutside(ref, () => setst(false));// 调用setst就会调用setShow

	/*---日---*/
	const dayData = useMemo(() => {
		// const arr = Array.from({ length: 6 }, () => new Array(7).fill(1));// 创建一个6行7列的数组，并且内容都填充为1
		const arr = getDateData(calData[0], calData[1], calData[2]); //传的8实际是9
		return arr;
	}, [calData]);
	const modeDay = (
		<table style={{ display: mode === "date" ? "flex" : "none", flexDirection: 'column' }}>
			<thead>
				<tr>
					<CalendarHeadItem>日</CalendarHeadItem>
					<CalendarHeadItem>一</CalendarHeadItem>
					<CalendarHeadItem>二</CalendarHeadItem>
					<CalendarHeadItem>三</CalendarHeadItem>
					<CalendarHeadItem>四</CalendarHeadItem>
					<CalendarHeadItem>五</CalendarHeadItem>
					<CalendarHeadItem>六</CalendarHeadItem>
				</tr>
			</thead>
			<tbody>
				{dayData.map((v, index) => (
					<CalendarDateRow key={index}>
						{v.map((k, i) => (
							<CalendarDate
								isonDay={k.isonDay}
								isonMonth={k.isonMonth}
								key={i}
								onClick={() => {
									const origin = k.origin;
									const newCal: calDataType = [
										origin.getFullYear(),
										origin.getMonth(),
										origin.getDate(),
									];
									setCalData(newCal);
									setState(generateDate(newCal));
									setst(false);
								}}
							>
								{k.day}
							</CalendarDate>
						))}
					</CalendarDateRow>
				))}
			</tbody>
		</table>
	);
	
	/*---月---*/
	const MonthData = new Array(12).fill(1).map((_x, y) => y + 1);// 制作12个月
	const modeMonth = (
		<MonthWrapper
			style={{ display: mode === "month" ? "flex" : "none" }}
		>
			{MonthData.map((v, i) => {
				return (
					<MonthItem
						key={i}
						onClick={() => {
							//获取当前月，与点击相减得差
							let diff = v - calData[1] - 1;
							let res = changeCalData(diff, calData);
							setCalData(res);
							setMode("date");
						}}
					>
						{v}月
					</MonthItem>
				);
			})}
		</MonthWrapper>
	);

	/*---年---*/
	const startYear = getStartYear(calData);
	const yearMap = new Array(12).fill(1).map((_x, y) => startYear + y - 1);
	const modeYear = (
		<MonthWrapper
			style={{ display: mode === "year" ? "flex" : "none" }}
		>
			{yearMap.map((v, i) => (
				<MonthItem
					toGrey={i === 0 || i === 11}
					key={i}
					onClick={() => {
						//获取选择的年与差值
						let diff = v - calData[0];
						let res = changeCalYear(diff, calData);
						setCalData(res);
						setMode("month");
					}}
				>
					{v}
				</MonthItem>
			))}
		</MonthWrapper>
	);
	
	const render = useMemo(() => {
		const handleLeft = () => {
			let res: calDataType;
			if (mode === "date") {
				res = changeCalData(-1, calData);
			} else if (mode === "month") {
				res = changeCalYear(-1, calData);
			} else {
				res = changeCalYear(-10, calData);
			}
			setCalData(res);
		};
		const handleRight = () => {
			let res: calDataType;
			if (mode === "date") {
				res = changeCalData(1, calData);
			} else if (mode === "month") {
				res = changeCalYear(1, calData);
			} else {
				res = changeCalYear(10, calData);
			}
			setCalData(res);
		};
		if (!show) {
			unmount();// 清除定时器
			return null;// 因为返回null，就注销了 <CalendarWrapper visible={st} delay={delay!}></CalendarWrapper> 元素
		} else {
			return (
				<CalendarWrapper visible={st} delay={delay!}>
					{/* 日历头 */}
					<CalendarHeadWrapper>
						{/* 左箭头 */}
						<BtnDiv style={{ marginLeft: "20px" }}>
							<Button
								size="small"
								style={btnStyle}
								onClick={() => handleLeft()}
							>
								<IconWrapper>
									<Icon icon="arrowleft"></Icon>
								</IconWrapper>
							</Button>
						</BtnDiv>
						{/* 中间日期 */}
						<BtnDiv style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
							<Bwrapper
								style={{ display: mode === "year" ? "inline-block" : "none", }}
							>{`${startYear}-${startYear + 9}`}</Bwrapper>
							<Bwrapper
								onClick={() => {
									setMode("year");
								}}
								style={{ display: mode === "month" || mode === "date" ? "inline-block" : "none", }}
							>{`${calData[0]}年`}</Bwrapper>
							<Bwrapper
								onClick={() => {
									setMode("month");
								}}
								style={{ display: mode === "date" ? "inline-block" : "none", }}
							>{`${calData[1] + 1}月`}</Bwrapper>
						</BtnDiv>
						{/* 右箭头 */}
						<BtnDiv style={{ marginRight: "20px" }}>
							<Button
								size="small"
								style={btnStyle}
								onClick={() => handleRight()}
							>
								<IconWrapper>
									<Icon icon="arrowright"></Icon>
								</IconWrapper>
							</Button>
						</BtnDiv>
					</CalendarHeadWrapper>
					{/* 日历体 */}
					<div style={{ display: "flex", justifyContent: "center", width: '240px' }} >
						{modeDay}
						{modeMonth}
						{modeYear}
					</div>
				</CalendarWrapper>
			);
		}
	}, [show, unmount, st, calData, dayData, setst, mode, delay]);

	useEffect(() => {
		if (callback) callback(state);
	}, [state, callback]);


	
	return (
		<DatePickerWrapper ref={ref} onClick={handleClick} style={style} className={classname}>
			<input
				aria-label="date picker"
				onBlur={handleBlur}
				value={state}
				onChange={handleChange}
				style={{ border: "none", boxShadow: "none", outline: "none" }}
			></input>
			<CalendarIcon>
				<Icon icon="calendar"></Icon>
			</CalendarIcon>
			{render}
		</DatePickerWrapper>
	);
}
DatePicker.defaultProps = {
	/**  动画的持续时间 */
	delay: 210,
};

type CalendarProps = {}

export function Calendar(props: PropsWithChildren< CalendarProps>) {
	const { children } = props;
	return <div ></div>

}