import { Book } from 'lucide-react';

export const TroubleshootingSection = () => {
  return (
    <section id="troubleshooting" className="mb-12 scroll-mt-20">
      <div className="flex items-center mb-6">
        <Book className="h-8 w-8 text-blue-600 mr-3" />
        <h2 className="text-3xl font-bold text-gray-900">Troubleshooting</h2>
      </div>

      <div id="setup-issues" className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Common Setup Issues</h3>
        
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start">
              <div className="bg-red-100 text-red-600 rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                ⚠️
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg text-gray-900 mb-2">Ollama Not Found</h4>
                <p className="text-gray-700 mb-3"><strong>Problem:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-sm">ollama: command not found</code></p>
                <p className="text-gray-700 mb-2"><strong>Solution:</strong></p>
                <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-sm">
                  <pre>{`# Install Ollama from https://ollama.ai/
# macOS/Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Verify installation
ollama --version

# Pull required models
ollama pull gemma3:4b
ollama pull nomic-embed-text`}</pre>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start">
              <div className="bg-red-100 text-red-600 rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                ⚠️
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg text-gray-900 mb-2">Port Already in Use</h4>
                <p className="text-gray-700 mb-3"><strong>Problem:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-sm">Error: Port 8000 already in use</code></p>
                <p className="text-gray-700 mb-2"><strong>Solution:</strong></p>
                <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-sm">
                  <pre>{`# Find process using port
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or use different port
uvicorn app.main:app --port 8001`}</pre>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start">
              <div className="bg-red-100 text-red-600 rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                ⚠️
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg text-gray-900 mb-2">Node Modules Issues</h4>
                <p className="text-gray-700 mb-3"><strong>Problem:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-sm">Module not found</code> errors</p>
                <p className="text-gray-700 mb-2"><strong>Solution:</strong></p>
                <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-sm">
                  <pre>{`# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install`}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="deployment-issues" className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Deployment Issues</h3>
        
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start">
              <div className="bg-orange-100 text-orange-600 rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                🔧
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg text-gray-900 mb-2">Docker Build Fails</h4>
                <p className="text-gray-700 mb-3"><strong>Problem:</strong> Docker build errors</p>
                <p className="text-gray-700 mb-2"><strong>Solution:</strong></p>
                <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-sm">
                  <pre>{`# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache

# Check Docker logs
docker-compose logs backend`}</pre>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start">
              <div className="bg-orange-100 text-orange-600 rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                🔧
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg text-gray-900 mb-2">ICP Deployment Fails</h4>
                <p className="text-gray-700 mb-3"><strong>Problem:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-sm">Insufficient cycles</code> error</p>
                <p className="text-gray-700 mb-2"><strong>Solution:</strong></p>
                <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-sm mb-3">
                  <pre>{`# Check cycles balance
dfx wallet balance

# Deploy with specific cycles
dfx deploy --with-cycles 1000000000000`}</pre>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Visit <a href="https://nns.ic0.app" className="underline font-semibold">https://nns.ic0.app</a> to convert ICP to cycles
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="faq" className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
        
        <div className="space-y-4">
          {[
            {
              q: "Can I use H.E.L.I.X. without Internet Identity?",
              a: "Yes, use Simple II Demo mode or Demo mode for testing. For production, Internet Identity is recommended for security."
            },
            {
              q: "How do I add a new user role?",
              a: "1. Add role to UserRole enum in types\n2. Update RBAC permissions in backend\n3. Create role-specific dashboard in frontend\n4. Update canister RBAC logic"
            },
            {
              q: "Can I use a different LLM instead of Gemma 3?",
              a: "Yes, modify ml_detector.py to use different Ollama models or API-based LLMs like GPT-4 or Claude."
            },
            {
              q: "How do I backup blockchain data?",
              a: "Canister data is automatically replicated across ICP nodes. For additional backup:\ndfx canister call procurement export_data > backup.json"
            },
            {
              q: "What's the cost of running on ICP mainnet?",
              a: "Costs vary based on usage. Estimate:\n• Storage: ~$5/GB/year\n• Compute: ~$0.50/million instructions\n• Typical monthly cost: $10-50 for small deployments"
            },
            {
              q: "How do I update fraud detection rules?",
              a: "Edit AI/fraud_engine/rules_engine.py, add new rules to the _initialize_rules() method, and restart the fraud engine."
            },
            {
              q: "Is there a mobile app?",
              a: "Not yet. Mobile apps (iOS/Android) are planned for Phase 2 (Q2 2025). The web app is mobile-responsive."
            },
          ].map((faq, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h4 className="font-semibold text-lg text-gray-900 mb-3">Q: {faq.q}</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-line">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
        <h4 className="font-semibold text-lg mb-3">💬 Need More Help?</h4>
        <p className="text-gray-700 mb-4">
          If you can't find the answer to your question, reach out to our community:
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <a
            href="https://github.com/nikhlu07/H.E.L.I.X/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <p className="font-semibold text-gray-900">GitHub Issues</p>
            <p className="text-sm text-gray-600">Report bugs</p>
          </a>
          <a
            href="https://github.com/nikhlu07/H.E.L.I.X/discussions"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <p className="font-semibold text-gray-900">Discussions</p>
            <p className="text-sm text-gray-600">Ask questions</p>
          </a>
          <a
            href="mailto:support@helix-project.org"
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <p className="font-semibold text-gray-900">Email Support</p>
            <p className="text-sm text-gray-600">Direct contact</p>
          </a>
        </div>
      </div>
    </section>
  );
};
