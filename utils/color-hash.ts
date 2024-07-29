export function bkdrHash(text: string) {
    const seed = 131;
    const seed2 = 137;
    let hash = 0;

    let _text = text;
    _text += "x";

    const MAX_SAFE_INTEGER = Math.floor(9007199254740991 / seed2);
    for (let i = 0; i < _text.length; i++) {
        if (hash > MAX_SAFE_INTEGER) {
            hash = Math.floor(hash / seed2);
        }
        hash = hash * seed + _text.charCodeAt(i);
    }
    return hash;
}

export function rgbToHex(rgb: number[]) {
    return `#${rgb.map(x => x.toString(16).padStart(2, "0")).join("")}`;
}

export function hslToRgb(h: number, s: number, l: number) {
    h /= 360;

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    return [h + 1 / 3, h, h - 1 / 3].map((color) => {
        if (color < 0) {
            color += 1;
        }
        if (color > 1) {
            color -= 1;
        }
        if (color < 1 / 6) {
            return p + (q - p) * 6 * color;
        }
        if (color < 1 / 2) {
            return q;
        }
        if (color < 2 / 3) {
            return p + (q - p) * 6 * (2 / 3 - color);
        }
        return p;
    }).map(x => Math.round(x * 255));
}

interface ColorHashOptions {
    lightness?: number | number[];
    saturation?: number | number[];
    hue?: number | { max: number; min: number } | { max: number; min: number }[];
    hash?: ((text: string) => number);
}

export function colorHash(text: string, options: ColorHashOptions = {}) {
    const _options: ColorHashOptions = {};

    const [L, S] = [options.lightness, options.saturation].map((p) => {
        p = p !== undefined ? p : [0.35, 0.5, 0.65];
        return Array.isArray(p) ? p.concat() : [p];
    });

    if (typeof options.hue === "number") {
        _options.hue = { max: options.hue, min: options.hue };
    }

    if (typeof options.hue === "object" && !Array.isArray(options.hue)) {
        _options.hue = [options.hue];
    }

    if (typeof options.hue === "undefined") {
        _options.hue = [];
    }

    const hueRanges = (_options.hue as { min: number; max: number }[]).map((range) => {
        return {
            min: typeof range.min === "undefined" ? 0 : range.min,
            max: typeof range.max === "undefined" ? 360 : range.max,
        };
    });

    const hashFn = typeof options.hash === "function" ? options.hash : bkdrHash;

    function hsl() {
        let _H: number;

        let hash = hashFn(text);
        const hueResolution = 727;

        if (hueRanges.length) {
            const range = hueRanges[hash % hueRanges.length];
            _H = ((hash / hueRanges.length) % hueResolution) * (range.max - range.min) / hueResolution + range.min;
        } else {
            _H = hash % 359;
        }

        hash = Math.ceil(hash / 360);
        const _S = S[hash % S.length];

        hash = Math.ceil(hash / S.length);
        const _L = L[hash % L.length];

        return [_H, _S, _L];
    }

    function rgb() {
        const [_H, _S, _L] = hsl();
        return hslToRgb(_H, _S, _L);
    }

    function hex() {
        return rgbToHex(rgb());
    }

    return {
        hsl,
        rgb,
        hex,
    };
}
