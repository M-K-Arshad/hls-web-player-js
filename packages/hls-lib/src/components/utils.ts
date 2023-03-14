const hexToRgb = (hex: string): number[] => hex
    .replace(
        /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
        (m: string, r: string, g: string, b: string) => `#${r + r + g + g + b + b}`,
    )
    .substring(1)
    .match(/.{2}/g)!
    .map((x: string) => parseInt(x, 16));

const isElementInViewport = (el: HTMLElement, percentage = 50): boolean => {
    const { innerHeight, innerWidth } = window;
    const { clientHeight, clientWidth } = document.documentElement;

    const rect = el.getBoundingClientRect();

    const offScreenTop = 0 - (rect.height * percentage) / 100;

    return (
        rect.top >= offScreenTop
        && rect.left >= 0
        && rect.bottom <= (innerHeight || clientHeight)
        && rect.right <= (innerWidth || clientWidth)
    );
};

export { hexToRgb, isElementInViewport };
