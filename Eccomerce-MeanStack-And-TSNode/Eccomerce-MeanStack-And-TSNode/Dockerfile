# Step 1: Use a Node.js base image
FROM node:22-alpine

# Step 2: Set the working directory
WORKDIR /Eccomerce-MeanStack-And-TSNode

# Step 3: Copy package.json and install dependencies
COPY package.json ./

RUN npm install

# Step 4: Copy the rest of the application code
COPY . .

# Step 5: Expose the port the app will be run on
EXPOSE 3000

# Step 6: Start the application
CMD ["npm", "start"]
