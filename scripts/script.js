const API_KEY = 'insert api key'; 
const API_URL = `https://api.freecurrencyapi.com/v1/latest?apikey=${API_KEY}`;

const currencyNames = {
    AUD: { name: "Australian Dollar", flag: "https://flagcdn.com/au.svg" },
    BGN: { name: "Bulgarian Lev", flag: "https://flagcdn.com/bg.svg" },
    BRL: { name: "Brazilian Real", flag: "https://flagcdn.com/br.svg" },
    CAD: { name: "Canadian Dollar", flag: "https://flagcdn.com/ca.svg" },
    CHF: { name: "Swiss Franc", flag: "https://flagcdn.com/ch.svg" },
    CNY: { name: "Chinese Yuan", flag: "https://flagcdn.com/cn.svg" },
    CZK: { name: "Czech Koruna", flag: "https://flagcdn.com/cz.svg" },
    DKK: { name: "Danish Krone", flag: "https://flagcdn.com/dk.svg" },
    EUR: { name: "Euro", flag: "https://flagcdn.com/eu.svg" },
    GBP: { name: "British Pound", flag: "https://flagcdn.com/gb.svg" },
    HKD: { name: "Hong Kong Dollar", flag: "https://flagcdn.com/hk.svg" },
    HRK: { name: "Croatian Kuna", flag: "https://flagcdn.com/hr.svg" },
    HUF: { name: "Hungarian Forint", flag: "https://flagcdn.com/hu.svg" },
    IDR: { name: "Indonesian Rupiah", flag: "https://flagcdn.com/id.svg" },
    ILS: { name: "Israeli New Shekel", flag: "https://flagcdn.com/il.svg" },
    INR: { name: "Indian Rupee", flag: "https://flagcdn.com/in.svg" },
    ISK: { name: "Icelandic Króna", flag: "https://flagcdn.com/is.svg" },
    JPY: { name: "Japanese Yen", flag: "https://flagcdn.com/jp.svg" },
    KRW: { name: "South Korean Won", flag: "https://flagcdn.com/kr.svg" },
    MXN: { name: "Mexican Peso", flag: "https://flagcdn.com/mx.svg" },
    MYR: { name: "Malaysian Ringgit", flag: "https://flagcdn.com/my.svg" },
    NOK: { name: "Norwegian Krone", flag: "https://flagcdn.com/no.svg" },
    NZD: { name: "New Zealand Dollar", flag: "https://flagcdn.com/nz.svg" },
    PHP: { name: "Philippine Peso", flag: "https://flagcdn.com/ph.svg" },
    PLN: { name: "Polish Zloty", flag: "https://flagcdn.com/pl.svg" },
    RON: { name: "Romanian Leu", flag: "https://flagcdn.com/ro.svg" },
    RUB: { name: "Russian Ruble", flag: "https://flagcdn.com/ru.svg" },
    SEK: { name: "Swedish Krona", flag: "https://flagcdn.com/se.svg" },
    SGD: { name: "Singapore Dollar", flag: "https://flagcdn.com/sg.svg" },
    THB: { name: "Thai Baht", flag: "https://flagcdn.com/th.svg" },
    TRY: { name: "Turkish Lira", flag: "https://flagcdn.com/tr.svg" },
    USD: { name: "United States Dollar", flag: "https://flagcdn.com/us.svg" },
    ZAR: { name: "South African Rand", flag: "https://flagcdn.com/za.svg" }
};

async function fetchCurrencies() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch currencies");
        
        const data = await response.json();
        console.log("Fetched currencies data:", data);
        populateCurrencyOptions(data.data); // Use the rates data
    } catch (error) {
        console.error("Error fetching currencies:", error);
    }
}

function populateCurrencyOptions(currencies) {
    const fromCurrencySelect = document.getElementById("fromCurrency");
    const toCurrencySelect = document.getElementById("toCurrency");

    // Clear existing options
    fromCurrencySelect.innerHTML = "";
    toCurrencySelect.innerHTML = "";

    // Populate select options
    for (const code in currencies) {
        if (currencies.hasOwnProperty(code)) {
            const { name, flag } = currencyNames[code];
            if (name) {
                const optionFrom = document.createElement("option");
                optionFrom.value = code;
                // Set inner HTML for the option
                optionFrom.innerHTML = `<img src="${flag}" alt="${name} flag" style="width: 20px; height: 15px; margin-right: 5px;">${name} (${code})`;
                fromCurrencySelect.appendChild(optionFrom);

                const optionTo = optionFrom.cloneNode(true);
                toCurrencySelect.appendChild(optionTo);
            } else {
                console.warn(`No name found for currency code: ${code}`);
            }
        }
    }
}


async function convertCurrency() {
    const amount = parseFloat(document.getElementById("amount").value);
    const fromCurrency = document.getElementById("fromCurrency").value;
    const toCurrency = document.getElementById("toCurrency").value;
    const resultDiv = document.getElementById("result");

    if (isNaN(amount) || !fromCurrency || !toCurrency) {
        resultDiv.textContent = "Please enter a valid amount and select currencies.";
        return;
    }

    try {
        // Fetch exchange rates
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch exchange rates");
        
        const ratesData = await response.json();
        const rates = ratesData.data;

        // Calculate the converted amount
        const rateFrom = rates[fromCurrency];
        const rateTo = rates[toCurrency];
        if (!rateFrom || !rateTo) {
            resultDiv.textContent = "Conversion not possible with selected currencies.";
            return;
        }

        const convertedAmount = (amount / rateFrom) * rateTo;
        resultDiv.textContent = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
    } catch (error) {
        resultDiv.textContent = "Error during conversion. Check your connection or try again.";
        console.error("Error converting currency:", error);
    }
}

// Load currencies on page load
document.addEventListener("DOMContentLoaded", fetchCurrencies);
