interface DateItem {
	day: number; //天
	isonMonth: boolean; //当月
	isonDay: boolean; //当日
	origin: Date;
}

const isCurrentMonth = function(
	current: Date,
	year: number,
	month: number
): boolean {
	return current.getFullYear() === year && current.getMonth() === month;
};
const isCurrentDay = function(current: Date, day: number, onMonth: boolean) {
	return current.getDate() === day && onMonth;
};

// 通过传入月份年份返回天数列表
export const getDateData = function(year: number, month: number, day: number) {
	const firstDay = new Date(year, month, 1);
	let weekDay = firstDay.getDay(); //周日，0，周六 6
	weekDay = weekDay === 0 ? 7 : weekDay;
	let start = firstDay.getTime() - weekDay * 60 * 60 * 24 * 1000;
	let arr: DateItem[] = [];
	for (let i = 0; i < 42; i++) {
		let current = new Date(start + i * 60 * 60 * 24 * 1000);
		let onMonth = isCurrentMonth(current, year, month);
		arr.push({
			day: current.getDate(),
			isonMonth: onMonth,
			isonDay: isCurrentDay(current, day, onMonth),
			origin: current,
		});
	}
	let k = -1;
	return Array.from({ length: 6 }, () => {
		k++;
		return arr.slice(k * 7, (k + 1) * 7);
	});
};

// 日期效验
export const validateDate = (value: string) => {
	let reg = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
	if (reg.exec(value)) {
		return true;
	} else {
		return false;
	}
};