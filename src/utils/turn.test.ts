import { getTurn } from './turn';

test('0', () => {
    expect(getTurn(0)).toEqual(0);
});

test('1.25', () => {
    expect(getTurn(1.25)).toEqual(0.25);
});

test('2.5', () => {
    expect(getTurn(2.5)).toEqual(-0.5);
});

test('3.75', () => {
    expect(getTurn(3.75)).toEqual(-0.25);
});
