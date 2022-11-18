docker pull node:latest
docker build -t red-tetris .
docker run -p 3000:3000 -d red-tetris