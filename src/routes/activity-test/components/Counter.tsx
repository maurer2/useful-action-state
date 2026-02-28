type CounterProps = {
  text: string;
  labelId?: string;
};

export function Counter({ text, labelId }: CounterProps) {
  const textWithLettersOnly = text.replace(/[^a-zA-Z]/g, '').toUpperCase();

  // const uniqueLetters = new Set(textWithLettersOnly);
  const letterFrequencies = new Map<string, number>();
  for (const character of textWithLettersOnly) {
    const count = letterFrequencies.getOrInsertComputed(character, () => 0);

    letterFrequencies.set(character, count + 1);
  }

  return (
    <>
      {textWithLettersOnly.length ? (
        <dl
          aria-labelledby={labelId}
          className="gap-normal grid grid-cols-[repeat(auto-fill,minmax(4rem,1fr))]"
        >
          {[...letterFrequencies].map(([letter, count]) => (
            <div className="border-foreground flex flex-col border" key={letter}>
              <dt className="bg-foreground text-background p-tiny font-bold">{letter}</dt>
              <dd className="p-tiny">{count}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p>No letters</p>
      )}
    </>
  );
}
