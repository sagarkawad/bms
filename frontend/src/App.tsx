import React, { useState, useEffect } from "react";
import { AlertCircle, Check } from "lucide-react";

//constants
const BACKEND_URL = "https://bms-6mc3.onrender.com/";

interface Seat {
  id: string;
  status: "available" | "booked" | "selected";
}

interface BackendSeat {
  id: number;
  status: string;
  seat: string;
}

function App() {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookingStatus, setBookingStatus] = useState<{
    message: string;
    type: "success" | "error" | null;
  }>({ message: "", type: null });

  useEffect(() => {
    const initializeSeats = async () => {
      try {
        // Fetch booked seats from backend
        const response = await fetch(`${BACKEND_URL}seats`);
        const data = await response.json();
        const bookedSeats = new Set(
          data.seats.map((seat: BackendSeat) => seat.seat),
        );

        // Initialize seats (8 rows x 10 seats)
        const initialSeats: Seat[] = [];
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 10; col++) {
            const seatId = `${String.fromCharCode(65 + row)}${col + 1}`;
            initialSeats.push({
              id: seatId,
              status: bookedSeats.has(seatId) ? "booked" : "available",
            });
          }
        }
        setSeats(initialSeats);
      } catch (error) {
        console.error("Failed to fetch seat data:", error);
        setBookingStatus({
          message: "Failed to load seat data. Please refresh the page.",
          type: "error",
        });
      }
    };

    initializeSeats();
  }, []);

  const handleSeatClick = (seatId: string) => {
    const seat = seats.find((s) => s.id === seatId);
    if (seat?.status === "booked") return;

    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((id) => id !== seatId);
      }
      return [...prev, seatId];
    });
  };

  const handleBooking = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "booked",
          seats: selectedSeats,
        }),
      });

      if (response.ok) {
        setSeats((prev) =>
          prev.map((seat) =>
            selectedSeats.includes(seat.id)
              ? { ...seat, status: "booked" }
              : seat,
          ),
        );
        setSelectedSeats([]);
        setBookingStatus({
          message: "Seats booked successfully!",
          type: "success",
        });
      } else {
        throw new Error("Booking failed");
      }
    } catch (error) {
      setBookingStatus({
        message: "Failed to book seats. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Movie Theater Booking
        </h1>

        {/* Screen */}
        <div className="relative mb-12">
          <div className="w-3/4 h-4 bg-gray-300 mx-auto rounded-lg transform perspective-1000 rotateX-45"></div>
          <p className="text-center mt-4 text-gray-400">Screen</p>
        </div>

        {/* Seats */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="grid grid-cols-10 gap-2">
            {seats.map((seat) => (
              <button
                key={seat.id}
                onClick={() => handleSeatClick(seat.id)}
                className={`
                  w-8 h-8 rounded-t-lg text-xs font-medium transition-colors
                  ${seat.status === "booked"
                    ? "bg-gray-600 cursor-not-allowed"
                    : selectedSeats.includes(seat.id)
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  }
                `}
                disabled={seat.status === "booked"}
              >
                {seat.id}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-600 rounded"></div>
            <span>Booked</span>
          </div>
        </div>

        {/* Booking Status */}
        {bookingStatus.type && (
          <div
            className={`flex items-center justify-center gap-2 p-4 rounded-lg mb-4 
            ${bookingStatus.type === "success" ? "bg-green-600" : "bg-red-600"}`}
          >
            {bookingStatus.type === "success" ? (
              <Check size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <p>{bookingStatus.message}</p>
          </div>
        )}

        {/* Booking Button */}
        <div className="text-center">
          <button
            onClick={handleBooking}
            disabled={selectedSeats.length === 0}
            className={`
              px-6 py-3 rounded-lg font-semibold transition-colors
              ${selectedSeats.length === 0
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
              }
            `}
          >
            Book {selectedSeats.length}{" "}
            {selectedSeats.length === 1 ? "Seat" : "Seats"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
