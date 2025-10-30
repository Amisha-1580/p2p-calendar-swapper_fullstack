#!/bin/bash
echo "🚀 Starting SlotSwapper setup..."

if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js (v18 or higher)."
    exit
fi

echo "📦 Setting up backend..."
cd backend || { echo "Backend folder not found!"; exit 1; }
npm install
echo "✅ Backend dependencies installed."
nohup node server.js > ../backend.log 2>&1 &
echo "⚙️ Backend running on http://localhost:4000"

cd ../frontend || { echo "Frontend folder not found!"; exit 1; }
echo "📦 Setting up frontend..."
npm install
echo "✅ Frontend dependencies installed."

echo "🚀 Launching frontend..."
npm run dev &
sleep 2

if command -v xdg-open &> /dev/null
then
  xdg-open http://localhost:5173
elif command -v open &> /dev/null
then
  open http://localhost:5173
fi

echo "🎉 SlotSwapper is ready!"
echo "👉 Frontend: http://localhost:5173"
echo "👉 Backend:  http://localhost:4000"
