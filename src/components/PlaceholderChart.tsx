/* tslint:disable */
/* eslint no-unused-expressions:0 */
import * as React from "react";
import { useEffect, useState } from "react";
import numberWithCommas from "../utils/numberWithCommas";
import useQueryPrices, { Interval } from "../hooks/useQueryPrices";
import timeConverter from "../utils/timeConverter";
import useQueryWallets from "../hooks/useQueryWallets";
import {
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
interface fetchedData {
  data: {
    payload: {};
  };
}
interface payload {
  price: number;
  key: number;
}
interface labelProps {
  x?: any;
  y?: any;
  stroke?: any;
  value?: any;
  dataMax?: any;
  dataMin?: any;
  index?: any;
  setActiveIndexMax?: any;
  setActiveIndexMin?: any;
  activeIndexMax?: any;
  activeIndexMin?: any;
  fill?: any;
}
const CustomizedLabel = ({
  x,
  y,
  stroke,
  value,
  dataMax,
  dataMin,
  index,
  setActiveIndexMax,
  setActiveIndexMin,
  activeIndexMax,
  activeIndexMin,
  fill,
}: labelProps) => {
  value == dataMax ? setActiveIndexMax(index) : undefined;
  value == dataMin ? setActiveIndexMin(index) : undefined;
  return (
    <text
      x={x}
      y={y}
      dy={value == dataMax ? -10 : 25}
      fill={fill}
      fontSize={16}
      textAnchor="middle"
    >
      {(value == dataMax || value == dataMin) &&
      (index == activeIndexMax || index == activeIndexMin)
        ? "Rp. " + numberWithCommas(value)
        : undefined}
    </text>
  );
};

export default function PlaceholderChart() {
  const [interval, setInterval] = useState<Interval>("hour");
  let tokens = [
    "BTC",
    "ETH",
    "USDT",
    "BNB",
    "COMP",
    "LINK",
    "SNX",
    "YFI",
    "UNI",
    "MKR",
  ];
  let tokens2 = [
    "Bitcoin",
    "Ethereum",
    "USD Token",
    "Binance Coin",
    "Compound",
    "Chainlink",
    "Synthetix",
    "Yearn Finance",
    "Uniswap",
    "Maker",
  ];
  let intervals: Interval[] = ["hour", "day", "week", "month", "year", "all"];
  const [activeIndexMax, setActiveIndexMax] = useState(null);
  const [activeIndexMin, setActiveIndexMin] = useState(null);
  const [index, setIndex] = useState(0);
  const [sortedData, setSortedData] = useState([]);
  const [currencyGroup, setCurrencyGroup] = useState(tokens[index]);
  const [data, setData] = useState([{}]);
  const { data: fetchedData, isLoading } = useQueryPrices({
    currencyGroup: currencyGroup,
    interval: interval,
  });
  const { data: wallets, isLoading: isLoading2 } = useQueryWallets();
  const [payload, setPayload] = useState<payload>({ price: 0, key: 0 });
  const customMouseOver = (e: any) => {
    setPayload(e.payload);
  };
  useEffect(() => {
    index == tokens.length ? setIndex(0) : undefined;
    if (!isLoading) {
      setData(
        fetchedData!.data.payload.chart
          .map((item, index) => {
            return {
              price: Number(item.close),
              key: item.block,
            };
          })
          .reverse()
      );
    }
  }, [isLoading, interval, payload]);

  return (
    <div
      className="flexDirCol contentCenterCenter"
      style={{ height: "100%", width: "100%" }}
    >
      <h1 style={{ textShadow: "5px 5px 7px rgba(0,0,0,0.5)" }}>
        Cryptocurrency Dynamic Price Chart (Squire Portfolio)
      </h1>
      <p className="man mbxs">
        Click on the cryptocurrency or interval button below to change.
      </p>
      <p className="man mbxs">
        *Note: Due to limited server processing capabilities and the usage of
        proxy to allow CORS, API calls may take a while to load.
      </p>
      <div className="flexDirRow contentCenterCenter w100">
        <h2>Price of</h2>
        <button
          className="phm"
          style={{
            border: "none",
            marginLeft: "10px",
            borderRadius: "25px",
            boxShadow: "5px 5px 7px rgba(0,0,0,0.5)",
          }}
          onClick={() => {
            setIndex(index + 1);
            setCurrencyGroup(tokens[index]);
          }}
        >
          <h2
            style={{
              color: "black",
              mixBlendMode: "multiply",
            }}
          >
            {tokens2[index]}
          </h2>
        </button>
      </div>
      <h2
        style={{
          backgroundColor: "white",
          color: "black",
          mixBlendMode: "screen",
          padding: "5px",
          borderRadius: "5px",
          textShadow: "5px 5px 7px rgba(0,0,0,0.5)",
        }}
      >
        Rp. {numberWithCommas(payload.price)} -{" "}
        {new Date(payload.key * 1000).toDateString().slice(4) +
          " " +
          new Date(payload.key * 1000).toTimeString().slice(0, 5)}
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        {!isLoading ? (
          <LineChart data={data} margin={{ right: 50, top: 30 }}>
            <XAxis axisLine={false} dataKey="key" tick={false} />
            <YAxis
              axisLine={false}
              tick={false}
              type="number"
              allowDataOverflow={false}
              domain={["dataMin", "dataMax"]}
            />
            <Tooltip />

            <Line
              activeDot={customMouseOver}
              label={
                <CustomizedLabel
                  fill={"white"}
                  setActiveIndexMax={setActiveIndexMax}
                  setActiveIndexMin={setActiveIndexMin}
                  activeIndexMax={activeIndexMax}
                  activeIndexMin={activeIndexMin}
                  dataMax={Math.max(
                    ...fetchedData!.data.payload.chart.map((item) =>
                      Number(item.close)
                    )
                  )}
                  dataMin={Math.min(
                    ...fetchedData!.data.payload.chart.map((item) =>
                      Number(item.close)
                    )
                  )}
                />
              }
              dot={false}
              type="monotone"
              dataKey="price"
              stroke="white"
              strokeWidth="2px"
            />
            <ReferenceLine x={payload.key} stroke="lightgreen" />
            <ReferenceDot
              y={payload.price}
              x={payload.key}
              fill="lightgreen"
              stroke="white"
              strokeWidth={1}
              r={8}
            />
          </LineChart>
        ) : (
          <div />
        )}
      </ResponsiveContainer>
      <div className="flexDirRow w80 contentCenterCenter">
        {intervals.map((item) => (
          <button
            onClick={() => setInterval(item)}
            className="contentCenterCenter mhxs "
            style={ButtonStyles}
          >
            <p>{item}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

const ButtonStyles = {
  backgroundColor: "white",
  border: "none",
  display: "flex",
  fontWeight: 700,
  flex: 1,
  borderRadius: "5px",
  color: "#343a40",
};
