export type DeliveryType = "digital" | "physical" | "hybrid";

export type OrderStatus =
  | "PLACED"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "M1_SUBMITTED"
  | "REVISION_REQUESTED"
  | "FINAL_DELIVERED"
  | "COMPLETED"
  | "PARTNER_ASSIGNED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "DISPUTE_OPEN";

export const StatusLabel: Record<OrderStatus, string> = {
  PLACED: "Order Placed",
  ACCEPTED: "Seller Accepted",
  IN_PROGRESS: "Work Started",
  M1_SUBMITTED: "Milestone Submitted",
  REVISION_REQUESTED: "Revision Requested",
  FINAL_DELIVERED: "Final Delivered",
  COMPLETED: "Completed",
  PARTNER_ASSIGNED: "Partner Assigned",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  DISPUTE_OPEN: "Dispute Open",
};

export const Flow: Record<OrderStatus, OrderStatus[]> = {
  PLACED: ["ACCEPTED", "DISPUTE_OPEN"],
  ACCEPTED: ["IN_PROGRESS", "DISPUTE_OPEN"],
  IN_PROGRESS: ["M1_SUBMITTED", "FINAL_DELIVERED", "DISPUTE_OPEN"],
  M1_SUBMITTED: ["REVISION_REQUESTED", "FINAL_DELIVERED", "DISPUTE_OPEN"],
  REVISION_REQUESTED: ["IN_PROGRESS", "FINAL_DELIVERED", "DISPUTE_OPEN"],
  FINAL_DELIVERED: ["COMPLETED", "DISPUTE_OPEN"],
  COMPLETED: [],
  PARTNER_ASSIGNED: ["OUT_FOR_DELIVERY", "DISPUTE_OPEN"],
  OUT_FOR_DELIVERY: ["DELIVERED", "DISPUTE_OPEN"],
  DELIVERED: ["COMPLETED", "DISPUTE_OPEN"],
  DISPUTE_OPEN: ["COMPLETED"],
};

export const TrackingSequence = (deliveryType: DeliveryType): OrderStatus[] => {
  const base: OrderStatus[] = [
    "PLACED",
    "ACCEPTED",
    "IN_PROGRESS",
    "M1_SUBMITTED",
    "FINAL_DELIVERED",
    "COMPLETED",
  ];
  if (deliveryType === "digital") return base;
  if (deliveryType === "physical")
    return ["PLACED", "ACCEPTED", "PARTNER_ASSIGNED", "OUT_FOR_DELIVERY", "DELIVERED", "COMPLETED"];
  return [
    "PLACED",
    "ACCEPTED",
    "IN_PROGRESS",
    "M1_SUBMITTED",
    "FINAL_DELIVERED",
    "PARTNER_ASSIGNED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "COMPLETED",
  ];
};
