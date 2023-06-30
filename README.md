# ChatStream - React Client

This repository contains the client side for ChatStream, a real time chat Application built with the MERN stack (MongoDB, Express.js, React, Node.js) and Socket.IO. The React client is responsible for rendering the user interface and interacts with the express and socket servers.

## Project Overview
This repository is part of a larger project that includes the following components as well:
- [Express Server](https://github.com/george-kokonas/ChatStream-express-server): The Express server component handles API requests and database operations for the ChatStream application, including authorization-authentication.
- [Socket Server](https://github.com/george-kokonas/ChatStream-socket-server): The Socket server component handles real-time communication between clients in the ChatStream application.

You can explore these repositories to learn more about the other components of the project.

Click [here](https://chatstream.netlify.app) to see ChatStream deployed and running!

***Please note that ChatStream is constantly evolving, with regular updates that bring new features, enhancements, and performance tweaks.***

## Features
- Real-time messaging: ChatStream enables users to engage in real-time one-on-one messaging. Messages are delivered instantly and updates are reflected in the user interface without the need for page refresh.
- User registration and authentication: Users can create accounts and authenticate themselves to access their personalized chat experience. This ensures secure and private communication within the application.
- User profile management: Users can manage their profiles. They can upload a profile picture and update their personal information.
- Notifications: This feature enhances user experience by providing a visual indication of messages that were received while the user was offline or while the user is online but have not seen the messages yet.
- Users statuses: This feature provides real-time visibility that indicates whether a user is currently online or offline. 
- Typing indicator:  Real-time typing indicator feature that enhances the user experience by providing instant feedback when another user is typing a message.
- Messages previews: A feature that displays the last message of each conversation in real time. This feature provides users with a quick glimpse of the most recent message exchanged in each conversation without having to open the conversation. The preview is updated instantly as new messages are sent or received, ensuring that users stay informed about the latest content within their conversations.
- Messages timestamps: This feature enhances the messaging experience by displaying the time duration since a message was sent, allowing users to easily gauge the recency of conversations. By providing this contextual information, users can quickly identify whether a message was sent seconds, minutes, hours, or days ago. The time duration is dynamically updated to reflect the current elapsed time, ensuring that users have an up-to-date understanding of the message timeline. 
- Search users and conversations: A search feature that enables users to search for registered users within the application as well as search for existing conversations. This feature enhances user convenience and productivity by providing a quick and efficient way to find specific users or conversations.
- Mobile-friendly version of ChatStream (experimental): With this experimental feature, ChatStream adapts its layout and content dynamically to provide a seamless experience for mobile users. To use the mobile version, follow these steps :

  - Navigate to this [link](https://chatstream.netlify.app) from your mobile browser (prefferably google chrome)
  - Press to open the menu (three dots on the upper right corner)
  - Select `Install React App` 
  - Launch the app

 
## Prerequisites
To run the application locally, you need to have the following installed on your system:
- Node.js (version >= 14)
- npm (Node Package Manager)

If you don't have Node.js or npm installed, you can visit the [Node.js](https://nodejs.org/) website for further guidance on installation.

## Dependencies
The following dependencies are required for running the ChatStream React Client:
- [socket.io-client](https://socket.io/docs/v4/client-api/): a JavaScript library that enables real-time, bidirectional communication between clients and servers. Socket.IO simplifies the process of building real-time applications, such as chat systems, gaming platforms, collaborative tools, and live dashboards. It offers features like event-based communication, room-based messaging, and automatic reconnection.

- [uuid](https://www.npmjs.com/package/uuid): a JavaScript library that allows you to generate universally unique identifiers (UUIDs).

- [axios](https://axios-http.com/): a popular JavaScript library used for making HTTP requests from a browser or Node.js. It provides an easy-to-use API for sending asynchronous HTTP requests to a server and handling the responses.

- [react-router-dom](https://www.npmjs.com/package/react-router-dom): a library used for routing in React applications. It provides a declarative way to define the routes of your application and handle navigation between different components.

- [react-timeago](https://www.npmjs.com/package/react-timeago):  a React library that provides a simple and customizable way to display relative timestamps in your application. It takes a date or timestamp as input and automatically updates the displayed time to reflect the elapsed time in a human-readable format, such as "3 minutes ago" or "2 days ago."

- [sass](https://sass-lang.com/): "Sass" (Syntactically Awesome Style Sheets) is a preprocessor scripting language that extends the capabilities of CSS (Cascading Style Sheets). It introduces features like variables, nesting, mixins, and functions, which make writing and managing CSS code more efficient and maintainable.

- [fontawesome](https://fontawesome.com/): a popular icon library that provides a wide range of scalable vector icons that can be easily integrated into web projects.


## Installation
### 1. Clone the repository:
```
git clone git@github.com:george-kokonas/ChatStream-react-client.git

```

### 2. Navigate to the project directory:
```
cd ChatStream-react-client
```

### 3. Install the dependencies:
- Using npm:
```
npm install
```
- Using Yarn:
```
yarn install
```

### 5. Start the application:
- Using npm:
```
npm start
```
- Using yarn:
```
yarn start:
```
The application will be running at `http://localhost:3000` by default, or you can specify a different port if needed.

Now you can open your web browser and navigate to http://localhost:3000 (or the specified port) to access and interact with the application.

## Planned Features
- Conversations deletion: Allow users to delete their own conversations.
- Group messaging: Enable users to create and participate in group conversations, allowing for multi-user discussions.
- Message search: Implement search functionality to enable users to search for specific messages within a conversation.
- Message editing and deletion: Allow users to edit or delete their own messages within a certain time frame after sending them.
- Message reactions: Implement the ability for users to react to messages with emojis or other predefined reactions.
- Pagination logic: Improve performance and user experience by loading messages in smaller, manageable chunks rather than loading everything at once. As a result, the amount of data transferred between the client and server will be reduced achieving better performance.

## Feedback and Contributions

Any feedback, ideas, suggestions, or bug reports you may have regarding this project are welcome! If you would like to contribute to the development of this application, please contact me. Together, we can make ChatStream better!

For any inquiries or direct communication, you can reach out to me via email at [g.kokwnas@gmail.com](mailto:g.kokwnas@gmail.com)

## License

This project is licensed under the [MIT License](https://opensource.org/license/mit/).

You are free to use, modify, and distribute this project for personal or commercial purposes. Please see the [LICENSE](LICENSE) file for more details.
