"""
Machine Learning Fraud Detection Module
Utilizes a dynamic RAG pipeline that incorporates rule-based analysis for hybrid fraud detection.
"""

import logging
from typing import List, Dict, Any

# LangChain and vector store components
from langchain_ollama import OllamaLLM, OllamaEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.prompts import PromptTemplate
from langchain.schema import Document
from langchain.schema.output_parser import StrOutputParser
from langchain.schema.runnable import RunnablePassthrough

logger = logging.getLogger(__name__)

class MLFraudDetector:
    """
    ML fraud detector that builds a dynamic RAG pipeline, enhanced with inputs
    from a traditional rules engine for more accurate, context-aware predictions.
    """

    def __init__(self):
        self.model_version = "gemma-ollama-hybrid-rag-1.0"
        logger.info(f"MLFraudDetector initialized with version: {self.model_version}")

    def predict_fraud_probability(self, claim: Any, historical_data: List[Any], rules_analysis: Any, use_rag: bool = False) -> float:
        """
        Builds a dynamic RAG pipeline that considers both historical data and the
        output of a rules engine to predict fraud probability.
        The RAG functionality can be disabled.
        """
        if not historical_data and use_rag:
            logger.warning("No historical data for RAG context, but RAG is enabled.")

        try:
            logger.info(f"Building dynamic hybrid pipeline for claim {claim.claim_id} (RAG enabled: {use_rag})...")

            # 1. Create documents for the vector store from historical claims
            documents = [
                Document(
                    page_content=f"Historical claim in '{c.area}' for amount {c.amount:.2f}",
                    metadata={'area': c.area, 'amount': c.amount}
                ) for c in historical_data
            ]
            retriever = FAISS.from_documents(documents, OllamaEmbeddings(model="nomic-embed-text")).as_retriever() if documents else None

            # 2. Define the enhanced RAG prompt template
            template = """
            **System Prompt:** You are an expert fraud detection analyst.
            Your task is to provide a final, definitive fraud probability score.
            You will be given a primary analysis from a rules-based system and retrieved historical context.
            Your response MUST be a single floating-point number between 0.0 and 1.0.

            **Primary Analysis (from Rules Engine):**
            - Flags Triggered: {rules_flags}
            - Reasoning: {rules_reasoning}

            **Retrieved Context (Similar Historical Claims):**
            {context}

            **New Claim to Analyze:**
            - Amount: {amount}
            - Area: {area}

            **Analysis Task:**
            Synthesize all the information to produce a final fraud score.
            If the rule flags are severe (e.g., DUPLICATE_INVOICE, SHELL_COMPANY), the score should be high (>0.85).
            If the claim amount is a major outlier compared to the context, that also increases the score.
            If the rule flags are minor and the amount is consistent with the context, the score should be lower.

            **Final Fraud Probability Score:**
            """
            prompt = PromptTemplate(template=template, input_variables=["context", "rules_flags", "rules_reasoning", "amount", "area"])

            # 3. Initialize the Ollama LLM
            llm = OllamaLLM(model="gemma3:4b")

            # 4. Prepare the input for the chain
            chain_input = {
                "amount": claim.amount,
                "area": claim.area,
                "rules_flags": ", ".join(rules_analysis.flags) if rules_analysis.flags else "None",
                "rules_reasoning": rules_analysis.reasoning
            }

            # 5. Build and invoke the LCEL RAG chain
            rag_chain = (
                RunnablePassthrough.assign(
                    context=lambda x: retriever.invoke(f"Claim in {x['area']}") if use_rag and retriever else "Context from RAG is not available."
                )
                | prompt
                | llm
                | StrOutputParser()
            )

            response_text = rag_chain.invoke(chain_input)
            
            # 6. Parse the response
            fraud_prob = float(response_text.strip())
            logger.info(f"Hybrid pipeline executed. Predicted fraud probability: {fraud_prob}")
            
            return max(0.0, min(1.0, fraud_prob))

        except Exception as e:
            logger.error(f"Hybrid RAG prediction failed: {e}. Is Ollama running?")
            return 0.5  # Return neutral score on error

    def get_model_stats(self) -> Dict[str, any]:
        """Get basic model statistics."""
        return {
            "model_version": self.model_version,
            "pipeline_strategy": "Dynamic Hybrid (Rules + LLM) with optional RAG, built on-demand",
        }
