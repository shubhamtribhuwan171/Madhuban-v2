import React, { useState, useEffect } from "react";
import {
  CardContent,
  Grid,
  TextField,
  MenuItem,
  InputLabel,
  bookingDetails,
  FormControl,
} from "@mui/material";
import CancelIcon from "@material-ui/icons/Cancel";

import {
  Card,
  Typography,
  Row,
  Col,
  Form,
  Select,
  Input,
  InputNumber,
  Button,
  Table,
  Tooltip,
  Space,
  Modal,
  Drawer,
  Upload,
} from "antd";
import moment from "moment";
import AddGuest from "../pages/AddGuest";
import AddTransaction from "../pages/AddTransaction";
import CustomBookingsummary from "../pages/CustomBookingsummary";
import BillingSummary from "./BillingSummary"; // Replace with the correct path to your BillingSummary component

import {
  EyeOutlined,
  CheckOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import ViewBookings from "./ViewBookings.js";
import guestData from "./Pdata";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@material-ui/icons/Save";
import EditIcon from "@mui/icons-material/Edit";
import { useHistory } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation } from "react-router-dom";
import { DatePicker } from "antd";
import { message } from "antd";
function BookingConfirmation({
  guestData,

  onBackClick,
  handleAddGuest,

  handleSaveEditGuest,
  handleCancelEditGuest,
  setGuestData,
  customerId: propCustomerId,
  selectedRoom,
}) {
  const location = useLocation();

  const customerId = location.state?.customerId;

  console.log(customerId);
  const [editGuestIndex, setEditGuestIndex] = useState(null);
  const [editedGuest, setEditedGuest] = useState({});
  const [guestDetails, setGuestDetails] = useState([]);
  const [isCurrentGuestValid, setIsCurrentGuestValid] = useState(true);
  const [allBookings, setAllBookings] = useState([]);
  const [guestList, setGuestList] = useState([]);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [guestEditStates, setGuestEditStates] = useState({});
  const [showInvoice, setShowInvoice] = useState(false);
  const [openCardId, setOpenCardId] = useState(null);
  const history = useHistory();
  const [isEditMode, setIsEditMode] = useState({});
  const [showAddGuests, setShowAddGuests] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const setGuestToEditMode = (guestId) => {
    setGuestEditStates((prevStates) => ({ ...prevStates, [guestId]: true }));
  };
  const toggleAddGuests = () => {
    setShowAddGuests(!showAddGuests);
  };

  const [editedTransaction, setEditedTransaction] = useState({
    amount: "",
    date: "",
    paymentMode: "",
  });
  const [bookingDetails, setBookingDetails] = useState({});
  const [totalRoomCharges, setTotalRoomCharges] = useState(0);
  const [totalAddonCharges, setTotalAddonCharges] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [editTransactionIndex, setEditTransactionIndex] = useState(null);
  const [addingTransaction, setAddingTransaction] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [isAddTaskDrawerVisible, setIsAddTaskDrawerVisible] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [addingGuest, setAddingGuest] = useState(false);
  const guestIndex = 0;
  const handleLocalEditGuest = (index) => {
    setEditGuestIndex(index);
    setEditedGuest({ ...guestData[index] });
  };
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = `0${today.getMonth() + 1}`.slice(-2);
    const day = `0${today.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
  };
  const [newTransaction, setNewTransaction] = useState({
    amount: "",
    date: getCurrentDate(),
    paymentMode: "",
  });

  const showAddTaskDrawer = () => {
    form.setFieldsValue({
      roomNumber: bookingDetails.roomNumber,
      // Set the default value for the date field
      date: moment(new Date()).format("YYYY-MM-DD"),
    });
    setIsAddTaskDrawerVisible(true);
    setIsAddingTask(true);
  };

  const closeAddTaskDrawer = () => {
    form.resetFields();
    setIsAddTaskDrawerVisible(false);
    setIsAddingTask(false);
  };

  const startEditTransaction = (index) => {
    setEditTransactionIndex(index);
    setEditedTransaction({ ...transactions[index] });
  };
  const handleEditGuest = (guestId) => {
    setIsEditMode((prevMode) => ({ ...prevMode, [guestId]: true }));
  };

  const cancelEditTransaction = () => {
    setEditTransactionIndex(null);
  };

  const saveEditTransaction = async (index) => {
    const transactionToEdit = transactions[index];
    const { transactionId, bookingId } = transactionToEdit;
    const editedData = {
      amountPaid: parseFloat(editedTransaction.amount),
      paymentMode: editedTransaction.paymentMode,
      bookingId: bookingId,
      date: editedTransaction.date,
    };
    const requestUrl = `http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/transaction/edit?bookingId=${bookingId}&transactionId=${transactionId}`;
    console.log("Request URL:", requestUrl);
    console.log("Edited Transaction Data:", editedData);

    try {
      const response = await fetch(requestUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Transaction edited successfully:", data);

      const updatedTransactions = [...transactions];
      updatedTransactions[index] = { ...transactionToEdit, ...editedData };
      setTransactions(updatedTransactions);
      setEditTransactionIndex(null);
    } catch (error) {
      console.error("Error editing transaction:", error);
    }
  };

  const handleSaveGuest = async (guestId) => {
    const guestIndex = guestDetails.findIndex((g) => g.id === guestId);
    if (guestIndex === -1) {
      console.error(`Guest with ID ${guestId} not found.`);
      return;
    }

    const guest = guestDetails[guestIndex];

    if (!guest.firstName || guest.firstName.trim() === "") {
      alert("First Name is required.");
      setIsCurrentGuestValid(false);
      return;
    }

    const guestData = {
      guestId: guest.id,
      title: guest.title,
      firstName: guest.firstName,
      lastName: guest.lastName,
      email: guest.email,
      phoneNumber: guest.phoneNumber,
      guestDocs: {
        workID: guest.workID,
      },
      bookingId: customerId,
      age: guest.age,
    };

    try {
      const response = await fetch(
        "http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/guests/addList",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(guestData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setGuestList((currentList) => [...currentList, guestData]);

      const data = await response.json();
      console.log("Guest saved successfully:", data);
    } catch (error) {
      console.error("Error saving guest:", error);
    }
    setIsEditMode((prevMode) => ({ ...prevMode, [guestId]: false }));
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch(
        `http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/billing/getAllTransactions?bookingId=${customerId}`
      );
      console.log(response);
      setTransactions(data);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched Transactions:", data);
      setTransactions(
        data.map((tx) => ({
          ...tx,
          key: tx.transactionId,
        }))
      );
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchTransactions();
    }
  }, [customerId]);

  const onAddTask = async () => {
    try {
      const values = await form.validateFields();
      console.log("Received values of form: ", values);

      const formattedDate = moment(values.date).format("YY/MM/DD");
      const taskData = {
        ...values,
        date: formattedDate,
        status: "Assigned",
      };

      const response = await fetch(
        "http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/task/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
        }
      );

      if (!response.ok) {
      } else {
        await response.json();
        console.log("Task created successfully");
        message.success("Task Created Successfully");
      }

      form.resetFields();
      setIsAddTaskDrawerVisible(false);
    } catch (errorInfo) {}
  };

  const handleAddGuestClick = () => {
    toggleAddGuests();
  };

  const handleCancelAddTransaction = () => {
    setAddingTransaction(false);
    setNewTransaction({ amount: "", date: getCurrentDate(), paymentMode: "" });
  };
  const handleFileChange = (info) => {
    if (
      info.file.status === "done" ||
      (info.fileList && info.fileList.length > 0)
    ) {
      const file = info.fileList[0];
      const fileUrl = file.thumbUrl || URL.createObjectURL(file.originFileObj);
      setPreviewImage(fileUrl);
      setFileList(info.fileList);
      setIsFileUploaded(true);
    } else {
      setFileList([]);
      setIsFileUploaded(false);
    }
  };
  const handleAddTransaction = () => {
    setAddingTransaction(true);

    setNewTransaction({
      amount: "",
      date: "",
      paymentMode: "",
    });
  };
  const handleTransactionInputChange = (e) => {
    const { name, value } = e.target;
    if (editTransactionIndex != null) {
      setEditedTransaction((prevState) => {
        const updatedState = { ...prevState, [name]: value };
        console.log("Editing Transaction:", updatedState);
        return updatedState;
      });
    } else {
      setNewTransaction((prevState) => {
        const updatedState = { ...prevState, [name]: value };
        console.log("New Transaction:", updatedState);
        return updatedState;
      });
    }
  };

  const handleSaveEdit = () => {
    const updatedTransactions = [...transactions];
    updatedTransactions[editIndex] = editedTransaction;
    setTransactions(updatedTransactions);
    setEditIndex(null);
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
  };
  const handleEditTransaction = (index) => {
    setEditTransactionIndex(index);
    setEditedTransaction({ ...transactions[index] });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleDeleteGuest = (guestId) => {
    const updatedGuestDetails = guestDetails.filter(
      (guest) => guest.id !== guestId
    );
    setGuestDetails(updatedGuestDetails);

    if (openCardId === guestId) {
      setOpenCardId(null);
    }
  };

  const handleRemoveFile = (file) => {
    setFileList(fileList.filter((item) => item.uid !== file.uid));
    setIsFileUploaded(false);
    setPreviewVisible(false);
  };

  const handleLocalCancelEditGuest = () => {
    setEditGuestIndex(null);
  };
  const handleDeleteCard = (guestId) => {
    const updatedGuestDetails = guestDetails.filter(
      (guest) => guest.id !== guestId
    );
    setGuestDetails(updatedGuestDetails);

    if (openCardId === guestId) {
      setOpenCardId(null);
    }
  };
  const handleViewBookings = () => {
    history.push("/view-bookings");
  };
  const handleEditInputChange = (e) => {
    setEditedTransaction({
      ...editedTransaction,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditClick = () => {
    const checkInDate = moment(bookingDetails.checkInDate);
    const checkOutDate = moment(bookingDetails.checkOutDate);
    const numberOfNights = checkOutDate.diff(checkInDate, "days");

    const bookingData = {
      checkInDate: bookingDetails.checkInDate,
      checkOutDate: bookingDetails.checkOutDate,
      adults: bookingDetails.adults,
      children: bookingDetails.children,
      firstName: editedGuest.firstName, // Ensure these are the correct properties
      lastName: editedGuest.lastName,
      selectedRoom: selectedRoom,
      numberOfNights: numberOfNights,
    };

    history.push({
      pathname: "/bookingDetails",
      state: bookingData,
    });
  };

  const createTransaction = async (transactionDetails) => {
    try {
      const response = await fetch(
        "http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/transaction/create",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transactionDetails),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Transaction created successfully:", data);
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  };

  const handleSaveTransaction = () => {
    if (!customerId || isNaN(customerId)) {
      console.error("Invalid booking ID");
      return;
    }

    const transactionData = {
      amountPaid: parseFloat(newTransaction.amount),
      paymentMode: newTransaction.paymentMode,
      bookingId: parseInt(customerId, 10),
      date: newTransaction.date,
    };

    createTransaction(transactionData);

    console.log("Saving transaction with data:", transactionData);
    setTransactions([...transactions, transactionData]);
    setAddingTransaction(false);
    setNewTransaction({ amount: "", date: getCurrentDate(), paymentMode: "" });
  };

  useEffect(() => {
    console.log("Received Booking ID in BookingConfirmation:", customerId);
  }, [customerId]);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await fetch(
          `http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/reservation/getSummary?bookingId=${customerId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setBookingDetails({
          customerName: data.customerName || "N/A", // Handle null values
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
        console.error("There was a problem with your fetch operation:", error);
      }
    };

    const fetchBillingDetails = async () => {
      try {
        const response = await fetch(
          `http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/billing/getBill?bookingId=${customerId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        const parsedTransactions = data.transactions.map((transaction) => {
          const [id, amount, paymentMode, date] = transaction.split(" ");
          return { id, amount, paymentMode, date };
        });

        setTransactions(parsedTransactions);
        setTotalRoomCharges(data.total_room_charges);
        setTotalAddonCharges(data.total_addon_charges);
        setPaidAmount(data.paid_amount);
        setPendingAmount(data.pending_amount);
      } catch (error) {
        console.error(
          "There was a problem with your fetch operation for billing details:",
          error
        );
      }
    };

    fetchBookingDetails();
    fetchBillingDetails();
  }, [customerId]);

  const handleGenerateInvoice = () => {
    const bookingData = {
      booking: bookingDetails,
      guests: guestData,
    };

    setCurrentBooking(bookingData);
    setShowInvoice(true);
  };

  const handleCheckIn = async () => {
    console.log("Check In clicked. Booking ID:", customerId);

    const url = `http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/roomStatus/checkIn?bookingId=${customerId}`;

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Check-in successful:", data);
      message.success("Check In Confirmed"); // Success message
    } catch (error) {
      console.error("There was a problem with the check-in operation:", error);
      message.error("Already Checked In");
    }
  };

  const handleCheckOut = async () => {
    console.log("Check Out clicked. Booking ID:", customerId);

    const url = `http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/roomStatus/checkOut?bookingId=${customerId}`;

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Check-out successful:", data);
    } catch (error) {
      console.error("There was a problem with the check-out operation:", error);
    }
  };

  const handleGetInvoice = () => {
    console.log("Get Invoice clicked. Booking ID:", customerId);

    history.push("/invoice");
  };
  const handleDeleteTransaction = (index) => {
    const updatedTransactions = transactions.filter((_, i) => i !== index);
    setTransactions(updatedTransactions);
    if (editIndex === index) {
      setEditIndex(null);
    }
  };

  return (
    <div>
      <div class="site-content">
        <div className="bookingContainer">
          <div className="bookingForm">
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
            >
              <Grid item>
                <Row align="middle" justify="space-between" gutter={[16, 16]}>
                  <Grid item>
                    <Typography variant="h4" style={{ fontWeight: "bold" }}>
                      {bookingDetails.guestFirstName}{" "}
                      {bookingDetails.guestLastName}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      variant="subtitle2"
                      style={{ color: "grey", fontSize: "0.9rem" }}
                    >
                      Booking ID #{customerId}
                    </Typography>
                  </Grid>
                </Row>
              </Grid>
              <Grid item>
                <Typography variant="h5" style={{ color: "green" }}>
                  Confirmed Booking
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  onClick={handleEditClick}
                  style={{ marginRight: "10px" }}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={showAddTaskDrawer}
                >
                  Add Task
                </Button>
              </Grid>
            </Grid>
            <CustomBookingsummary bookingDetails={bookingDetails} />
            <div className="guest-details">
              <div className="guest-details-header"></div>
              <AddGuest bookingId={customerId} />

              <AddTransaction
                bookingId={customerId}
                transactions={transactions}
                onTransactionsUpdated={fetchTransactions}
              />
            </div>
          </div>
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
              <span>Room Total</span>
              <span>₹ {totalRoomCharges.toFixed(2)}</span>
            </div>
            <div className="summaryItem">
              <span>Add-on Charges</span>
              <span>₹ {totalAddonCharges.toFixed(2)}</span>
            </div>
            <div className="divider"></div>
            <div className="summaryRow total">
              <strong>Total</strong>
              <strong>
                ₹ {(totalRoomCharges + totalAddonCharges).toFixed(2)}
              </strong>
            </div>
            <hr />
            <div className="summaryRow">
              <span>Paid</span>
              <span>₹ {paidAmount.toFixed(2)}</span>
            </div>
            <div className="summaryRow pending">
              <span>Due</span>
              <span>₹ {pendingAmount.toFixed(2)}</span>
            </div>
          </div> */}
        </div>
        <Drawer
          title="Add New Task"
          placement="right"
          closable={false}
          onClose={closeAddTaskDrawer}
          visible={isAddTaskDrawerVisible}
          width={300}
        >
          <Form layout="vertical" form={form} onFinish={onAddTask}>
            <Form.Item
              name="roomNumber"
              label="Room Number"
              rules={[
                { required: true, message: "Please enter the room number" },
              ]}
            >
              <Input placeholder="Enter Room Number" disabled={isAddingTask} />
            </Form.Item>

            <Form.Item
              name="taskName"
              label="Task Name"
              rules={[{ required: true, message: "Please select a task name" }]}
            >
              <Select placeholder="Select a task">
                <Option value="Cleaning">Cleaning</Option>
                <Option value="Room Service">Room Service</Option>
              </Select>
            </Form.Item>

            <Form.Item name="date" label="Date" rules={[{ required: true }]}>
              <Input type="date" />
            </Form.Item>

            <Form.Item
              name="priority"
              label="Priority"
              rules={[
                { required: true, message: "Please select the priority" },
              ]}
            >
              <Select placeholder="Select Priority">
                <Select.Option value="low">Low</Select.Option>
                <Select.Option value="medium">Medium</Select.Option>
                <Select.Option value="high">High</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button
                type="default"
                onClick={closeAddTaskDrawer}
                style={{ marginRight: 8 }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Drawer>
      </div>
      <div className="footer">
        <Button
          onClick={() => history.push("/view-bookings")}
          className="blue-button"
        >
          View Bookings
        </Button>
        <Button onClick={handleCheckIn} className="blue-button">
          Check In
        </Button>
        <Button
          onClick={() => {
            handleCheckOut();
            message.success("Check Out Confirmed");
          }}
          className="blue-button"
        >
          Check Out
        </Button>
        <Button onClick={handleGetInvoice} className="blue-button">
          Get Invoice
        </Button>
      </div>
    </div>
  );
}

export default BookingConfirmation;
