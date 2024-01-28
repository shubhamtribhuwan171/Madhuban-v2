import React, { useState, useEffect } from "react";
import "./Payment.css";
import BookingConfirmation from "./BookingConfirmation";
import { Tooltip, Button } from "antd";
import AddTransaction from "../pages/AddTransaction";
import BillingSummary from "./BillingSummary";

import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  EditIcon,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";

function Payment({ onBackClick, selectedRoom }) {
  const history = useHistory();
  const location = useLocation();
  const { customerId, bookingSummary } = location.state || {};
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [addingGuest, setAddingGuest] = useState(false);
  const [guestData, setGuestData] = useState([]);
  const [lastSavedGuest, setLastSavedGuest] = useState({});
  const today = new Date().toISOString().split("T")[0];
  const [bookingSummaryData, setBookingSummaryData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [totalRoomCharges, setTotalRoomCharges] = useState(0);
  const [totalAddonCharges, setTotalAddonCharges] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [roomDetails, setRoomDetails] = useState(selectedRoom || {});
  const [bookingDetails, setBookingDetails] = useState({});

  const [bookingCostDetails, setBookingCostDetails] = useState(
    bookingSummary || {}
  );

  const [newGuest, setNewGuest] = useState({
    "Payment Amount": "",
    Date: today,
    "Payment Mode": "Online",
  });

  const [editGuestIndex, setEditGuestIndex] = useState(null);
  const [editedGuest, setEditedGuest] = useState({});
  const [totalPayments, setTotalPayments] = useState(0);

  const getTotalPayments = () => {
    return guestData.reduce((total, guest) => {
      return total + parseFloat(guest["Payment Amount"] || 0);
    }, 0);
  };
  useEffect(() => {
    if (location.state) {
      setRoomDetails(selectedRoom);
      setBookingCostDetails(bookingSummary || {});
    }
  }, [location.state, selectedRoom]);
  useEffect(() => {
    console.log("Received Booking ID:", customerId);
  }, [customerId]);

  useEffect(() => {
    setTotalPayments(getTotalPayments());
  }, [guestData]);

  const handleEditGuest = (index) => {
    setEditGuestIndex(index);
    setEditedGuest({ ...guestData[index] });
  };

  const handleSaveEditGuest = (editedGuest, index) => {
    console.log("Saving Edited Guest Details:", editedGuest);

    const updatedGuests = [...guestData];
    updatedGuests[index] = editedGuest;
    setGuestData(updatedGuests);
    setEditGuestIndex(null);
    setLastSavedGuest(editedGuest);
  };

  const handleCancelEditGuest = () => {
    setEditGuestIndex(null);
  };

  const handleEditInputChange = (e) => {
    setEditedGuest({ ...editedGuest, [e.target.name]: e.target.value });
  };

  const handleAddGuest = () => {
    setAddingGuest(true);
  };

  // const handleInputChange = (e) => {
  //   if (e.target.name === "Date" && e.target.value.length === 2) {
  //     e.target.value += "/";
  //   } else if (e.target.name === "Date" && e.target.value.length === 5) {
  //     e.target.value += "/";
  //   }

  //   setNewGuest({ ...newGuest, [e.target.name]: e.target.value });
  // };
  const handleInputChange = (e) => {
    setNewGuest({ ...newGuest, [e.target.name]: e.target.value });
  };

  const handleSaveGuest = () => {
    setGuestData([...guestData, newGuest]);
    setNewGuest({
      "Payment Amount": "",
      Date: "",
      "Payment Mode": "",
    });
    setAddingGuest(false);
  };

  // const handleProceedClick = async () => {
  //   setShowBookingDetails(true);
  //   console.log("Booking Details:", bookingDetails);

  // const logObject = {
  //   amountPaid: parseFloat(editedGuest["Payment Amount"]),
  //   paymentMode: editedGuest["Payment Mode"],
  //   bookingId: customerId, // or replace with the actual bookingId if different
  // };

  // console.log(logObject);

  // try {
  //   const response = await fetch(
  //     "http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/transaction/create",
  //     {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(logObject),
  //     }
  //   );

  //   if (!response.ok) {
  //     throw new Error(`HTTP error! status: ${response.status}`);
  //   }

  //   const data = await response.json();

  //   console.log("Success:", data);

  //   history.push("/bookingConfirmation", {
  //     bookingDetails: bookingDetails,
  //     guestData: guestData,
  //   });
  // } catch (error) {
  //   console.error("Error during API call:", error);
  //   alert("Error submitting form. Check console for details.");
  // }
  // };
  const handleProceedClick = async () => {
    const guestToProcess = editGuestIndex !== null ? lastSavedGuest : newGuest;

    const logObject = {
      amountPaid: parseFloat(guestToProcess["Payment Amount"] || 0),
      paymentMode: guestToProcess["Payment Mode"].toLowerCase(),
      bookingId: customerId,
      date: guestToProcess.Date,
    };

    console.log(logObject);

    try {
      const response = await fetch(
        "http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/transaction/create",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(logObject),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Success:", data);
    } catch (error) {
      console.error("Error during API call:", error);
    }

    history.push("/bookingConfirmation", {
      bookingDetails: bookingDetails,
      guestData: guestData,
      customerId: customerId,
    });

    setShowBookingDetails(true);
  };
  const editTransaction = async (transactionId, transactionData) => {
    try {
      const response = await fetch(
        `http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/transaction/edit?bookingId=${transactionData.bookingId}&transactionId=${transactionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transactionData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Transaction edited successfully:", data);
    } catch (error) {
      console.error("Error editing transaction:", error);
    }
  };

  useEffect(() => {
    const fetchBookingSummary = async () => {
      try {
        const response = await fetch(
          `http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/reservation/getSummary?bookingId=${customerId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBookingSummaryData(data);
        setBookingDetails({
          customerName: data.customerName || "N/A",
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          checkInTime: data.checkInTime,
          checkOutTime: data.checkOutTime,
          roomNumber: data.roomNumber,
          roomType: data.roomType,
          amenities: data.amenities || "",
          total: data.total || 0.0,
          addOnTotal: data.addOnTotal || 0.0,
          paidAmt: data.paidAmt || 0.0,
          pendingAmt: data.pendingAmt || 0.0,
          addOnMap: data.addOnMap || {},
          guestList: data.guestList || [],
        });
      } catch (error) {
        console.error("Error fetching booking summary:", error);
      }
    };

    if (customerId) {
      fetchBookingSummary();
    }
  }, [customerId]);

  const handleDeleteGuest = (index) => {
    const updatedGuests = guestData.filter((_, i) => i !== index);
    setGuestData(updatedGuests);
  };

  if (showBookingDetails) {
    return (
      <BookingConfirmation
        bookingDetails={bookingDetails}
        guestData={guestData}
        customerId={customerId}
        onBackClick={handleBackClick}
        handleAddGuest={handleAddGuest}
        handleEditGuest={handleEditGuest}
        handleSaveEditGuest={handleSaveEditGuest}
        handleCancelEditGuest={handleCancelEditGuest}
        setGuestData={setGuestData}
        addingGuest={addingGuest}
        selectedRoom={selectedRoom}
        setAddingGuest={setAddingGuest}
      />
    );
  }

  const handleCancelAddGuest = () => {
    setAddingGuest(false);
    setNewGuest({
      "Payment Amount": "",
      Date: "",
      "Payment Mode": "",
    });
  };

  return (
    <>
      <div className="container">
        <div className="left-section">
          <div className="payment-information">
            <h2>Payment Information</h2>

            <AddTransaction bookingId={customerId} />
          </div>
        </div>
        <div className="right-section">
          <BillingSummary
            bookingDetails={bookingDetails}
            transactions={transactions}
            totalRoomCharges={totalRoomCharges}
            totalAddonCharges={totalAddonCharges}
            paidAmount={paidAmount}
            pendingAmount={pendingAmount}
          />
          {/* <div className="booking-summary">
            <div className="summaryHeader">Booking Summary</div>

            <div className="summaryRow">
              <span>Room Total (1 Night)</span>
              <span>₹ {selectedRoom?.costPerDay.toFixed(2)}</span>
            </div>

            <div className="summaryItem">
              <span>GST (18%)</span>
              <span>₹ {(selectedRoom?.costPerDay * 0.18).toFixed(2)}</span>
            </div>

            <div className="divider"></div>

            <div className="summaryRow total">
              <strong>Total</strong>
              <strong>₹ {(selectedRoom?.costPerDay * 1.18).toFixed(2)}</strong>
            </div>

            {bookingSummaryData && (
              <>
                <div className="summaryRow">
                  <span>Total Cost from API</span>
                  <span>₹ {bookingSummaryData.totalCost}</span>
                </div>
              </>
            )}

            <div className="summaryRow">
              <span>Paid</span>
              <span>₹ {totalPayments.toFixed(2)}</span>
            </div>

            <div className="summaryRow pending">
              <span>Due</span>
              <span>
                ₹ {(selectedRoom?.costPerDay * 1.18 - totalPayments).toFixed(2)}
              </span>
            </div> */}
          {/* </div> */}
        </div>
      </div>
      <div
        style={{ display: "flex", justifyContent: "center" }}
        className="footer-buttons"
      >
        <Button className="backButton" onClick={onBackClick}>
          Back
        </Button>
        <button className="proceed-button" onClick={handleProceedClick}>
          Confirm Booking
        </button>
      </div>
    </>
  );
}

export default Payment;
