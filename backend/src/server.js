const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 3001;

connectDB().finally(() => {
  app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
  });
});
