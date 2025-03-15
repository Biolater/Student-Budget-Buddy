export const currencies = [
    {code: "USD", symbol: "$", name: "US Dollar"},
    {code: "EUR", symbol: "€", name: "Euro"},
    {code: "GBP", symbol: "£", name: "British Pound"},
    {code: "TRY", symbol: "₺", name: "Turkish Lira"},
    {code: "AZN", symbol: "₼", name: "Azerbaijani Manat"},
];

export type CurrencyCode = (typeof currencies)[number]['code'];