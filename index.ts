import express from "express";
import cors from "cors";
import giftCards from "routes/giftCards";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/giftCards", giftCards);

if (process.env.NODE_ENV === "production")
  app.use(express.static("client/build"));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log("Server started on port " + PORT));
