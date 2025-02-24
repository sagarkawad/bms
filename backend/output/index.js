"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
//constants
const PORT = process.env.PORT || 3000;
const prisma = new client_1.PrismaClient();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.json({ msg: "hello" });
});
app.post("/book", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const seats = req.body.seats.map((el) => {
            return { seat: el, status: req.body.status };
        });
        const tickets = yield prisma.ticket.createMany({
            data: seats,
        });
        if (tickets) {
            console.log("tickets booked successfully");
            res.status(200).json({ msg: "tickets booked successfully!" });
        }
    }
    catch (e) {
        res.status(500).json({ msg: e });
    }
}));
app.get("/seats", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const seats = yield prisma.ticket.findMany();
        if (seats.length === 0) {
            return res.status(404).json({ msg: "No seats found." });
        }
        res.status(200).json({ seats });
    }
    catch (error) {
        console.error("Error fetching seats:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
}));
app.listen(PORT, () => {
    console.log("listening on PORT - ", PORT);
});
