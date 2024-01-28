import React, { useState, useEffect } from "react";
import {
  Card,
  Tag,
  Typography,
  Select,
  Input,
  Space,
  Row,
  Col,
  Button,
  Modal,
  Popover,
  message,
  Tabs,
} from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  HomeOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

const { TabPane } = Tabs;

const Housekeeping = () => {
  const [housekeepingTasks, setHousekeepingTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filters, setFilters] = useState({
    room: "",
    taskName: "",
    status: "",
    floor: "",
    priority: "",
  });
  const [roomOptions, setRoomOptions] = useState([]); // State variable to store room options

  useEffect(() => {
    // Fetch data from the API and update the state...
    fetch("http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/task/getAll")
      .then((response) => response.json())
      .then((data) => {
        setHousekeepingTasks(data);
        setFilteredTasks(data);

        // Extract room numbers from the data and set roomOptions state
        const roomNumbers = data.map((task) => task.roomNumber);
        const uniqueRoomNumbers = Array.from(new Set(roomNumbers));
        setRoomOptions(uniqueRoomNumbers);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        message.error("Error fetching data from the API");
      });
  }, []);

  const handleStatusChange = async (task, newStatus) => {
    try {
      const currentDate = new Date().toISOString().split("T")[0];
      const requestBody = {
        roomNumber: task.roomNumber,
        status: newStatus || "Assigned",
        priority: task.priority || "Low",
        date: currentDate || null,
      };

      const response = await fetch(
        `http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/task/editTask?taskId=${task.taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        const updatedTasks = housekeepingTasks.map((t) =>
          t.taskId === task.taskId
            ? { ...t, status: newStatus || "Assigned" }
            : t
        );
        setHousekeepingTasks(updatedTasks);
        setFilteredTasks(updatedTasks);
        message.success("Task status updated successfully");
      } else {
        console.error("Failed to update task status via API");
        message.error("Failed to update task status via API");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      message.error("Error updating task status");
    }
  };

  const handlePriorityChange = async (task, newPriority) => {
    try {
      const currentDate = new Date().toISOString().split("T")[0];
      const requestBody = {
        roomNumber: task.roomNumber,
        status: task.status || "Assigned",
        priority: newPriority || "Low",
        date: currentDate || null,
      };

      const response = await fetch(
        `http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/task/editTask?taskId=${task.taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        const updatedTasks = housekeepingTasks.map((t) =>
          t.taskId === task.taskId
            ? { ...t, priority: newPriority || "Low" }
            : t
        );
        setHousekeepingTasks(updatedTasks);
        setFilteredTasks(updatedTasks);
        message.success("Task priority updated successfully");
      } else {
        console.error("Failed to update task priority via API");
        message.error("Failed to update task priority via API");
      }
    } catch (error) {
      console.error("Error updating task priority:", error);
      message.error("Error updating task priority");
    }
  };

  const renderCard = (task) => (
    <Card
      key={task.taskId}
      style={{
        width: "100%",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
        marginBottom: "16px",
      }}
      hoverable
    >
      <Row>
        <Col span={6}>
          <Text strong>Task ID:</Text>
          <br />
          <Text>{task.taskId}</Text>
        </Col>
        <Col span={6}>
          <Text strong>Room Number:</Text>
          <br />
          <Text>Room {task.roomNumber}</Text>
        </Col>
        <Col span={6}>
          <Text strong>Task Name:</Text>
          <br />
          <Text>{task.taskName}</Text>
        </Col>
        <Col span={6}>
          <Text strong>Number of Guests:</Text>
          <br />
          <Text>{task.numOfGuests}</Text>
        </Col>
      </Row>
      <Row>
        <Col span={6}>
          <Text>
            <UserOutlined /> Customer: {task.customerName}
          </Text>
        </Col>
        <Col span={6}>
          <Text>
            <ClockCircleOutlined /> Check Out: {task.checkOutTime}
          </Text>
        </Col>
        <Col span={6}>
          <Text>
            <HomeOutlined /> Room Status: {task.roomStatus}
          </Text>
        </Col>
        <Col span={6}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Tag
              color={getPriorityColor(task.priority)}
              style={{ marginRight: "8px" }}
            >
              {task.priority}
            </Tag>
            <Tag>{task.status}</Tag>
          </div>
          <div style={{ marginTop: "16px" }}>
            {task.status === "Assigned" && (
              <Button
                type="primary"
                onClick={() => handleStatusChange(task, "Work in Progress")}
                style={{ marginRight: "8px" }}
              >
                Mark as Work in Progress
              </Button>
            )}
            {task.status === "Work in Progress" && (
              <Button
                type="primary"
                onClick={() => handleStatusChange(task, "Done")}
                style={{ marginRight: "8px" }}
              >
                Mark as Done
              </Button>
            )}
            {task.status === "Done" && (
              <Button
                type="primary"
                onClick={() => handleStatusChange(task, "Assigned")}
                style={{ marginRight: "8px" }}
              >
                Reopen
              </Button>
            )}
            <Popover
              content={
                <div>
                  <Button
                    type="link"
                    onClick={() => handlePriorityChange(task, "High")}
                  >
                    High
                  </Button>
                  <Button
                    type="link"
                    onClick={() => handlePriorityChange(task, "Medium")}
                  >
                    Medium
                  </Button>
                  <Button
                    type="link"
                    onClick={() => handlePriorityChange(task, "Low")}
                  >
                    Low
                  </Button>
                </div>
              }
              title="Change Priority"
              trigger="click"
            >
              <Button type="link">Change Priority</Button>
            </Popover>
          </div>
        </Col>
      </Row>
    </Card>
  );

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "red";
      case "Medium":
        return "orange";
      case "Low":
        return "green";
      default:
        return "default";
    }
  };

  const priorityOrder = {
    High: 1,
    Medium: 2,
    Low: 3,
  };

  const activeTasks = filteredTasks.filter((task) => task.status !== "Done");
  const closedTasks = filteredTasks.filter((task) => task.status === "Done");

  return (
    <div style={{ padding: "20px" }}>
      <Title level={3}>Housekeeping Tasks</Title>
      <Space style={{ marginBottom: 20 }}>
        <Select
          placeholder="Select Room"
          style={{ width: 150 }}
          onChange={(value) => setFilters({ ...filters, room: value })}
        >
          {/* Populate room options dynamically from roomOptions state */}
          {roomOptions.map((roomNumber) => (
            <Option key={roomNumber} value={roomNumber}>
              {`Room ${roomNumber}`}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Select Task Name"
          style={{ width: 150 }}
          onChange={(value) => setFilters({ ...filters, taskName: value })}
        >
          <Option value="Cleaning">Cleaning</Option>
          <Option value="Room Service">Room Service</Option>
        </Select>
        <Select
          placeholder="Select Status"
          style={{ width: 150 }}
          onChange={(value) => setFilters({ ...filters, status: value })}
        >
          <Option value="Assigned">Assigned</Option>
          <Option value="Work In Progress">Work In Progress</Option>
          <Option value="Completed">Completed</Option>
        </Select>
        {/* Add similar Select components for Floor and Priority */}
        <Search
          placeholder="Search by ID or Name"
          onSearch={(value) => setFilters({ ...filters, search: value })}
          style={{ width: 200 }}
        />
      </Space>
      <Tabs defaultActiveKey="active" type="card">
        <TabPane tab="Active" key="active">
          {activeTasks
            .filter((task) =>
              Object.keys(filters).every(
                (key) =>
                  !filters[key] ||
                  task[key] === filters[key] ||
                  (key === "search" &&
                    (task.taskId.toString().includes(filters[key]) ||
                      task.customerName.includes(filters[key])))
              )
            )
            .sort(
              (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
            )
            .map((task) => renderCard(task))}
        </TabPane>
        <TabPane tab="Closed" key="closed">
          {closedTasks
            .filter((task) =>
              Object.keys(filters).every(
                (key) =>
                  !filters[key] ||
                  task[key] === filters[key] ||
                  (key === "search" &&
                    (task.taskId.toString().includes(filters[key]) ||
                      task.customerName.includes(filters[key])))
              )
            )
            .sort(
              (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
            )
            .map((task) => renderCard(task))}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Housekeeping;
