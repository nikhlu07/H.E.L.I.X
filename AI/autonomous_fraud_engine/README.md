# H.E.L.I.X. Autonomous Fraud Engine

## Overview

The H.E.L.I.X. Autonomous Fraud Engine is a sophisticated, self-healing, and adaptive system designed to detect and prevent procurement fraud in real-time. It leverages a modular architecture, combining a powerful Small Language Model (SLM) with a suite of autonomous components to provide a robust and intelligent fraud detection solution.

This engine is built to be highly resilient and transparent, with features like autonomous self-healing, continuous learning, and immutable audit trails on a blockchain backend.

## Features

-   **Autonomous Fraud Detection**: Real-time transaction screening using a Gemma-powered SLM via Langchain.
-   **Self-Healing Pipeline**: Automatically detects and remediates issues in the fraud detection pipeline, ensuring high availability and reliability.
-   **Continuous Learning**: Adapts to new fraud patterns by continuously learning from incoming data and investigation outcomes.
-   **Adaptive Thresholds**: Dynamically adjusts fraud detection thresholds based on performance metrics to balance precision and recall.
-   **Autonomous Investigation**: Automatically conducts in-depth investigations into suspicious activities, gathering and analyzing evidence from multiple sources.
-   **Immutable Evidence Management**: Preserves all evidence and audit trails on a blockchain for maximum integrity and transparency.
-   **Intelligent Resource Management**: Autonomously scales system resources up or down based on real-time load and predicted demand.
-   **Proactive Security**: Continuously hardens the system against emerging threats by scanning for vulnerabilities and applying patches automatically.
-   **Transparent Auditing**: Provides detailed, explainable audit reports for all autonomous decisions.
-   **Human-in-the-Loop**: Includes a robust framework for human oversight, review, and override of autonomous decisions.

## Architecture

The fraud engine is designed with a modular, service-oriented architecture. Each component is responsible for a specific aspect of the system, promoting separation of concerns and making the system easier to maintain and extend.

-   **`core/`**: Contains the main autonomous components of the system, including the decision engine, self-healing pipeline, learning engine, and more.
-   **`data/`**: Defines the data structures and enums used throughout the application.
-   **`services/`**: Houses both internal and external service integrations, such as the SLM, blockchain storage, and notification engines.
-   **`monitors/`**: Includes various health and performance monitors that feed into the self-healing pipeline.
-   **`utils/`**: Provides a collection of helper classes and utility functions.
-   **`investigation/`**: Contains the tools and analyzers used by the autonomous investigator.

## Getting Started

To run the autonomous fraud engine simulation, follow these steps:

### Prerequisites

-   Python 3.8+
-   Langchain and its dependencies (`pip install langchain langchain-community`)
-   A running Ollama instance with the `gemma3:4b` model pulled (`ollama pull gemma3:4b`)

### Running the Demo

1.  **Navigate to the project directory**:

    ```sh
    cd /path/to/your/project/H.E.L.I.X
    ```

2.  **Run the `demo.py` script**:

    ```sh
    python -m canisters.autonomous_fraud_engine.demo
    ```

This will start the simulation and print all output to the console, showcasing the end-to-end functionality of the autonomous fraud detection engine.

## Core Components

-   **`engine.py`**: The main entry point for the simulation, orchestrating the various components.
-   **`AutonomousDecisionEngine`**: Executes autonomous actions based on fraud assessments.
-   **`SelfHealingFraudPipeline`**: Monitors and maintains the health of the system.
-   **`AutonomousLearningEngine`**: Enables the system to learn and adapt over time.
-   **`AutonomousInvestigator`**: Conducts automated investigations into suspicious cases.
-   **`AutonomousTransactionGuard`**: Screens all incoming transactions for fraud.

## Technology Stack

-   **Python**: The core programming language.
-   **Langchain**: Used to build the SLM-powered fraud detection pipeline.
-   **Gemma3:4b**: The Small Language Model (SLM) used for fraud analysis.
-   **Ollama**: Powers the local inference of the Gemma model.
-   **asyncio**: For concurrent and asynchronous operations.

## Future Work

-   **Real-time Data Integration**: Connect the engine to a live stream of transaction data.
-   **Advanced Investigation Tools**: Enhance the autonomous investigator with more sophisticated analysis capabilities.
-   **Web-based Dashboard**: Create a user interface for monitoring the system and reviewing cases.
-   **Distributed Deployment**: Deploy the engine in a distributed environment for improved scalability and resilience.
