export function shuffleArray<T>(
  items: readonly T[]
): T[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] = [
      result[j],
      result[i],
    ];
  }

  return result;
}

export function shuffleWithCorrectAnswer(
  options: string[],
  correctIndex: number
) {
  const prepared = options.map((text, index) => ({
    text,
    isCorrect: index === correctIndex,
  }));

  const shuffled = shuffleArray(prepared);

  return {
    options: shuffled.map((item) => item.text),
    answer: shuffled.findIndex(
      (item) => item.isCorrect
    ),
  };
}