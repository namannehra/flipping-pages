export const getTurn = (selected: number) => {
    let turn = selected % 1;
    if (turn >= 0.5) {
        turn -= 1;
    }
    return turn;
};
