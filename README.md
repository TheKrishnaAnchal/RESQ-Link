# 🚨 RESQ-LINK | AI-Driven Disaster Response Platform

RESQ-LINK is a high-performance, mobile-first emergency SOS, incident reporting, and multi-agency dispatch coordination platform. Utilizing an advanced Model Context Protocol (MCP) architecture, the system ingests unstructured, multimodal disaster inputs, processes them via open-source LLMs, and optimizes real-time emergency routing and live location tracking over low-latency infrastructure.

---

## 🤖 AI & Context (LLM-Friendly)

This codebase is fully optimized for AI-to-AI collaboration. If you are developing, extending, or maintaining this system using an AI agent or assistant (e.g., Gemini, Claude, GPT-4o), please point them to these context configuration maps:
* [`llms.txt`](./llms.txt) — High-density, machine-readable project topology.
* [`project-context.md`](./project-context.md) — Comprehensive structural breakdown, state flow, and data schemas.

---

## 🚀 Key Features & Core Architecture

* **🧠 Model Context Protocol (MCP) Layer:** Bridges LLM orchestration with physical execution tools, automating multi-agency dispatch and calculating operational priority based on real-world situational data.
* **⚡ Multimodal Ingestion Pipeline:** Parses unstructured emergency data (text, user inputs) using open-source LLMs (Llama 3.1) and transforms it into strictly validated, structured relational schemas.
* **📍 Real-Time State Tracking & Geocoding:** Implements a high-throughput backend using **FastAPI** and persistent **WebSockets** for real-time reverse geocoding and ultra-low-latency tracking of victims and dispatch teams.
* **🗺️ Smart Routing & Distance Matrices:** Dynamically evaluates emergency infrastructure metrics to optimize route execution and reduce critical response times.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Backend Framework** | FastAPI (Python) |
| **Asynchronous Engine** | Persistent WebSockets (Low-Latency State Sync) |
| **AI Architecture** | Model Context Protocol (MCP), Llama 3.1 |
| **Location Intelligence**| Geospatial/Mapping APIs (Reverse Geocoding & Routing Matrices) |
| **Data Validation** | Pydantic (Strict Schema Enforcement) |

---

## 🧠 MCP Tool Layer (Operational Intelligence)

The core orchestration relies on decoupled, semantic tools exposed to the LLM agent via the MCP layer:

* `getAddressFromCoords`: Ingests telemetry coordinates to resolve exact physical incident perimeters.
* `findNearbyPlaces`: Queries critical structural infrastructure (hospitals, shelters, triage nodes) within the disaster radius.
* `evaluateDispatchOptions`: Maps resource capacity against real-time distance matrices to locate optimal emergency assets.
* `getOptimalRoute`: Computes turn-by-turn routing paths and adaptive ETAs under dynamically changing infrastructure conditions.

