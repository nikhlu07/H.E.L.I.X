import asyncio
import random
import hashlib
import json
import logging
from datetime import datetime
from typing import Dict, Any, List

# Langchain imports
from langchain_community.chat_models import ChatOllama
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate

logger = logging.getLogger(__name__)

class SLM:
    def __init__(self):
        self.model = ChatOllama(model="gemma3:4b")
        self.parser = JsonOutputParser()
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a fraud detection expert. Analyze the following transaction and provide a risk score between 0.0 and 1.0. Respond with only a JSON object with keys 'risk_score', 'reasoning', and 'confidence'."),
            ("user", "{transaction_data}")
        ])
        self.chain = self.prompt | self.model | self.parser
        self.model_loaded = True
        self.confidence_threshold = 0.8

    async def analyze_with_context(self, document: Dict, context: Dict, temperature: float = 0.1) -> Dict:
        data = {
            "document": document,
            "context": context
        }
        try:
            response = await self.chain.ainvoke({"transaction_data": json.dumps(data)})
            response["risk_factors"] = [] # The prompt doesn't ask for this, so I'll add it.
            return response
        except Exception as e:
            logger.error(f"Error calling SLM: {e}")
            return {
                "risk_score": 0.0,
                "reasoning": "Error analyzing with SLM.",
                "confidence": 0.0,
                "risk_factors": []
            }

    async def analyze_fraud_risk(self, claim_data: Dict, context: Dict, reasoning_mode: str = "step_by_step") -> Dict:
        data = {
            "claim_data": claim_data,
            "context": context,
            "reasoning_mode": reasoning_mode
        }
        try:
            response = await self.chain.ainvoke({"transaction_data": json.dumps(data)})
            response["analysis_method"] = reasoning_mode
            return response
        except Exception as e:
            logger.error(f"Error calling SLM: {e}")
            return {
                "risk_score": 0.0,
                "reasoning": "Error analyzing fraud risk with SLM.",
                "confidence": 0.0,
                "analysis_method": reasoning_mode
            }

class SingleStoreClient:
    def __init__(self):
        self.vectors = []
        self.metadata = []

    async def similarity_search(self, embedding: List[float], threshold: float = 0.8, limit: int = 10) -> List[Dict]:
        # Mock vector similarity search
        await asyncio.sleep(0.02)  # Simulate DB query time

        # Generate mock similar cases
        similar_cases = []
        for i in range(min(limit, 5)):  # Return up to 5 similar cases
            case = {
                "case_id": f"case_{i + 1}",
                "similarity_score": random.uniform(threshold, 1.0),
                "fraud_confirmed": random.choice([True, False]),
                "amount": random.randint(100000, 10000000),
                "description": f"Similar fraud case {i + 1}"
            }
            similar_cases.append(case)

        return similar_cases


class ICPBlockchainStorage:
    def __init__(self):
        self.stored_records = []

    async def store_evidence(self, record: Dict[str, Any]) -> Dict[str, str]:
        await asyncio.sleep(0.1)  # Simulate blockchain write time

        record_id = f"icp_{hashlib.md5(str(record).encode()).hexdigest()[:16]}"
        stored_record = {
            "record_id": record_id,
            "timestamp": datetime.now().isoformat(),
            "block_height": random.randint(1000000, 9999999),
            "transaction_hash": f"tx_{hashlib.sha256(str(record).encode()).hexdigest()[:32]}",
            "data": record
        }

        self.stored_records.append(stored_record)
        logger.info(f"Stored evidence on blockchain: {record_id}")

        return {"record_id": record_id, "transaction_hash": stored_record["transaction_hash"]}
