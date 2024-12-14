FROM node:18


WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the entire application code to the container
COPY . .

# Expose the port the app runs on
EXPOSE 1000

# Command to run the application
CMD ["node", "index.js"]
