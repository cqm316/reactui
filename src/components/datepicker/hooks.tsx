import { RefObject, useEffect } from "react";

/**
 * 监听window的点击事件，判断被点击的元素是否在ref中
 * 如果被点击的元素在ref中，就直接返回，不做任何操作。如果被点击的元素不在ref中，就执行handler回调。
 */
export function useClickOutside(
	ref: RefObject<HTMLElement>,
	handler: Function
) {
	useEffect(() => {
		const listener = (event: MouseEvent) => {
			if (!ref.current || ref.current.contains(event.target as Node)) {// 判断被点击的元素是否在ref元素内
				return;
			}
			handler(event);
		};
		window.addEventListener("click", listener);
		return () => window.removeEventListener("click", listener);
	}, [ref, handler]);
}