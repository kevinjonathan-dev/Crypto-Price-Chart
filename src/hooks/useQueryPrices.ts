import Axios from "axios";
import { useQuery } from "react-query";

export type Interval = "hour" | "day" | "week" | "month" | "year" | "all";

type PricePoint = {
  open: string;
  high: string;
  low: string;
  close: string;
  block: number;
};
type Params = {
  currencyGroup: string;
  interval: Interval;
};

type Result = {
  code: string;
  message: string;
  payload: {
    chart: PricePoint[];
  };
};

const _fetch = (key: string, { currencyGroup, interval }: Params) => {
  return Axios.request<Result>({
    method: "GET",
    url: `/trade/chart/${currencyGroup.toLowerCase()}`,
    baseURL: "https://cors-anywhere.herokuapp.com/https://api.pintu.co.id/v1",
    params: {
      interval,
    },
  });
};

export default function useQueryPrices(params: Params) {
  return useQuery(["prices", params], _fetch);
}
