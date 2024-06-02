import { AMOUNT_ROUNDS } from "@constants";

export function calcAmountKills(dataArray: number[][], i: number) {
    let points = 0
    for (let round = 0; round < AMOUNT_ROUNDS; round++) {
        points += dataArray[i][round]
    }
    return points
}
