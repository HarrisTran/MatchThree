export function convertTo2DArray<T>(arr: T[], rows: number, columns: number): T[][] {
    if (arr.length !== rows * columns) {
        throw new Error("Invalid input: 1D array cannot be evenly divided into 2D array.");
    }

    const result: T[][] = [];

    for (let i = 0; i < rows; i++) {
        result.push(arr.slice(i * columns, (i + 1) * columns));
    }

    return result;
}
