import {
    computeRatingTotals,
    isRoundHidden,
    safeNumber,
    setMatrixCell,
    setPlacesCell,
    toggleRoundHidden,
} from "./rating-helpers";

describe("safeNumber", () => {
    it("parses numeric strings", () => {
        expect(safeNumber("5")).toBe(5);
    });
    it("falls back on empty/NaN input", () => {
        expect(safeNumber("")).toBe(0);
        expect(safeNumber("abc", -1)).toBe(-1);
    });
});

describe("setMatrixCell (immutability)", () => {
    it("updates the target cell without mutating the source", () => {
        const source = [
            [1, 2],
            [3, 4],
        ];
        const next = setMatrixCell(source, 1, 0, 99);

        expect(next[1][0]).toBe(99);
        // original untouched
        expect(source[1][0]).toBe(3);
        expect(next).not.toBe(source);
        expect(next[1]).not.toBe(source[1]);
        // unrelated row shares reference (cheap)
        expect(next[0]).toBe(source[0]);
    });
});

describe("setPlacesCell (immutability)", () => {
    it("updates one tuple element without mutating the source", () => {
        const source: Array<[number, number]> = [
            [-1, 0],
            [2, 5],
        ];
        const next = setPlacesCell(source, 1, 1, 8);

        expect(next[1]).toEqual([2, 8]);
        expect(source[1]).toEqual([2, 5]);
        expect(next[1]).not.toBe(source[1]);
    });
});

describe("toggleRoundHidden (immutability)", () => {
    it("toggles one round and returns a new array", () => {
        const source = [false, false, false, false, false];
        const next = toggleRoundHidden(source, 2);
        expect(next[2]).toBe(true);
        expect(source[2]).toBe(false);
        expect(next).not.toBe(source);
    });
    it("normalises a wrong-length array to AMOUNT_ROUNDS", () => {
        expect(toggleRoundHidden([], 0)).toEqual([true, false, false, false, false]);
    });
});

describe("isRoundHidden", () => {
    it("is false for an empty flags array", () => {
        expect(isRoundHidden([], 0)).toBe(false);
    });
    it("reflects the flag", () => {
        expect(isRoundHidden([true, false], 0)).toBe(true);
        expect(isRoundHidden([true, false], 1)).toBe(false);
    });
});

describe("computeRatingTotals", () => {
    it("sums placement + kills across rounds and players", () => {
        // 2 players, placement 2/round (5 rounds = 10), kills 1 each per round (10)
        const totals = computeRatingTotals(
            [
                [1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1],
            ],
            Array.from({ length: 5 }, () => [-1, 2] as [number, number]),
            [false, false, false, false, false],
            2,
        );
        expect(totals.amountPoints).toBe(20);
        expect(totals.killAmounts).toEqual([5, 5]);
        expect(totals.roundPoints).toEqual([4, 4, 4, 4, 4]);
    });

    it("excludes hidden rounds from totals and kill amounts", () => {
        const totals = computeRatingTotals(
            [[1, 1, 1, 1, 1]],
            Array.from({ length: 5 }, () => [-1, 0] as [number, number]),
            [true, false, false, false, false],
            1,
        );
        // round 0 hidden -> 4 counted
        expect(totals.amountPoints).toBe(4);
        expect(totals.killAmounts).toEqual([4]);
    });
});
