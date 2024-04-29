# Use the official Node.js image as base
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package.json .

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port on which the application will run (if needed)
EXPOSE 8000

# Set environment variables
# ENV DATABASE='mongodb+srv://arorasam2109:p12n1nkuZ069R9tw@resumeportal.s0562nv.mongodb.net/?retryWrites=true&w=majority&appName=ResumePortal'
ENV DATABASE='mongodb://mongo:27017/db'
ENV PORT=8000
ENV JWT_TOKEN='$Top$Secret$Resume$$Portal'
ENV PASSWORD='vnknglpysmgtugod'
ENV EMAIL='csetraininggndec@gmail.com'


# Specify the command to run when the container starts
CMD ["node", "index.js"]