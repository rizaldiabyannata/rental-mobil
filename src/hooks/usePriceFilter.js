"use client";

import { useState, useEffect } from "react";

const parsePrice = (priceString) => {
  if (!priceString) return 0;
  return parseInt(priceString.replace(/Rp\.|\.|[a-zA-Z]/g, "").trim(), 10);
};

export const usePriceFilter = (initialData) => {
  const [filters, setFilters] = useState({ armada: "", paket: "", harga: "" });
  const [filteredData, setFilteredData] = useState(initialData);

  useEffect(() => {
    let data = [...initialData];

    if (filters.armada) {
      data = data.filter((item) => item.armada === filters.armada);
    }
    if (filters.paket) {
      data = data.filter((item) => item.paket === filters.paket);
    }
    if (filters.harga) {
      switch (filters.harga) {
        case "<500k":
          data = data.filter((item) => parsePrice(item.harga) < 500000);
          break;
        case "500k-1m":
          data = data.filter((item) => {
            const price = parsePrice(item.harga);
            return price >= 500000 && price <= 1000000;
          });
          break;
        case ">1m":
          data = data.filter((item) => parsePrice(item.harga) > 1000000);
          break;
        default:
          break;
      }
    }

    setFilteredData(data);
  }, [filters, initialData]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  return {
    filters,
    filteredData,
    handleFilterChange,
  };
};
