import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();

//constants
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ msg: "hello" });
});

app.post("/book", async (req: Request, res: Response) => {
  try {
    const seats = req.body.seats.map((el: string) => {
      return { seat: el, status: req.body.status };
    });

    const tickets = await prisma.ticket.createMany({
      data: seats,
    });

    if (tickets) {
      console.log("tickets booked successfully");
      res.status(200).json({ msg: "tickets booked successfully!" });
    }
  } catch (e) {
    res.status(500).json({ msg: e });
  }
});

app.get("/seats", async (req: Request, res: any) => {
  try {
    const seats = await prisma.ticket.findMany();

    if (seats.length === 0) {
      return res.status(404).json({ msg: "No seats found." });
    }

    res.status(200).json({ seats });
  } catch (error) {
    console.error("Error fetching seats:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log("listening on PORT - ", PORT);
});
