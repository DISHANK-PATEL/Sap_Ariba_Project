require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

const {
  ARIBA_CLIENT_ID,
  ARIBA_CLIENT_SECRET,
  ARIBA_API_KEY,
  ARIBA_REALM,
  ARIBA_OAUTH_URL,
  ARIBA_BASE,
  GEMINI_API_KEY
} = process.env;

// Fetch OAuth token
async function getAccessToken() {
  const basicAuth = Buffer
    .from(`${ARIBA_CLIENT_ID}:${ARIBA_CLIENT_SECRET}`)
    .toString('base64');
  const resp = await axios.post(
    ARIBA_OAUTH_URL,
    'grant_type=client_credentials',
    { headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }}
  );
  return resp.data.access_token;
}

// Generic Ariba GET
async function aribaGet(endpoint, token) {
  const url = `${ARIBA_BASE}/${endpoint}?realm=${ARIBA_REALM}`;
  const resp = await axios.get(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'apikey': ARIBA_API_KEY,
      'Accept': 'application/json'
    }
  });
  return resp.data;
}

// Compose full data by Task→Workspace→RFXDocument
async function fetchEventData(taskId) {
  const token = await getAccessToken();
  const task = await aribaGet(`Task/${taskId}`, token);
  const workspaceId = task.workspaceId;
  if (!workspaceId) throw new Error('workspaceId not found');
  const workspace = await aribaGet(`Workspace/${workspaceId}`, token);

  let docId = workspace.rfxDocumentId || workspace.documentId;
  if (!docId && Array.isArray(workspace.documents)) {
    const doc = workspace.documents.find(d => d.entityType === 'RFXDocument');
    if (doc) docId = doc.id;
  }
  if (!docId) throw new Error('documentId not found');
  const rfx = await aribaGet(`RFXDocument/${docId}`, token);

  return { task, workspace, rfx };
}

// GET event data
app.get('/api/event/:taskId', async (req, res) => {
  try {
    const data = await fetchEventData(req.params.taskId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST chat summary
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, data, messages } = req.body;
    if (!data) return res.status(400).json({ error: 'Data payload is required' });
    if (!GEMINI_API_KEY) return res.status(500).json({ error: 'Gemini API key not set' });

    // Build conversation context
    let conversation = '';
    if (Array.isArray(messages) && messages.length > 0) {
      conversation = messages.map(m => `${m.sender === 'user' ? 'User' : 'AI'}: ${m.text}`).join('\n');
    }

    // New structured summary prompt with conversation
    const summaryPrompt = `
You are a procurement domain expert and business analyst. I will pass you a JSON object containing three sections: "task", "workspace", and "rfx", which describe a SAP Ariba sourcing event.

Your goal is to extract the most useful, actionable information for a non-technical stakeholder. Structure your response with clear headings and bullet lists, not long paragraphs.

1. **Event Overview**
   - Title, Task ID, Status, Display Status
   - Open Date → Close Date (convert epoch to human-readable)
   - Baseline Spend vs. Total Spend for Approval

2. **Key Participants & Roles**
   - Task Owner
   - Original Owner (group)
   - List of Approvers

3. **Custom Attributes & Configuration**
   - List each non-empty customFields value
   - Highlight any empty fields (e.g. arb_PaymentTerms)

4. **Document & Workspace Context**
   - Workspace Title and Entity Type
   - RFX Document Title and Entity Type
   - Regions and Organization involved

5. **Workflow & History Highlights**
   - Summarize the last three significant history actions (date, user, action)

6. **Top Line-Item Snapshot**
   - List first 3 items with quantity, unit price, total price; or note "No line-items present"

7. **Insights & Recommendations**
   - Identify missing data or configuration gaps
   - Call out potential risks (e.g. pending approvals)
   - Suggest next steps

Use headings and bullet lists—no long paragraphs.

JSON Data:
\`\`\`json
${JSON.stringify(data, null, 2)}
\`\`\`

Conversation so far:
${conversation}

User Question: ${prompt || 'Please summarize this event for me'}
`;

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(summaryPrompt);
    const apiResponse = await result.response;
    const text = await apiResponse.text();

    res.json({ text });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API listening on ${PORT}`));
