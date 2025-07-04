✅ What’s Done

    Data Ingestion & Display

        Successfully fetch sourcing-event JSON (Task→Workspace→RFXDocument) from the Ariba APIs.

        Render raw and structured fields in the React frontend.

    AI Chat Integration

        Piped fetched data into the Gemini 2.5 Flash endpoint.

        Users can ask free-form questions about the event inside the app.

🔄 In Progress

    LLM Optimization

        Improving prompt engineering and context-management to handle larger data volumes.

        Evaluating model upgrades (e.g. Gemini Pro / GPT-4 Turbo 32K) for high-capacity scenarios.

    Export & Reporting Features

        AI Chat Download: capture and save entire chat transcript.

        AI Summary Download: export the model’s structured summary.

        Multi-Format Reports: CSV, JSON, PDF, and Markdown exports of both raw data and AI-generated insights.

    Interactive Analytics

        Build dynamic charts (bar, line, pie) with real-time filtering.

        Enable hover tooltips, zoom, and drill-down for key metrics.

    Complete Export Functionality 

        Wire up client-side libraries (json2csv, jsPDF, etc.) for seamless downloads.

        Provide UI controls for format selection.

    Visual Analytics Dashboard 

        Integrate recharts or react-chartjs-2 for interactive charts.

        Allow users to slice-and-dice by custom fields, date ranges, and spend categories.

    Chrome Extension Packaging 

        Adapt the React UI into a Manifest v3 extension.

        Implement content scripts, background messaging, and host permissions.

        Conduct end-to-end testing in a sandbox environment.

Current Progress Screenshots:
![image](https://github.com/user-attachments/assets/ca5b126e-0957-44f7-9e17-14524542b784)
![image](https://github.com/user-attachments/assets/9ea04693-8a27-444a-804d-833241870df9)



## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- SAP Ariba API credentials
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DISHANK-PATEL/Sap_Ariba_Project.git
   cd Project_Chrome_Extension
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd midnight-data-portal
   npm install
   ```

4. **Set up environment variables**
   ```bash
   # Copy the template
   cp env.template .env
   
   # Edit .env with your actual values
   nano .env
   ```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Ariba API Configuration
ARIBA_CLIENT_ID=your_ariba_client_id
ARIBA_CLIENT_SECRET=your_ariba_client_secret
ARIBA_API_KEY=your_ariba_api_key
ARIBA_REALM=your_ariba_realm
ARIBA_OAUTH_URL=https://your_ariba_oauth_url
ARIBA_BASE=https://your_ariba_base_url

# Google Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key

# Server Configuration
PORT=3001
```

### Running the Application

1. **Start the backend server**
   ```bash
   # In the root directory
   npm start
   # or
   node server.js
   ```
   The backend will run on `http://localhost:3001`

2. **Start the frontend development server**
   ```bash
   # In midnight-data-portal directory
   npm run dev
   ```
   The frontend will run on `http://localhost:8080`

3. **Open your browser**
   Navigate to `http://localhost:8080` to access the dashboard
