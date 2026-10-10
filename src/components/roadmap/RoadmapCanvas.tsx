"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  BackgroundVariant,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { RoadmapGraph, RoadmapNodeData } from "@/types/roadmap";
import { RoadmapNode } from "./RoadmapNode";
import { NodeDetailDrawer } from "./NodeDetailDrawer";
import { getLayoutedElements } from "@/lib/layout";
import { RotateCw, Compass, Download, Camera } from "lucide-react";
import { toPng } from "html-to-image";

const nodeTypes = {
  roadmapNode: RoadmapNode,
};

interface RoadmapCanvasProps {
  graph: RoadmapGraph;
  onUpdateGraph?: (updated: RoadmapGraph) => void;
}

export const RoadmapCanvas: React.FC<RoadmapCanvasProps> = ({
  graph,
  onUpdateGraph,
}) => {
  const [selectedNodeData, setSelectedNodeData] = useState<RoadmapNodeData | null>(null);
  const [direction, setDirection] = useState<"LR" | "TB">("LR");

  // Transform raw roadmap graph into ReactFlow nodes and edges
  const initialElements = useMemo(() => {
    const rawNodes: Node<RoadmapNodeData>[] = graph.nodes.map((n) => ({
      id: n.id,
      type: "roadmapNode",
      data: n,
      position: { x: 0, y: 0 },
    }));

    const rawEdges: Edge[] = graph.edges.map((e) => {
      const sourceNode = graph.nodes.find((n) => n.id === e.source);
      const isSourceCompleted = sourceNode?.status === "completed";

      return {
        id: e.id,
        source: e.source,
        target: e.target,
        animated: isSourceCompleted,
        style: {
          stroke: isSourceCompleted ? "#10b981" : "#475569",
          strokeWidth: isSourceCompleted ? 2.5 : 1.5,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isSourceCompleted ? "#10b981" : "#475569",
        },
      };
    });

    return getLayoutedElements(rawNodes, rawEdges, direction);
  }, [graph, direction]);

  const [nodes, setNodes] = useState<Node<RoadmapNodeData>[]>(initialElements.nodes);
  const [edges, setEdges] = useState<Edge[]>(initialElements.edges);

  useEffect(() => {
    setNodes(initialElements.nodes);
    setEdges(initialElements.edges);
  }, [initialElements]);

  const onNodesChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (changes: NodeChange<any>[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange<Edge>[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onNodeClick = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (_: React.MouseEvent, node: Node<any>) => {
      setSelectedNodeData(node.data as RoadmapNodeData);
    },
    []
  );

  // Dynamic Re-routing & Prerequisite Unlocking Algorithm
  const handleToggleComplete = useCallback(
    (nodeId: string) => {
      const updatedNodes = graph.nodes.map((node) => {
        if (node.id === nodeId) {
          const newStatus = node.status === "completed" ? "unlocked" : "completed";
          return { ...node, status: newStatus as RoadmapNodeData["status"] };
        }
        return node;
      });

      // Recalculate downstream unlocking
      const completedIds = new Set(
        updatedNodes.filter((n) => n.status === "completed").map((n) => n.id)
      );

      const recalibratedNodes = updatedNodes.map((node) => {
        if (node.status === "completed") return node;

        // Check if all prerequisites are satisfied
        const allPrereqsDone =
          node.prerequisites.length === 0 ||
          node.prerequisites.every((prereqId) => completedIds.has(prereqId));

        return {
          ...node,
          status: (allPrereqsDone ? "unlocked" : "locked") as RoadmapNodeData["status"],
        };
      });

      const updatedGraph: RoadmapGraph = {
        ...graph,
        nodes: recalibratedNodes,
      };

      if (onUpdateGraph) {
        onUpdateGraph(updatedGraph);
      }

      // Keep drawer in sync
      const currentSelected = recalibratedNodes.find((n) => n.id === nodeId);
      if (currentSelected) {
        setSelectedNodeData(currentSelected);
      }
    },
    [graph, onUpdateGraph]
  );

  const toggleDirection = () => {
    setDirection((prev) => (prev === "LR" ? "TB" : "LR"));
  };

  const [exporting, setExporting] = useState(false);

  const handleExportPng = useCallback(() => {
    const viewportElement = document.querySelector(".react-flow__viewport") as HTMLElement;
    if (!viewportElement) return;

    setExporting(true);
    toPng(viewportElement, {
      backgroundColor: "#020617",
      quality: 0.95,
      pixelRatio: 2,
    })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${graph.metadata.targetRole.toLowerCase().replace(/[^a-z0-9]/g, "-")}-roadmap.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error("Export PNG failed:", err);
      })
      .finally(() => {
        setExporting(false);
      });
  }, [graph.metadata.targetRole]);

  return (
    <div className="relative w-full h-[680px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/80 shadow-2xl">
      {/* Top Bar inside canvas */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 backdrop-blur-md bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={toggleDirection}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors font-medium"
        >
          <RotateCw className="w-3.5 h-3.5 text-indigo-400" />
          Layout: {direction === "LR" ? "Horizontal" : "Vertical"}
        </button>

        <button
          onClick={handleExportPng}
          disabled={exporting}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors font-medium disabled:opacity-50"
        >
          <Camera className="w-3.5 h-3.5 text-emerald-400" />
          {exporting ? "Exporting..." : "Save Image"}
        </button>

        <span className="text-slate-600">|</span>

        <span className="px-2 text-slate-400 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          Interactive Skill Canvas (Zoom & Pan)
        </span>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.2}
        maxZoom={1.5}
        className="touch-none"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#334155" />
        <Controls className="!bg-slate-900 !border-slate-800 !text-slate-200 !rounded-xl !shadow-xl [&>button]:!border-slate-800 [&>button]:!bg-slate-900 [&>button]:hover:!bg-slate-800" />
        <MiniMap
          nodeColor={(n) => {
            const data = n.data as unknown as RoadmapNodeData;
            if (data?.status === "completed") return "#10b981";
            if (data?.status === "unlocked") return "#06b6d4";
            return "#475569";
          }}
          maskColor="rgba(15, 23, 42, 0.7)"
          className="!bg-slate-900/80 !border-slate-800 !rounded-xl overflow-hidden !shadow-lg"
        />
      </ReactFlow>

      {/* Slide-over Node Inspector */}
      <NodeDetailDrawer
        node={selectedNodeData}
        onClose={() => setSelectedNodeData(null)}
        onToggleComplete={handleToggleComplete}
      />
    </div>
  );
};
