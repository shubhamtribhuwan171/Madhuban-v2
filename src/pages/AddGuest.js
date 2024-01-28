import React, { useState, useEffect } from "react";
import { Card, Form, Input, Select, Space, Button, Typography } from "antd";
import {
  EditOutlined,
  SearchOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
const { Title, Text } = Typography;
const { Option } = Select;

const AddGuests = ({ bookingId }) => {
  const [guests, setGuests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [form] = Form.useForm();

  const handleAddGuestClick = () => {
    setShowForm(true);
    setEditMode(false);
    setSelectedGuest(null);
    form.resetFields();
  };

  const handleEditGuestClick = (guest) => {
    setShowForm(true);
    setEditMode(true);
    setSelectedGuest(guest);

    form.setFieldsValue({
      title: guest.title,
      age: guest.age,
      firstName: guest.firstName,
      lastName: guest.lastName,
      phone: guest.phoneNumber,
      email: guest.email,
      identificationType: Object.keys(guest.guestDocs)[0],
      identificationNumber: Object.values(guest.guestDocs)[0],
    });
  };

  const handleCancelClick = () => {
    setShowForm(false);
    setEditMode(false);
    setSelectedGuest(null);
    form.resetFields();
  };

  const saveGuest = () => {
    form
      .validateFields()
      .then((values) => {
        const guestData = {
          guestId: editMode ? selectedGuest.id : guests.length + 1,
          title: values.title,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phoneNumber: values.phone,
          guestDocs: {
            [values.identificationType.toLowerCase().replace(/ /g, "")]:
              values.identificationNumber,
          },
          bookingId: bookingId,
          age: values.age,
        };
        console.log(guestData);
        fetch(
          "http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/guests/addList",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify([guestData]),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            console.log("Success:", data);
            fetchGuests();
            setReloadTrigger((prev) => prev + 1);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
        // if (editMode) {
        //   // const updatedGuests = guests.map((guest) =>
        //   //   guest.id === selectedGuest.id ? { ...guest, ...values } : guest
        //   // );
        //   // setGuests(updatedGuests);
        // } else {
        //   setGuests([...guests, { ...values, id: guests.length + 1 }]);
        // }
        form.resetFields();
        setShowForm(false);
        setEditMode(false);
        setSelectedGuest(null);
        fetchTransactions();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const deleteGuest = (id) => {
    setGuests(guests.filter((guest) => guest.id !== id));
  };

  const fetchGuests = async () => {
    try {
      const response = await fetch(
        `http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/guests/getByBookingId?bookingId=${bookingId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setGuests(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      // Handle error state here, if necessary
    }
  };

  useEffect(() => {
    if (bookingId) {
      fetchGuests();
    }
  }, [bookingId, reloadTrigger]);

  return (
    <Card style={styles.guestCard}>
      <div style={styles.headerContainer}>
        <Title level={4} style={styles.headerTitle}>
          Guests
        </Title>
        <Button style={styles.addButton} onClick={handleAddGuestClick}>
          Add Guest
        </Button>
      </div>

      {showForm && (
        <Form form={form} layout="vertical" style={styles.guestForm}>
          <Form.Item
            name="title"
            label={<b>Title</b>}
            rules={[{ required: false, message: "Please select title!" }]}
          >
            <Select placeholder="Select title">
              <Option value="Mr.">Mr.</Option>
              <Option value="Miss">Miss</Option>
              <Option value="Mrs.">Mrs.</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="age"
            label={<b>Age</b>}
            rules={[{ required: false, message: "Please input age!" }]}
          >
            <Input
              type="number"
              placeholder="Enter age"
              style={{ width: "100px" }}
            />
          </Form.Item>
          <Form.Item
            name="firstName"
            label={<b>First Name</b>}
            rules={[{ required: true, message: "Please input first name!" }]}
          >
            <Input placeholder="Enter first name" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="lastName"
            label={<b>Last Name</b>}
            rules={[{ required: false, message: "Please input last name!" }]}
          >
            <Input placeholder="Enter last name" style={{ width: "100px" }} />
          </Form.Item>
          <Form.Item
            name="phone"
            label={<b>Phone</b>}
            rules={[{ required: false, message: "Please input phone number!" }]}
          >
            <Input
              placeholder="Enter phone number"
              style={{ width: "100px" }}
            />
          </Form.Item>
          <Form.Item
            name="email"
            label={<b>Email ID</b>}
            rules={[
              { required: false, message: "Please input email ID!" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input placeholder="Enter email ID" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="identificationType"
            label={<b>Identification Type</b>}
            rules={[
              {
                required: false,
                message: "Please select identification type!",
              },
            ]}
          >
            <Select placeholder="Select identification type">
              <Option value="Aadhaar Card">Aadhaar Card</Option>
              <Option value="PAN Card">PAN Card</Option>
              <Option value="Driving License">Driving License</Option>
              <Option value="Passport">Passport</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="identificationNumber"
            label={<b>Identification Number</b>}
            rules={[
              {
                required: false,
                message: "Please input identification number!",
              },
            ]}
          >
            <Input
              placeholder="Enter identification number"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Space>
            <Button
              type="primary"
              onClick={async () => {
                if (editMode) {
                  try {
                    const values = await form.validateFields();

                    console.log(
                      "Updating guest with ID:",
                      selectedGuest.guestId
                    );
                    const updatedGuestData = {
                      guestId: selectedGuest.id,
                      title: values.title,
                      firstName: values.firstName,
                      email: values.email,
                      lastName: values.lastName,
                      phoneNumber: values.phone,
                      guestDocs: {
                        [values.identificationType
                          .toLowerCase()
                          .replace(/ /g, "")]: values.identificationNumber,
                      },
                      bookingId: bookingId,
                      age: values.age,
                    };

                    // const updatedGuests = guests.map((guest) =>
                    //   guest.id === selectedGuest.id ? updatedGuestData : guest
                    // );
                    // setGuests(updatedGuests);

                    const response = await fetch(
                      `http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/guests/editGuest?guestId=${selectedGuest.guestId}`,
                      {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(updatedGuestData),
                      }
                    );
                    // const data = await response.json();
                    // console.log("Update Success:", data);
                    fetchGuests();
                    setReloadTrigger((prev) => prev + 1);
                  } catch (error) {
                    console.error("Update Error:", error);
                  }

                  // Reset form and hide
                  form.resetFields();
                  setShowForm(false);
                  setEditMode(false);
                  setSelectedGuest(null);
                } else {
                  // This function is for adding a new transaction
                  saveGuest();
                }
              }}
            >
              {editMode ? "Update" : "Save"}
            </Button>

            <Button onClick={handleCancelClick}>Cancel</Button>
          </Space>
        </Form>
      )}

      {/* {guests.length > 0 && (
        <div>
          {guests.map((guest) => (
            <Card key={guest.id} style={styles.guestListItem}>
              <div style={styles.guestDetails}>
                <Text style={styles.guestId}>
                  {guest.title} {guest.firstName} {guest.lastName}
                </Text>
                <Text style={styles.guestText}>
                  Age: {guest.age} | Phone: {guest.phone} | Email: {guest.email}{" "}
                  | {guest.identificationType} : {guest.identificationNumber}
                </Text>
                <div style={styles.actionButtons}>
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => handleEditGuestClick(guest)}
                    style={styles.editButton}
                  />
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={() => deleteGuest(guest.id)}
                    style={styles.deleteButton}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )} */}
      {guests.length > 0 && (
        <div>
          {guests.map((guest) => (
            <Card key={guest.guestId} style={styles.guestListItem}>
              <div style={styles.guestDetails}>
                <Text style={styles.guestId}>
                  {guest.title} {guest.firstName} {guest.lastName}
                </Text>
                <Text style={styles.guestText}>
                  Age: {guest.age} | Phone: {guest.phoneNumber} | Email:
                  {guest.email}
                  {guest.guestDocs && Object.keys(guest.guestDocs)[0] && (
                    <Text>
                      {Object.keys(guest.guestDocs)[0]}:{" "}
                      {Object.values(guest.guestDocs)[0]}
                    </Text>
                  )}
                </Text>
                <div style={styles.actionButtons}>
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => handleEditGuestClick(guest)}
                    style={styles.editButton}
                  />
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={() => deleteGuest(guest.guestId)}
                    style={styles.deleteButton}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
};

const styles = {
  guestCard: {
    maxWidth: "100%",
    margin: "20px auto",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    margin: 0,
    fontSize: "1.2rem", // Larger font size for the title
  },
  addButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: 5,
    padding: "8px 15px", // More padding for better button size
    cursor: "pointer", // Cursor pointer on hover
  },
  guestForm: {
    marginBottom: 20,
    display: "flex",
    marginBottom: "20px",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  guestListItem: {
    backgroundColor: "#f5f5f5",
    margin: "10px 0",
    borderRadius: 5,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    padding: "12px", // Consistent padding
  },
  guestDetails: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  guestId: {
    fontWeight: "bold",
    color: "#333333",
  },
  guestText: {
    color: "#333333",
  },
  actionButtons: {
    display: "flex",
    alignItems: "center",
    marginTop: "10px", // Space above action buttons
  },
  editButton: {
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    marginRight: 8,
    cursor: "pointer",
  },
  deleteButton: {
    backgroundColor: "#F44336",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};

export default AddGuests;
