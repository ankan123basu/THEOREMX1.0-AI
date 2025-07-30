import React, { useEffect, useRef, useState } from "react";
import LatexRenderer from "../../components/LatexRenderer";
import axios from "axios";

interface Response {
  expr: string;
  result: string;
  assign: boolean;
}

interface Line {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
}

interface Action {
  lines: Line[];
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("rgb(255, 255, 255)");
  const [reset, setReset] = useState(false);
  const [dictOfVars, setDictOfVars] = useState({});
  const [drawingActions, setDrawingActions] = useState<Action[]>([]);
  const [actionIndex, setActionIndex] = useState(-1);
  const [answers, setAnswers] = useState<
    { x: number; y: number; text: string }[]
  >([]);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userQuestion, setUserQuestion] = useState("");
  const [isExplaining, setIsExplaining] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Set the canvas width/height attributes to match the displayed size
      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.lineCap = "round";
          ctx.lineWidth = 8; // Set brush thickness here
        }
        redrawCanvas();
      };
      resize();
      window.addEventListener("resize", resize);

      // Set up keyboard shortcuts
      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "z") {
          e.preventDefault();
          undo();
        } else if (e.key === "Enter") {
          e.preventDefault();
          runRoute();
        }
      };
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("resize", resize);
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
    // eslint-disable-next-line
  }, [actionIndex, drawingActions, dictOfVars, answers]);

  // Redraw canvas when actions or answers change
  useEffect(() => {
    redrawCanvas();
    // eslint-disable-next-line
  }, [drawingActions, actionIndex, answers]);

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear the entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Redraw all drawing actions
    for (let i = 0; i <= actionIndex; i++) {
      const action = drawingActions[i];
      if (action) {
        action.lines.forEach((line: Line) => {
          ctx.strokeStyle = line.color;
          ctx.beginPath();
          ctx.moveTo(line.startX, line.startY);
          ctx.lineTo(line.endX, line.endY);
          ctx.stroke();
        });
      }
    }

    // Redraw all answers (persistent)
    answers.forEach((answer) => {
      ctx.font =
        'bold 40px "Inter", -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = "#3b82f6";
      ctx.fillText(answer.text, answer.x, answer.y);
    });
  };

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setAnswers([]);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.background = "white";
    }
    setIsDrawing(true);
    setLastPos({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    setDrawingActions((prev) => prev.slice(0, actionIndex + 1));
    setActionIndex((prev) => prev + 1);
    setDrawingActions((prev) => [...prev, { lines: [] }]);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPos) return;
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    const newLine: Line = {
      startX: lastPos.x,
      startY: lastPos.y,
      endX: x,
      endY: y,
      color,
    };

    setDrawingActions((prev) => {
      const updated = [...prev];
      if (updated[actionIndex]) {
        updated[actionIndex] = {
          lines: [...updated[actionIndex].lines, newLine],
        };
      }
      return updated;
    });
    setLastPos({ x, y });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPos(null);
  };

  const undo = () => {
    if (actionIndex >= 0) {
      setActionIndex((prev) => prev - 1);
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setDrawingActions([]);
    setActionIndex(-1);
    setDictOfVars({});
    setAnswers([]);
    setReset(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    // e.preventDefault();

    // const canvas = canvasRef.current;
    // if (canvas) {
    //   canvas.style.background = "white";
    // }
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    setIsDrawing(true);
    setLastPos({ x, y });
    setDrawingActions((prev) => prev.slice(0, actionIndex + 1));
    setActionIndex((prev) => prev + 1);
    setDrawingActions((prev) => [...prev, { lines: [] }]);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    // e.preventDefault();
    if (!isDrawing || !lastPos) return;

    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const newLine: Line = {
      startX: lastPos.x,
      startY: lastPos.y,
      endX: x,
      endY: y,
      color,
    };

    setDrawingActions((prev) => {
      const updated = [...prev];
      if (updated[actionIndex]) {
        updated[actionIndex] = {
          lines: [...updated[actionIndex].lines, newLine],
        };
      }
      return updated;
    });
    setLastPos({ x, y });
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(false);
    setLastPos(null);
  };

  useEffect(() => {
    if (reset) {
      resetCanvas();
      setDrawingActions([]);
      setActionIndex(-1);
      setDictOfVars({});
      setAnswers([]);
      setReset(false);
    }
  }, [reset]);

  const runRoute = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsLoading(true);

    try {
      const response = await axios({
        method: "post",
        url: "http://localhost:8900/calculate",
        data: {
          image: canvas.toDataURL("image/png"),
          dict_of_vars: dictOfVars,
        },
      });

      const res = await response.data;
      console.log("Response", res);

      const newVars: Record<string, string> = {};
      res.data.forEach((data: Response) => {
        if (data.assign) {
          newVars[data.expr] = data.result;
        }
      });
      setDictOfVars((prev) => ({ ...prev, ...newVars }));

      if (drawingActions.length > 0 && actionIndex >= 0) {
        const lastAction = drawingActions[actionIndex];
        if (lastAction && lastAction.lines.length > 0) {
          let minX = Infinity,
            minY = Infinity,
            maxX = -Infinity,
            maxY = -Infinity;

          lastAction.lines.forEach((line) => {
            minX = Math.min(minX, line.startX, line.endX);
            minY = Math.min(minY, line.startY, line.endY);
            maxX = Math.max(maxX, line.startX, line.endX);
            maxY = Math.max(maxY, line.startY, line.endY);
          });

          const answerX = maxX + 50;
          const answerY = (minY + maxY) / 2;

          setAnswers((prev) => [
            ...prev,
            ...res.data.map((data: Response) => ({
              x: answerX,
              y: answerY,
              text: data.result,
              equationId: actionIndex,
            })),
          ]);
        }
      }
    } catch (error) {
      console.error("Error calculating:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getExplanation = async () => {
    const canvas = canvasRef.current;
    if (!canvas || isLoading) return;

    setIsExplaining(true);
    setSidebarOpen(true);

    try {
      const response = await axios({
        method: "post",
        url: "http://localhost:8900/calculate/explain",
        data: {
          image: canvas.toDataURL("image/png"),
          question: "Explain the solution to this problem",
          history: chatMessages,
        },
      });

      const newMessage: ChatMessage = {
        role: "assistant",
        content: response.data.data,
      };

      setChatMessages((prev) => [...prev, newMessage]);
      setExplanation(response.data.data);
    } catch (error) {
      console.error("Error getting explanation:", error);
    } finally {
      setIsExplaining(false);
    }
  };

  const handleSendMessage = async () => {
    if (!userQuestion.trim()) return;

    const newUserMessage: ChatMessage = {
      role: "user",
      content: userQuestion,
    };
    setChatMessages((prev) => [...prev, newUserMessage]);
    setUserQuestion("");

    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsExplaining(true);
    setSidebarOpen(true);
    try {
      const response = await axios({
        method: "post",
        url: "http://localhost:8900/calculate/explain",
        data: {
          image: canvas.toDataURL("image/png"),
          question: userQuestion,
          history: [...chatMessages, newUserMessage],
        },
      });

      const newAssistantMessage: ChatMessage = {
        role: "assistant",
        content: response.data.data,
      };
      setChatMessages((prev) => [...prev, newAssistantMessage]);
      setExplanation(response.data.data);
      console.log(explanation);
    } catch (error) {
      console.error("Error in chat:", error);
    } finally {
      setIsExplaining(false);
    }
  };

  // Using CSS class for retro background
  const pixelGridStyle: React.CSSProperties = {
    minHeight: '100vh',
    position: 'relative'
  };

  return (
    <div className="retro-bg" style={pixelGridStyle}>
      {/* Retro Pixel Header */}
      <header className="pixel-header">
        <h1 className="pixel-font text-3xl md:text-5xl mb-2 text-white bg-black px-6 py-3 inline-block border-4 border-white shadow-lg">
          THEOREM X
        </h1>
        <div className="pixel-intro">
          <p className="pixel-font text-sm md:text-base text-center leading-relaxed">
            <span className="inline-block px-2 py-1 bg-purple-400 text-black border-2 border-black mr-1 font-bold">EUREKA!</span>
            <span className="text-shadow">YOUR AI-POWERED STEM COMPANION</span>
            <span className="text-sm ml-2">(Science, Technology, Engineering, Math)</span>
            <br/>
            <span className="text-xs md:text-sm">Draw, Solve, Learn - Math & Physics Made Easy</span>
          </p>
        </div>
      </header>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="pixel-border p-6 flex flex-col items-center bg-white">
            <div className="w-16 h-16 border-4 border-t-4 border-black border-t-transparent animate-spin mb-4"></div>
            <p className="pixel-font text-sm">CALCULATING...</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-2">
        {/* Main content */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="p-4 mb-4 bg-white pixel-border">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={clear}
                    className="pixel-button"
                    disabled={isLoading}
                  >
                    <span className="pixel-font text-xs">NEW CANVAS</span>
                  </button>
                  <button
                    onClick={undo}
                    className="pixel-button"
                    disabled={isLoading}
                  >
                    <span className="pixel-font text-xs">ERASE LAST</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <div className="inline-grid grid-cols-6 gap-3 p-4 bg-gray-100 pixel-border">
                    {[
                      // First row - Basic colors
                      '#000000', // Black
                      '#333333', // Dark Gray
                      '#666666', // Medium Gray
                      '#999999', // Light Gray
                      '#CCCCCC', // Lighter Gray
                      '#FFFFFF', // White
                      // Second row - Vivid colors
                      '#FF0000', // Red
                      '#FF6600', // Orange
                      '#FFCC00', // Yellow
                      '#33CC33', // Green
                      '#0099FF', // Light Blue
                      '#0000FF', // Blue
                      // Third row - Pastel colors
                      '#FF9999', // Light Red
                      '#FFCC99', // Light Orange
                      '#FFFF99', // Light Yellow
                      '#99FF99', // Light Green
                      '#99FFFF', // Light Cyan
                      '#9999FF', // Light Blue
                      // Fourth row - Additional colors
                      '#990000', // Dark Red
                      '#FF00FF', // Magenta
                      '#00FFFF', // Cyan
                      '#00CC66', // Teal
                      '#6600CC', // Purple
                      '#FF3399'  // Pink
                    ].map((swatch) => (
                      <button
                        key={swatch}
                        onClick={() => setColor(swatch)}
                        className={`w-8 h-8 border-2 ${color === swatch ? 'border-yellow-400 scale-110' : 'border-black hover:scale-105'} transition-transform shadow-sm`}
                        style={{ backgroundColor: swatch }}
                        aria-label={`Select ${swatch} color`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={getExplanation}
                    className="pixel-button bg-green-600 hover:bg-green-700 text-white"
                    disabled={isLoading || isExplaining}
                  >
                    <span className="pixel-font text-xs">
                      {isExplaining ? "GENERATING..." : "SHOW STEPS"}
                    </span>
                  </button>
                  <button
                    onClick={runRoute}
                    onTouchEnd={runRoute}
                    className="pixel-button bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isLoading}
                  >
                    <span className="pixel-font text-xs">
                      {isLoading ? "SOLVING..." : "SOLVE"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pixel-canvas-container mt-4 h-[calc(100vh-300px)] md:h-[calc(100vh-250px)] bg-white/90 backdrop-blur-sm border-2 border-gray-300 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]">
              <canvas
                ref={canvasRef}
                id="canvas"
                className="w-full h-full pixel-canvas"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-full bg-white pixel-border flex flex-col h-[calc(100vh-300px)] md:h-[calc(100vh-250px)] min-h-0">
            <div className="p-3 border-b-4 border-black bg-gray-100">
              <h3 className="pixel-font text-lg">EXPLANATION</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-white">
              {chatMessages.length > 0 ? (
                <div className="space-y-4">
                  {chatMessages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-md ${msg.role === 'user' ? 'bg-blue-100 ml-8' : 'bg-gray-100 mr-8'}`}
                    >
                      <div className="prose max-w-none pixel-font text-sm">
                        <LatexRenderer content={msg.content} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : explanation ? (
                <div className="prose max-w-none pixel-font text-sm">
                  <LatexRenderer content={explanation} />
                </div>
              ) : (
                <p className="text-gray-600 pixel-font text-sm text-center mt-4">
                  CLICK "EXPLAIN" TO GET AN EXPLANATION
                </p>
              )}
            </div>

            {/* Chat interface */}
            <div className="p-3 border-t-4 border-black bg-gray-100">
              <div className="flex gap-2 w-full">
                <input
                  type="text"
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  placeholder="ASK A QUESTION..."
                  className="flex-1 min-w-0 border-4 border-black px-3 py-2 pixel-font text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="pixel-button whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
                  disabled={isExplaining}
                >
                  <span className="pixel-font text-xs">{isExplaining ? 'SENDING...' : 'SEND'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
