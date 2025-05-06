import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("https://tradebackend-4.onrender.com");

function App() {
  const [marketData, setMarketData] = useState([]);

  useEffect(() => {
    socket.on("market-update", (data) => {
      setMarketData(data);
    });

    return () => socket.off("market-update");
  }, []);

  return (
    <div className="table-wrapper">
      <h2>Top Gainers</h2>
      <table className="stock-table">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Current Price</th>
            <th>Today L/H</th>
            <th>Change (%)</th>
            <th>Prev. Close</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>
          {marketData.map((stock, index) => {
            const position =
              ((stock.currentPrice - stock.low) / (stock.high - stock.low)) *
              100;

            return (
              <tr key={index}>
                <td className="symbol-cell">
                  <span>{stock.symbol}</span>
                </td>
                <td>{stock.currentPrice.toFixed(2)}</td>
                <td className="range-bar">
                  <div className="bar-container">
                    <span className="low-value">{stock.low.toFixed(2)}</span>
                    <div className="bar">
                      <div
                        className="marker"
                        style={{ left: `${position}%` }}
                      />
                    </div>
                    <span className="high-value">{stock.high.toFixed(2)}</span>
                  </div>
                </td>
                <td style={{ color: stock.change >= 0 ? "green" : "red" }}>
                  {stock.change >= 0 ? "▲" : "▼"} {stock.change} ({stock.percent}%)
                </td>
                <td>{stock.prevClose.toFixed(2)}</td>
                <td>{stock.volume}</td>
              </tr>

            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
