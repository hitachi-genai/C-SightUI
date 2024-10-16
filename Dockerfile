# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /src

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed dependencies
RUN npm i

# Copy the rest of the application to the working directory
COPY . .

# Make port 3000 available to the outside world
EXPOSE 3000

# Run the application
CMD ["npm", "run", "dev"]
