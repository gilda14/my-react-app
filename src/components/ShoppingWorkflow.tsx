// src/components/ShoppingWorkflow.tsx

import { ReactFlow, Background, Controls, MiniMap } from "@xyflow/react";
import type { Node, Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const nodes: Node[] = [
  {
    id: "1",
    position: { x: 0, y: 100 },
    data: { label: "Browse Products" },
  },
  {
    id: "2",
    position: { x: 250, y: 100 },
    data: { label: "View Product Details" },
  },
  {
    id: "3",
    position: { x: 500, y: 100 },
    data: { label: "Add to Cart" },
  },
  {
    id: "4",
    position: { x: 750, y: 100 },
    data: { label: "Checkout" },
  },
  {
    id: "5",
    position: { x: 1000, y: 100 },
    data: { label: "Payment" },
  },
  {
    id: "6",
    position: { x: 1250, y: 100 },
    data: { label: "Order Complete" },
  },
];

const edges: Edge[] = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3" },
  { id: "e3-4", source: "3", target: "4" },
  { id: "e4-5", source: "4", target: "5" },
  { id: "e5-6", source: "5", target: "6" },
];

export default function ShoppingWorkflow() {
  return (
    <div style={{ width: "100%", height: "600px" }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
