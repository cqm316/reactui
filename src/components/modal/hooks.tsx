import React, { useState, useMemo } from "react";

export function useStateAnimation(
	parentSetState: (v: boolean) => void,
	delay: number = 300
): [boolean, (v: boolean) => void, () => void] {
	const [state, setState] = useState(true);
	
	/*---封装定时器---*/
	const [innerClose, unmount] = useMemo(() => {
		let timer: number;
		// 开启定时器函数
		let innerclose = (v: boolean) => {
			setState(v);// 执行关闭动画(只是动画，没有注销元素)
			timer = window.setTimeout(() => {
				parentSetState(v);// 真正注销元素
				setState(true);// 改为初始值
			}, delay);
		};
		// 卸载定时器函数
		let unmount = () => window.clearTimeout(timer);
		
		return [innerclose, unmount];
	}, [setState, parentSetState, delay]);
	
	return [state, innerClose, unmount];
}

export function useStopScroll(state: boolean, delay: number, open?: boolean) {
	if (open) {
		let width = window.innerWidth - document.body.clientWidth;
		if (state) {
			document.body.style.overflow = "hidden";
			document.body.style.width = `calc(100% - ${width}px)`;
		} else {
			//等动画渲染
			setTimeout(() => {
				document.body.style.overflow = "auto";
				document.body.style.width = `100%`;
			}, delay);
		}
	}
}