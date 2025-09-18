# CorruptGuard Fraud Detection Engine

**AI-powered fraud detection for government procurement**

CorruptGuard is a standalone Python service designed to detect and prevent corruption in government procurement processes. It uses a sophisticated combination of a rule-based engine and machine learning to analyze procurement claims and identify suspicious activities in real-time.

## Features

- **Hybrid Detection Approach:** Combines a powerful rule-based engine with an advanced machine learning module for comprehensive fraud detection.
- **Real-time Analysis:** Analyzes procurement claims as they are submitted, providing immediate feedback and risk assessment.
- **Sophisticated Rule Engine:** Implements a wide range of fraud detection rules based on real-world corruption patterns, including financial anomalies, vendor behavior analysis, and timeline analysis.
- **Machine Learning-powered Anomaly Detection:** Utilizes an Isolation Forest model for unsupervised anomaly detection and a RandomForestClassifier for supervised classification, identifying complex and evolving fraud patterns.
- **Comprehensive API:** Offers a set of RESTful API endpoints for claim analysis, statistics, and system health monitoring.
- **Continuous Learning:** The machine learning model can be retrained with new data to adapt to emerging fraud tactics.
- **Detailed Explanations:** Provides clear and concise explanations for fraud scores, helping investigators understand the reasoning behind the alerts.

## Architecture

The CorruptGuard Fraud Detection Engine is composed of three main components:

1.  **FastAPI Application (`main.py`):** This is the main entry point of the service. It exposes a set of API endpoints for interacting with the fraud detection engine, handles request and response validation, and orchestrates the analysis process.

2.  **Fraud Rules Engine (`rules_engine.py`):** This component implements a set of predefined rules to detect common fraud patterns. It analyzes claims based on a variety of factors, including cost variance, round numbers, vendor history, and timeline anomalies.

3.  **Machine Learning Detector (`ml_detector.py`):** This module uses machine learning to identify complex and subtle fraud patterns that may not be caught by the rules engine. It consists of two models:
    *   An **Isolation Forest** model for unsupervised anomaly detection.
    *   A **RandomForestClassifier** for supervised classification of fraudulent claims.

The service works by first analyzing a claim with the rules engine, then feeding the results and other claim features into the machine learning module for a more in-depth analysis. The final fraud score is a combination of the outputs from both components.

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/corruptguard.git
    cd corruptguard
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install the dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

## Usage

To start the fraud detection engine, run the following command:

```bash
./start_fraud_engine.sh
```

This will start the FastAPI server on `http://localhost:8080`.

## API Endpoints

The following are the main API endpoints provided by the service:

-   `POST /analyze-claim`: Analyzes a procurement claim for fraud indicators.
-   `GET /claim/{claim_id}/score`: Retrieves the fraud score for a specific claim.
-   `GET /alerts/active`: Returns a list of active fraud alerts.
-   `GET /stats/fraud`: Provides comprehensive fraud detection statistics.
-   `POST /retrain-model`: Retrains the machine learning model with the latest data.
-   `GET /health`: Checks the health of the service.
-   `GET /`: Returns basic information about the service.

For detailed information about the API, including request and response models, please refer to the OpenAPI documentation available at `http://localhost:8080/docs`.

## Rules Engine

The rules engine (`rules_engine.py`) contains a set of `FraudRule` objects, each representing a specific fraud pattern. The engine analyzes a claim against these rules and calculates a fraud score based on the number and severity of the triggered rules.

The main rules categories are:

-   **Financial Patterns:** Detects anomalies in the financial aspects of a claim, such as cost variance, round numbers, and budget maxing.
-   **Vendor Behavior:** Analyzes the behavior of the vendor, looking for patterns such as new vendors with high-value claims, unusual vendor frequency, and signs of shell companies.
-   **Timeline and Process:** Identifies suspicious timing patterns, such as rushed approvals and submissions outside of business hours.
-   **Geographic and Project:** Looks for mismatches between the vendor's location and the project area, and other signs of phantom projects.
-   **Document and Invoice:** Detects duplicate or anomalous invoices.

## Machine Learning Module

The machine learning module (`ml_detector.py`) uses a two-pronged approach to fraud detection:

1.  **Anomaly Detection:** An `IsolationForest` model is used to identify claims that are outliers compared to the historical data. This is an unsupervised approach that can detect novel and unusual fraud patterns.

2.  **Classification:** A `RandomForestClassifier` is trained on labeled data to classify claims as fraudulent or legitimate. This is a supervised approach that learns from past examples of fraud.

The module prepares a comprehensive set of features for each claim, including amount-based features, vendor-based features, temporal features, and project-based features. The final fraud probability is a combination of the scores from both the anomaly detection and classification models.

## Dependencies

The project's dependencies are listed in the `requirements.txt` file. The main dependencies are:

-   `fastapi`: For building the API.
-   `uvicorn`: For running the FastAPI server.
-   `httpx`: For making asynchronous HTTP requests.
-   `numpy`: For numerical operations.
-   `scikit-learn`: For the machine learning models.
-   `joblib`: For saving and loading the trained models.
