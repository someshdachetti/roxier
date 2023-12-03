import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
let fetchedData = [];

app.use(cors());

app.get("/", async (req, res) => {
  try {
    const url = "https://s3.amazonaws.com/roxiler.com/product_transaction.json";
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();
      // Consider storing fetched data globally or in a database for easier access across requests

      const page = parseInt(req.query.page) || 1;
      const pageSize = 10;
      const startIndex = (page - 1) * pageSize;
      const endIndex = page * pageSize;
      const paginatedData = data.slice(startIndex, endIndex); // Slice the data for the requested page

      res.json(paginatedData);
    } else {
      res.status(response.status).send("Failed to fetch data");
    }
  } catch (error) {
    console.log("Error Occurred", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/total-sale-amount", async (req, res) => {
  try {
    const url = "https://s3.amazonaws.com/roxiler.com/product_transaction.json";
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();

      // Get the first month's data
      const firstMonthData = data.filter((item) => {
        const saleDate = new Date(item.dateOfSale);
        return saleDate.getMonth() === 0; // Month indices are zero-based in JavaScript (0 for January)
      });

      // Calculate total sale amount for the first month
      const totalSaleAmountFirstMonth = firstMonthData.reduce(
        (total, item) => total + item.amount,
        0
      );

      res.json({ totalSaleAmountFirstMonth });
    } else {
      res.status(response.status).send("Failed to fetch data");
    }
  } catch (error) {
    console.log("Error Occurred", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/unsold-items", async (req, res) => {
  try {
    const url = "https://s3.amazonaws.com/roxiler.com/product_transaction.json";
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();
      const selectedMonth = parseInt(req.query.month);

      // Filter data based on the selected month and unsold items
      const unsoldItems = data.filter((item) => {
        const saleDate = new Date(item.dateOfSale);
        const isSold = item.sold; // Assuming 'sold' field exists in the data

        return saleDate.getMonth() === selectedMonth && !isSold;
      });

      const totalUnsoldItems = unsoldItems.length;

      res.json({ totalUnsoldItems });
    } else {
      res.status(response.status).send("Failed to fetch data");
    }
  } catch (error) {
    console.log("Error Occurred", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/bar-chart-data", async (req, res) => {
  try {
    const url = "https://s3.amazonaws.com/roxiler.com/product_transaction.json";
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();
      const selectedMonth = parseInt(req.query.month);

      // Filter data based on the selected month
      const filteredData = data.filter((item) => {
        const saleDate = new Date(item.dateOfSale);
        return saleDate.getMonth() === selectedMonth;
      });

      // Define price ranges and count items in each range for the selected month
      const priceRanges = {
        "0-100": 0,
        "101-200": 0,
        "201-300": 0,
        "301-400": 0,
        "401-500": 0,
        "501-600": 0,
        "601-700": 0,
        "701-800": 0,
        "801-900": 0,
        "901-above": 0,
      };

      filteredData.forEach((item) => {
        const price = parseFloat(item.price); // Assuming 'price' field exists in the data

        if (price >= 0 && price <= 100) {
          priceRanges["0-100"]++;
        } else if (price <= 200) {
          priceRanges["101-200"]++;
        } else if (price <= 300) {
          priceRanges["201-300"]++;
        } else if (price <= 400) {
          priceRanges["301-400"]++;
        } else if (price <= 500) {
          priceRanges["401-500"]++;
        } else if (price <= 600) {
          priceRanges["501-600"]++;
        } else if (price <= 700) {
          priceRanges["601-700"]++;
        } else if (price <= 800) {
          priceRanges["701-800"]++;
        } else if (price <= 900) {
          priceRanges["801-900"]++;
        } else {
          priceRanges["901-above"]++;
        }
      });

      res.json({ priceRanges });
    } else {
      res.status(response.status).send("Failed to fetch data");
    }
  } catch (error) {
    console.log("Error Occurred", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3005, () => {
  console.log("Server is listening at 3005");
});

export { app, fetchedData };
