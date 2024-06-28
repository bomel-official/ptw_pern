export interface FortuneWheelItem {
    label: string;
    weight: number;
    color: `#${ string }`;
    contrast: `#${ string }`;
}

export interface RandomColor {
    color: `#${ string }`;
    contrast: `#${ string }`;
}

export interface WheelProps {
    items: FortuneWheelItem[];
}
