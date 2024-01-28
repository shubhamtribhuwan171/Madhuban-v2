import React from "react";
import { Card, Row, Col, Typography, Space, Tag, Divider } from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  ClockCircleOutlined,
  TagsOutlined,
  DollarOutlined,
  ClockCircleTwoTone,
  WalletTwoTone,
  CarOutlined,
} from "@ant-design/icons";

const CustomBookingsummary = ({ isLoading, bookingDetails }) => {
  console.log(bookingDetails);
  const formatTime = (time) => {
    if (!time) {
      return "Time not available";
    }
    const [hours, minutes] = time.split(":");
    const formattedHours = parseInt(hours, 10) % 12 || 12;
    const ampm = parseInt(hours, 10) < 12 ? "AM" : "PM";
    return `{formattedHours}:{minutes} {ampm}`;
  };
  // Dummy data
  const dummyBookingDetails = {
    customerName: "Shubham Tribhuwan",
    checkIn: "2024-01-11",
    checkOut: "2024-01-12",
    checkInTime: "14:00:00",
    checkOutTime: "14:00:00",
    roomNumber: 104,
    roomType: "AC",
    amenities: "AC TV Geyser Parking",
    total: 3000.0,
    addOnTotal: 0.0,
    paidAmt: 0.0,
    pendingAmt: 3000.0,
    addOnMap: {
      Breakfast: 20.0,
      "Extra Mattress": 30.0,
    },
    guestList: [],
  };

  bookingDetails = bookingDetails || dummyBookingDetails;

  return (
    <Card
      title="Booking Details"
      bordered={false}
      style={{
        width: "100%",
        backgroundColor: "#f0f2f5",
        borderRadius: "10px",
      }}
    >
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Space align="center">
                <UserOutlined style={{ fontSize: "24px", color: "#108ee9" }} />
                <Typography.Title level={5} style={{ color: "#108ee9" }}>
                  {bookingDetails.customerName}
                </Typography.Title>
              </Space>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Space align="center">
                <CalendarOutlined
                  style={{ fontSize: "24px", color: "#faad14" }}
                />
                <Typography.Text strong>Check-in Date:</Typography.Text>
                <Typography.Text strong type="success">
                  {bookingDetails.checkIn}
                </Typography.Text>
              </Space>
            </Col>
            <Col span={12}>
              <Space align="center">
                <CalendarOutlined
                  style={{ fontSize: "24px", color: "#faad14" }}
                />
                <Typography.Text strong>Check-out Date:</Typography.Text>
                <Typography.Text strong type="success">
                  {bookingDetails.checkOut}
                </Typography.Text>
              </Space>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Space align="center">
                <ClockCircleOutlined
                  style={{ fontSize: "24px", color: "#52c41a" }}
                />
                <Typography.Text strong>Check-in Time:</Typography.Text>
                <Typography.Text strong type="success">
                  {formatTime(bookingDetails.checkInTime)}
                </Typography.Text>
              </Space>
            </Col>
            <Col span={12}>
              <Space align="center">
                <ClockCircleOutlined
                  style={{ fontSize: "24px", color: "#52c41a" }}
                />
                <Typography.Text strong>Check-out Time:</Typography.Text>
                <Typography.Text strong type="success">
                  {formatTime(bookingDetails.checkOutTime)}
                </Typography.Text>
              </Space>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Space align="center">
                <TagsOutlined style={{ fontSize: "24px", color: "#2db7f5" }} />
                <Typography.Text strong>Room Type:</Typography.Text>
                <Typography.Text strong type="success">
                  {bookingDetails.roomType}
                </Typography.Text>
              </Space>
            </Col>
            <Col span={12}>
              <Space align="center">
                <CarOutlined style={{ fontSize: "24px", color: "#eb2f96" }} />
                <Typography.Text strong>Room Number:</Typography.Text>
                <Typography.Text strong type="success">
                  #{bookingDetails.roomNumber}
                </Typography.Text>
              </Space>
            </Col>
          </Row>
          <Divider style={{ backgroundColor: "#108ee9" }} />
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Space align="center">
                <DollarOutlined
                  style={{ fontSize: "24px", color: "#fa541c" }}
                />
                <Typography.Text strong>Total Amount:</Typography.Text>
                <Typography.Text strong type="success">
                  {(bookingDetails.total || 0).toFixed(2)}
                </Typography.Text>
              </Space>
            </Col>
            <Col span={12}>
              <Space align="center">
                <WalletTwoTone
                  twoToneColor="#fa8c16"
                  style={{ fontSize: "24px" }}
                />
                <Typography.Text strong>Pending Amount:</Typography.Text>
                <Typography.Text strong type="success">
                  {(bookingDetails.pendingAmt || 0).toFixed(2)}
                </Typography.Text>
              </Space>
            </Col>
          </Row>
          <Divider style={{ backgroundColor: "#108ee9" }} />

          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Space align="center">
                <TagsOutlined style={{ fontSize: "24px", color: "#2db7f5" }} />
                <Typography.Text strong>Amenities:</Typography.Text>
                <div>
                  {(bookingDetails.amenities || "")
                    .split(" ")
                    .map((amenity) => (
                      <Tag key={amenity} color="#108ee9">
                        {amenity}
                      </Tag>
                    ))}
                </div>
              </Space>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Space align="center">
                <TagsOutlined style={{ fontSize: "24px", color: "#2db7f5" }} />
                <Typography.Text strong>Add-Ons:</Typography.Text>
                <div>
                  {Object.keys(bookingDetails.addOnMap || {}).map((addon) => (
                    <Tag key={addon} color="#108ee9">
                      {addon} (+{bookingDetails.addOnMap[addon].toFixed(2)})
                    </Tag>
                  ))}
                </div>
              </Space>
            </Col>
          </Row>
        </div>
      )}
    </Card>
  );
};

export default CustomBookingsummary;
