export const categories = [
    {key: "food", label: "🍔 Food"},
    {key: "entertainment", label: "🎉 Entertainment"},
    {key: "transport", label: "🚗 Transport"},
    {key: "health", label: "💊 Health"},
    {key: "education", label: "📚 Education"},
    {key: "clothing", label: "👕 Clothing"},
    {key: "pets", label: "🐶 Pets"},
    {key: "travel", label: "🌳 Travel"},
    {key: "other", label: "🤷‍♀️ Other"},
];

export type CategoryKey = (typeof categories)[number]['key'];