type Props = {
  phrases: string[];
};

export default function JapaneseText({ phrases }: Props) {
  return (
    <>
      {phrases.map((phrase, index) => (
        <span className="japanese-phrase" key={index}>
          {phrase}
        </span>
      ))}
    </>
  );
}
