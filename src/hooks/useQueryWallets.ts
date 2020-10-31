import Axios from "axios";
import { useQuery } from "react-query";

type Params = {};

type Result = {
  code: string;
  message: string;
  payload: Wallet[];
};

export type WalletChild = {
  currencyGroup: string;
  tokenSymbol: string;
  decimal_point: number;
  tokenType: string;
  blockchain: string;
  explorer: string;
};

export type Wallet = {
  currencyGroup: string;
  color: string;
  currencySymbol: string;
  name: string;
  logo: string;
  decimal_point: number;
  wallets: WalletChild[];
};

const _fetch = () => {
  return Axios.request<Result>({
    method: "get",
    baseURL:
      "https://cors-anywhere.herokuapp.com/https://api.pintukripto.com/v1/",
    url: "/wallet/supportedCurrencies",
  });
};

export default function useQueryWallets() {
  return useQuery("wallets", _fetch);
}
