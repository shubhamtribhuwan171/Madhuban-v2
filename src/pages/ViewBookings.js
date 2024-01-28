import React, { useState, useEffect } from "react";
import { Table, Button, Card, Select, Input, DatePicker } from "antd";
import { withRouter } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;
const { Option } = Select;

const ViewBookings = ({ history }) => {
  const [bookings, setBookings] = useState([]);
  const [filterRoomNumber, setFilterRoomNumber] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [roomNumbers, setRoomNumbers] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [checkInDate, setCheckInDate] = useState(null); // Changed for Check In
  const [checkOutDate, setCheckOutDate] = useState(null); // Changed for Check Out
  const [showAllRooms, setShowAllRooms] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(
          "http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/reservation/getAll"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const processedData = data.map((booking) => {
          const [firstName, lastName] = booking.customerName.split(" ");
          return { ...booking, firstName, lastName, status: booking.status }; // Include status here
        });

        setBookings(processedData);
        const uniqueRoomNumbers = [
          ...new Set(data.map((booking) => booking.roomNumber)),
        ];
        setRoomNumbers(uniqueRoomNumbers);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  const handleEditClick = (booking) => {
    console.log(booking);
    const customer = booking;

    history.push({
      pathname: "/bookingConfirmation",
      state: {
        customerId: customer,
      },
    });
  };

  const handleAllRoomClick = () => {
    setFilterRoomNumber("");
    setShowAllRooms(true);
  };

  const handleClearFilterClick = () => {
    setFilterRoomNumber("");
    setFilterStatus("");
    setFilterName("");
    setCheckInDate(null); // Clear the selected date
    setCheckOutDate(null); // Clear the selected date
    setShowAllRooms(false); // Reset "All Room" flag
  };

  const columns = [
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      key: "bookingId",
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Check In",
      dataIndex: "checkIn",
      key: "checkIn",
    },
    {
      title: "Check Out",
      dataIndex: "checkOut",
      key: "checkOut",
    },
    {
      title: "Total Amount",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Amount Due",
      dataIndex: "pendingAmt",
      key: "pendingAmt",
    },
    {
      title: "Room Number",
      dataIndex: "roomNumber",
      key: "roomNumber",
      onFilter: (value, record) =>
        String(record.roomNumber).includes(filterRoomNumber),
      render: (roomNumber) => <span>{roomNumber}</span>,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => handleEditClick(record.bookingId)}
        />
      ),
    },
  ];

  return (
    <div>
      <Card title="Filters" style={{ marginBottom: "20px" }}>
        {" "}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          {" "}
          <div>
            <div>Room Number</div>
            <Select
              style={{ width: 120 }}
              placeholder="Select"
              onChange={(value) => {
                setFilterRoomNumber(value);
                setShowAllRooms(false);
              }}
              value={filterRoomNumber}
            >
              {roomNumbers.map((roomNumber) => (
                <Option key={roomNumber} value={roomNumber}>
                  {roomNumber}
                </Option>
              ))}
            </Select>
          </div>
          <div>
            <div>Customer Name</div>
            <Input
              placeholder="Enter Name"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              style={{ width: 200 }}
            />
          </div>
          <div>
            <div>Check In</div>
            <DatePicker
              placeholder="Select Date"
              style={{ width: 200 }}
              value={checkInDate}
              onChange={(date) => setCheckInDate(date)}
            />
          </div>
          <div>
            <div>Check Out</div>
            <DatePicker
              placeholder="Select Date"
              style={{ width: 200 }}
              value={checkOutDate}
              onChange={(date) => setCheckOutDate(date)}
            />
          </div>
          <div></div>
        </div>
      </Card>

      <Table
        columns={columns}
        dataSource={bookings.filter((record) => {
          const recordCheckInDate = new Date(record.checkIn);
          const recordCheckOutDate = new Date(record.checkOut);
          const isInRange =
            (!checkInDate || recordCheckInDate >= checkInDate) &&
            (!checkOutDate || recordCheckOutDate <= checkOutDate);

          return (
            (showAllRooms ||
              !filterRoomNumber ||
              record.roomNumber === filterRoomNumber) &&
            (!filterStatus || record.status === filterStatus) &&
            (!filterName ||
              record.customerName
                .toLowerCase()
                .includes(filterName.toLowerCase())) &&
            isInRange
          );
        })}
      />
    </div>
  );
};

export default withRouter(ViewBookings);
