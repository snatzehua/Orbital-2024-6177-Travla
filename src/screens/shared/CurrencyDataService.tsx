import AsyncStorage from "@react-native-async-storage/async-storage";
import { ExchangeRateOffline } from "./data/ExchangeRateOffline";

const EXCHANGE_RATE_DATA_KEY = "exchangeRate";

export const fetchExchangeRate = async (): Promise<Object> => {
  // Primary API call
  try {
    const primaryResponse = await fetch(
      "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json"
    );
    if (primaryResponse.ok) {
      const exchangeRateJson = await primaryResponse.json();
      AsyncStorage.setItem(
        EXCHANGE_RATE_DATA_KEY,
        JSON.stringify(exchangeRateJson)
      );
      return exchangeRateJson;
    }
  } catch (e) {
    console.error("Error fetching primary API: ", e);
  }
  // Secondary API call
  try {
    const secondaryResponse = await fetch(
      "https://latest.currency-api.pages.dev/v1/currencies/usd.json"
    );
    if (secondaryResponse.ok) {
      const exchangeRateJson = await secondaryResponse.json();
      AsyncStorage.setItem(
        EXCHANGE_RATE_DATA_KEY,
        JSON.stringify(exchangeRateJson)
      );
      return exchangeRateJson;
    }
  } catch (e) {
    console.error("Error fetching secondary API: ", e);
  }
  // Fetch from AsyncStorage
  try {
    const exchangeRateJson = await AsyncStorage.getItem(EXCHANGE_RATE_DATA_KEY);
    if (exchangeRateJson) {
      return exchangeRateJson;
    } else {
    }
  } catch (e) {
    console.error("Hopeless, even offline failed: ", e);
  }
  const exchangeRateJson = await JSON.stringify(ExchangeRateOffline);
  AsyncStorage.setItem(EXCHANGE_RATE_DATA_KEY, exchangeRateJson);
  return exchangeRateJson;
};
