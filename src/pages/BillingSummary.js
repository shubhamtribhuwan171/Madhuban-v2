import React from "react";
import { Card, Typography, Divider } from "antd";
import styled from "styled-components";

const { Title, Text } = Typography;

const BillingSummary = ({
  bookingDetails,
  transactions,
  totalRoomCharges,
  totalAddonCharges,
  paidAmount,
  pendingAmount,
}) => {
  const calculateTotal = () => {
    const roomTotal = totalRoomCharges;
    const gst = roomTotal * 0.18;
    const subtotal = roomTotal + totalAddonCharges + gst;
    const grandTotal = subtotal;
    return {
      roomTotal,
      gst,
      subtotal,
      grandTotal,
    };
  };

  const totals = calculateTotal();

  return (
    <StyledCard>
      <Title level={4}>Billing Summary</Title>
      <StyledList>
        <ListItem>
          <Label>Total Room Charges:</Label>
          <Value>₹ {totals.roomTotal.toFixed(2)}</Value>
        </ListItem>
        <ListItem>
          <Label>GST (18%):</Label>
          <Value>₹ {totals.gst.toFixed(2)}</Value>
        </ListItem>
        <Divider />
        <ListItem>
          <Label>Subtotal:</Label>
          <Value strong>₹ {totals.subtotal.toFixed(2)}</Value>
        </ListItem>
        <ListItem>
          <Label>Grand Total:</Label>
          <Value strong color="#1890ff">
            ₹ {totals.grandTotal.toFixed(2)}
          </Value>
        </ListItem>
        <Divider />
        <ListItem>
          <Label>Amount Paid:</Label>
          <Value strong color="#52c41a">
            ₹ {paidAmount.toFixed(2)}
          </Value>
        </ListItem>
        <ListItem>
          <Label>Amount Pending:</Label>
          <Value strong color="#f5222d">
            ₹ {pendingAmount.toFixed(2)}
          </Value>
        </ListItem>
      </StyledList>
    </StyledCard>
  );
};

const StyledCard = styled(Card)`
  width: 350px;
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  background-color: #f8f8f8;
`;

const StyledList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
`;

const Label = styled(Text)`
  font-weight: ${(props) => (props.strong ? "bold" : "normal")};
  color: #333;
  font-size: 14px;
`;

const Value = styled(Text)`
  font-weight: ${(props) => (props.strong ? "bold" : "normal")};
  color: ${(props) => props.color || "#333"};
  font-size: 16px;
`;

export default BillingSummary;
