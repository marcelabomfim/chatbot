# Chatbot Project

## Running the Project

1. Install the dependencies:
  ```sh
  npm install
  ```

2. Create your `.env` file and add the database URL:
  ```sh
  DATABASE_URL="file:./chatbot.db"
  ```

3. Run the database migration:
  ```sh
  npx prisma migrate dev --name init
  ```

4. Start the development server:
  ```sh
  npm run dev
  ```

5. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

### Pages

- **Home Page (`/`)**
  - Description: Here you can start a new chat session.
  - Integration: simple javascript fetch api to perform the POST request when starting a new chat session.

- **Chat Session Page (`/chat/[sessionId]`)**
  - Description: Displays the chat history. Every new message you enter will be answered by the chatbot with a random message.
  - Integration: useQuery + useMutation to fetch and post chat messages, with cache invalidation

- **Dashboard Page (`/dashboard`)**
  - Description: View a full history of all chat sessions.
  - Integration: use prisma to fetch data before render the page on the server side

### API Routes

- **POST `/api/chat/start`**
  - Description: Starts a new chat session given a user name.
  - Request Body: JSON object containing `user`.
  - Response: JSON object containing the session ID.

- **GET `/api/chat/[sessionId]`**
  - Description: Fetches the chat session history for a given session ID.
  - Request Parameters: `sessionId` (path parameter) - The ID of the chat session.
  - Response: JSON object containing the chat session history, with each message including the author, text, and timestamp.

- **POST `/api/chat/message`**
  - Description: Creates a new message sent by the user and responds with a randomly generated message from the bot.
  - Request Body: JSON object containing `sessionId` and `text`.
  - Response: JSON object containing the bot's response message.
