import { useState } from "react";
import { format } from "date-fns";

// 감정 데이터 타입 정의
type Emotion = {
  label: string;
  color: string;
  name: string;
};

// 감정 리스트
const emotions: Emotion[] = [
  { label: "😊", color: "bg-yellow-300", name: "うれしい" },
  { label: "😢", color: "bg-blue-300", name: "かなしい" },
  { label: "😠", color: "bg-red-300", name: "いらいら" },
  { label: "😐", color: "bg-gray-300", name: "ふつう" },
  { label: "😰", color: "bg-purple-300", name: "ふあん" },
];

// 일기 저장 구조 타입
type EmotionLog = {
  emotion: Emotion;
  text: string;
};

type Logs = {
  [date: string]: EmotionLog;
};

export default function EmotionDiary() {
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [entry, setEntry] = useState<string>("");
  const [logs, setLogs] = useState<Logs>(() => {
    const saved = localStorage.getItem("emotionLogs");
    return saved ? JSON.parse(saved) : {};
  });

  const today = format(new Date(), "yyyy-MM-dd");

  const handleSave = () => {
    if (!selectedEmotion || !entry) return;
    const newLogs: Logs = {
      ...logs,
      [today]: { emotion: selectedEmotion, text: entry },
    };
    setLogs(newLogs);
    localStorage.setItem("emotionLogs", JSON.stringify(newLogs));
    setEntry("");
    setSelectedEmotion(null);
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-center">🌈 気分日記</h1>

      <div className="flex justify-around">
        {emotions.map((e) => (
          <button
            key={e.label}
            onClick={() => setSelectedEmotion(e)}
            className={`text-2xl p-2 rounded-full transition-transform duration-200 hover:scale-110 ${
              selectedEmotion?.label === e.label ? e.color : ""
            }`}
          >
            {e.label}
          </button>
        ))}
      </div>

      <textarea
        rows={3}
        placeholder="今日の気分はどうでしたか？"
        className="w-full p-2 border rounded"
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
      />

      <button
        onClick={handleSave}
        className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600"
      >
        保存する
      </button>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">📅 最近の記録</h2>
        <ul className="space-y-2">
          {Object.entries(logs)
            .sort((a, b) => (a[0] < b[0] ? 1 : -1))
            .slice(0, 5)
            .map(([date, { emotion, text }]) => (
              <li
                key={date}
                className={`p-3 rounded shadow ${emotion.color} flex items-center space-x-2`}
              >
                <span className="text-2xl">{emotion.label}</span>
                <div>
                  <p className="font-semibold">{date}</p>
                  <p>{text}</p>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
