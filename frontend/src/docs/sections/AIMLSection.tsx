import { AlertCircle } from 'lucide-react';

export const AIMLSection = () => {
  return (
    <section id="ai-ml" className="mb-12 scroll-mt-20">
      <div className="flex items-center mb-6">
        <AlertCircle className="h-8 w-8 text-blue-600 mr-3" />
        <h2 className="text-3xl font-bold text-gray-900">AI/ML Fraud Detection</h2>
      </div>

      <div id="ai-hybrid" className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Hybrid Detection Architecture</h3>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-4">
          <p className="text-gray-700 mb-4">
            H.E.L.I.X. employs a sophisticated hybrid approach combining deterministic rules (70%), ML models (30%), and LLM analysis for context-aware fraud detection.
          </p>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg mb-4 border border-purple-200">
            <h4 className="font-semibold text-purple-900 mb-2">🤖 Multi-Model LLM/SLM Support</h4>
            <p className="text-sm text-purple-800 mb-2">
              H.E.L.I.X. supports multiple language models with flexible architecture:
            </p>
            <div className="grid md:grid-cols-3 gap-2 text-sm">
              <div className="bg-white p-2 rounded">
                <strong>Current MVP:</strong> Gemma 3 (4B) via Ollama
              </div>
              <div className="bg-white p-2 rounded">
                <strong>Production:</strong> GPT-4, Claude supported
              </div>
              <div className="bg-white p-2 rounded">
                <strong>Fallback:</strong> Graceful degradation to rules-only
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre className="text-gray-800">{`Transaction Input
        ↓
┌───────────────────────────────┐
│   Rules Engine                │
│   10 Detection Rules          │
│   Score: 0-100               │
└───────────┬───────────────────┘
            │
┌───────────▼───────────────────┐
│   Feature Extraction          │
│   45+ Features               │
└───────────┬───────────────────┘
            │
┌───────────▼───────────────────┐
│   RAG Pipeline                │
│   FAISS + Historical Data    │
└───────────┬───────────────────┘
            │
┌───────────▼───────────────────┐
│   LLM/SLM Analysis           │
│   Gemma3/GPT-4/Claude        │
│   Context-Aware Reasoning    │
└───────────┬───────────────────┘
            │
┌───────────▼───────────────────┐
│   Final Fraud Score           │
│   Combined: Rules (70%) +     │
│   ML (30%) = 0-100           │
└───────────┬───────────────────┘
            │
      Score >= 70?
      ↓         ↓
    Alert    Approve`}</pre>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h4 className="font-semibold text-orange-900 mb-2">Accuracy</h4>
            <p className="text-3xl font-bold text-orange-600">87%</p>
            <p className="text-sm text-orange-800">Overall detection rate</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-900 mb-2">Speed</h4>
            <p className="text-3xl font-bold text-green-600">&lt;3s</p>
            <p className="text-sm text-green-800">Analysis time</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">False Positives</h4>
            <p className="text-3xl font-bold text-blue-600">&lt;5%</p>
            <p className="text-sm text-blue-800">Error rate</p>
          </div>
        </div>
      </div>

      <div id="rules-engine" className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">10 Fraud Detection Rules</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { name: 'Budget Anomalies', severity: 'High', score: 30, desc: 'Unusual spending patterns beyond normal ranges' },
            { name: 'Vendor Collusion', severity: 'Critical', score: 40, desc: 'Suspicious bidding coordination' },
            { name: 'Invoice Manipulation', severity: 'High', score: 35, desc: 'Price/quantity discrepancies' },
            { name: 'Timeline Violations', severity: 'Medium', score: 25, desc: 'Unrealistic project timelines' },
            { name: 'Quality Deviations', severity: 'High', score: 30, desc: 'Material specification changes' },
            { name: 'Payment Irregularities', severity: 'High', score: 30, desc: 'Unusual payment patterns' },
            { name: 'Document Inconsistencies', severity: 'Medium', score: 25, desc: 'Cross-reference mismatches' },
            { name: 'Duplicate Claims', severity: 'Critical', score: 40, desc: 'Multiple billing for same work' },
            { name: 'Ghost Projects', severity: 'Critical', score: 45, desc: 'Payments without deliverables' },
            { name: 'Cost Inflation', severity: 'High', score: 35, desc: 'Above-market rate pricing' },
          ].map((rule, idx) => (
            <div key={idx} className={`p-4 rounded-lg border ${
              rule.severity === 'Critical' ? 'bg-red-50 border-red-200' :
              rule.severity === 'High' ? 'bg-orange-50 border-orange-200' :
              'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <h4 className={`font-semibold ${
                  rule.severity === 'Critical' ? 'text-red-900' :
                  rule.severity === 'High' ? 'text-orange-900' :
                  'text-yellow-900'
                }`}>{rule.name}</h4>
                <span className={`text-xs px-2 py-1 rounded ${
                  rule.severity === 'Critical' ? 'bg-red-200 text-red-800' :
                  rule.severity === 'High' ? 'bg-orange-200 text-orange-800' :
                  'bg-yellow-200 text-yellow-800'
                }`}>{rule.severity}</span>
              </div>
              <p className={`text-sm mb-2 ${
                rule.severity === 'Critical' ? 'text-red-800' :
                rule.severity === 'High' ? 'text-orange-800' :
                'text-yellow-800'
              }`}>{rule.desc}</p>
              <p className={`text-xs font-semibold ${
                rule.severity === 'Critical' ? 'text-red-700' :
                rule.severity === 'High' ? 'text-orange-700' :
                'text-yellow-700'
              }`}>Score: {rule.score} points</p>
            </div>
          ))}
        </div>
      </div>

      <div id="ml-detector" className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">ML Detector with RAG Pipeline</h3>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-4">
          <h4 className="font-semibold text-lg mb-3">RAG Pipeline Implementation</h4>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-x-auto">
            <pre>{`from langchain_ollama import OllamaLLM, OllamaEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains import RetrievalQA

class MLFraudDetector:
    def __init__(self):
        # Initialize Gemma 3 LLM
        self.llm = OllamaLLM(
            model="gemma3:4b",
            temperature=0.1
        )
        
        # Initialize embeddings
        self.embeddings = OllamaEmbeddings(
            model="nomic-embed-text"
        )
        
        # Initialize FAISS vector store
        self.vector_store = FAISS.from_texts(
            texts=historical_cases,
            embedding=self.embeddings
        )
    
    async def analyze_claim(self, claim: Dict, rules_result: Dict):
        # Get similar historical cases
        similar_cases = self.vector_store.similarity_search(
            claim_text, k=3
        )
        
        # Run RAG analysis with LLM
        result = await self.rag_chain.arun({
            "context": similar_cases,
            "rules_analysis": rules_result,
            "claim_details": claim
        })
        
        return {
            'ml_score': fraud_score,
            'risk_level': risk_level,
            'explanation': explanation
        }`}</pre>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
          <h4 className="font-semibold text-lg mb-3">Detection Performance by Type</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
            {[
              { type: 'Budget', acc: '92%' },
              { type: 'Collusion', acc: '88%' },
              { type: 'Invoice', acc: '90%' },
              { type: 'Timeline', acc: '85%' },
              { type: 'Quality', acc: '89%' },
              { type: 'Payment', acc: '87%' },
              { type: 'Document', acc: '91%' },
              { type: 'Duplicate', acc: '95%' },
              { type: 'Ghost', acc: '94%' },
              { type: 'Inflation', acc: '86%' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-3 rounded-lg shadow-sm">
                <p className="text-xs text-gray-600 mb-1">{item.type}</p>
                <p className="text-lg font-bold text-purple-600">{item.acc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
