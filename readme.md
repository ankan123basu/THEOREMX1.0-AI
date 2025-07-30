# THEOREM X

> **Your AI-Powered STEM Companion**
>
> Draw, Solve, Learn - Math & Physics Made Easy

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://gemini.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎓 Introduction

**THEOREM X** is an intelligent digital whiteboard that serves as a STEM learning companion, specializing in mathematical and physics problem-solving through natural handwriting input. Built with a retro pixel-art interface, it combines the power of Google Gemini AI with an intuitive drawing canvas to help students visualize and solve complex problems.

### 🎯 What is a STEM Companion?

A STEM companion is an AI-powered educational tool that assists with Science, Technology, Engineering, and Mathematics learning. THEOREM X focuses specifically on:

- **Mathematics**: From basic arithmetic to advanced calculus (derivatives, integrals, limits)
- **Physics**: Numerical problem solving with proper unit handling
- **Interactive Learning**: Natural problem input through handwriting or drawing
- **Step-by-Step Solutions**: Detailed breakdowns of problem-solving processes

## 🚀 How It Works

### Core Workflow

1. **Input**:

   - Draw or write mathematical expressions directly on the canvas
   - Use different colors to separate problems or highlight components
   - The system captures your handwriting in real-time

2. **Processing**:

   - The canvas content is converted to an image
   - Image is sent to the backend API endpoint `/api/v1/calculator`
   - Google Gemini AI analyzes the image to interpret the mathematical content

3. **AI Analysis**:

   - Handwritten content is processed using Google Gemini's vision capabilities
   - The system recognizes different types of mathematical expressions:
     - Simple arithmetic expressions
     - Algebraic equations
     - Calculus problems (derivatives, integrals, limits)
     - Physics numerical problems
   - Variables can be defined and reused across multiple problems

4. **Solution Generation**:

   - For each recognized expression, the AI generates:
     - The interpreted mathematical expression
     - Step-by-step solution process
     - Final computed result
   - Variables are stored in a dictionary for reference in subsequent calculations

5. **Display**:

   - Solutions are rendered using LaTeX for beautiful mathematical notation
   - Step-by-step explanations appear in the sidebar
   - Previous calculations remain visible for reference

### Technical Implementation

#### Frontend (React + TypeScript)

- **Canvas Drawing**: Custom implementation using HTML5 Canvas API
- **State Management**: React hooks for managing drawing state and calculations
- **UI Components**:
  - Retro-styled buttons and controls
  - Color picker for different drawing colors
  - Responsive layout using Tailwind CSS
  - Real-time preview of drawn content

#### Backend (Python + FastAPI)

- **API Endpoints**:
  - `POST /api/v1/calculator`: Processes images and returns solutions
  - `POST /api/v1/calculator/explain`: Generates detailed explanations
- **AI Integration**:
  - Google Gemini for mathematical analysis
  - Custom prompt engineering for consistent output formatting
  - Variable management across multiple calculations

- **Response Format**:

  ```json
  {
    "message": "Image processed",
    "data": [
      {
        "expr": "2 + 2",
        "result": 4,
        "assign": false
      }
    ],
    "status": "success"
  }
  ```

## 🌟 Key Features

### Core Capabilities

- **Handwritten Input**:
  - Natural writing experience with pressure sensitivity
  - Multiple color support for complex diagrams
  - Undo/Redo functionality

- **Mathematical Processing**:
  - Handles arithmetic, algebra, and calculus
  - Variable assignment and reuse
  - Unit-aware calculations
  - Support for common mathematical constants

- **User Experience**:
  - Retro pixel-art interface with modern usability
  - Real-time feedback
  - Responsive design works on desktop and tablets
  - Keyboard shortcuts for common actions

### Technical Features

- **Frontend**:
  - React 18 with TypeScript
  - Tailwind CSS for styling
  - Canvas API for drawing
  - Axios for API communication
  - LaTeX rendering for mathematical notation

- **Backend**:
  - Python 3.10+
  - FastAPI for RESTful API
  - Google Gemini AI integration
  - Uvicorn ASGI server
  - CORS middleware for cross-origin requests

## 🛠️ Installation

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm or yarn
- Google Gemini API Key (Required)
- (Optional) OpenAI API Key for enhanced explanations

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-magic-board.git
   cd ai-magic-board
   ```

2. **Set up the backend**
   ```bash
   # Create and activate virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate

   # Install dependencies
   cd backend
   pip install -r requirements.txt

   # Set up environment variables
   echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env
   ```

3. **Set up the frontend**
   ```bash
   cd ../ai-whiteboard-frontend
   npm install
   ```

1. **Run the application**
   
   In one terminal (backend):
   ```bash
   cd ../backend
   uvicorn main:app --reload
   ```

   In another terminal (frontend):
   ```bash
   cd ../ai-whiteboard-frontend
   npm start
   ```

2. **Access the application**
   
   Open your browser and navigate to `http://localhost:3000`

## 🧠 How It Works (Technical Deep Dive)

### 1. Drawing Capture

- The frontend captures user input using HTML5 Canvas
- Each stroke is recorded with position, pressure, and color data
- The canvas state is managed using React's useRef and useState hooks

### 2. Image Processing

- When the user requests a solution:
  - The canvas is converted to a base64-encoded PNG image
  - The image and current variables are sent to the backend

### 3. AI Analysis (Backend)

The backend receives the image and processes it using Google Gemini:

```python
def analyze_image(img: Image, dict_of_vars: dict):
    model = genai.GenerativeModel(model_name="gemini-2.0-flash")
    # ... (prompt engineering for math recognition)
    response = model.generate_content([prompt, img])
    return parse_response(response.text)
```

### 4. Response Handling

- The backend parses the AI response into a structured format
- Variables are extracted and stored for future calculations
- The response is formatted as JSON and sent back to the frontend

### 5. Display Results

- The frontend renders the solution using LaTeX
- Step-by-step explanations are displayed in the sidebar
- Variables are updated in the global state for future calculations

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env file and add your Gemini API key:
   # GEMINI_API_KEY=your_gemini_api_key_here
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   # Or using yarn:
   # yarn install
   ```

3. **Set up frontend environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local and configure backend API URL if needed
   ```

### Running the Application

#### Start Backend Server

1. **Activate conda environment and start backend**
   ```bash
   conda activate ai-whiteboard
   cd backend
   python main.py
   ```
   
   The backend API will start running on `http://localhost:8900` (or your configured port).

#### Start Frontend Development Server

2. **In a new terminal, start the frontend**
   ```bash
   cd ai-whiteboard-frontend
   npm run dev
   # Or using yarn:
   # yarn start
   ```
   
   The frontend will start running on `http://localhost:5173` and automatically open in your browser.

#### Production Build (Optional)

For production deployment:

```bash
# Build frontend
cd frontend
npm run build

# The built files will be in the 'build' directory
# Configure your backend to serve these static files
```

## 📁 Project Structure

```
THEOREM-X/
├── backend/                     # FastAPI backend
│   ├── apps/
│   │   └── calculator/         # Core AI and calculation logic
│   │       ├── __init__.py
│   │       ├── config.py       # Configuration settings
│   │       ├── route.py        # API endpoints
│   │       └── utils.py        # Utility functions and AI integration
│   ├── .env.example            # Environment variables template
│   ├── main.py                 # FastAPI application entry point
│   └── requirements.txt        # Python dependencies
│
├── ai-whiteboard-frontend/     # React frontend
│   ├── public/                # Static assets
│   └── src/
│       ├── components/        # Reusable UI components
│       │   ├── LatexRenderer/ # For rendering mathematical equations
│       │   └── UI/            # Common UI elements
│       │
│       ├── screens/           # Page components
│       │   └── home/          # Main application screen
│       │       └── index.tsx  # Main component with canvas and UI
│       │
│       ├── App.tsx            # Main application component
│       └── main.tsx           # Application entry point
│
└── README.md                  # Project documentation
```

## 🚀 Future Enhancements

- [ ] Mobile app version for iOS and Android
- [ ] Support for more STEM subjects (Chemistry, Biology)
- [ ] Collaborative whiteboard features
- [ ] Integration with learning management systems
- [ ] Offline mode with local AI models
- [ ] Customizable avatars and themes

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👨‍💻 Made By

**Ankan Basu**  
Computer Science Student  
Lovely Professional University  

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ankan123basu)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/ankanbasu)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/ankanbasu)

## 🙏 Acknowledgments

- [Google Gemini AI](https://gemini.google.com/) for the powerful AI capabilities
- [FastAPI](https://fastapi.tiangolo.com/) for the awesome backend framework
- [React](https://reactjs.org/) for the responsive frontend framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) for type safety