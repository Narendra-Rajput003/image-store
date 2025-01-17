# Online Image Store

This is an online image store built with Next.js, NextAuth.js for authentication, Razorpay for payment integrations, and MongoDB for the database.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* Node.js and npm (or yarn)
* MongoDB (Make sure MongoDB is running before starting the application)

### Installation

1. Clone the repository:
   ```bash
   git clone [repository_url]
   ```
2. Install dependencies:
   ```bash
   cd image-store
   npm install
   ```
3. Create a `.env.local` file in the root directory and add the following environment variables:

```
# MongoDB Configuration
MONGODB_URI=

# Authentication
NEXTAUTH_SECRET=

# ImageKit Configuration
NEXT_PUBLIC_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
NEXT_PUBLIC_URL_ENDPOINT=

# Razorpay Configuration
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# Mailtrap Configuration
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your_mailtrap_user_here
MAILTRAP_PASS=your_mailtrap_password_here
```

### Running the app

1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

* User authentication (NextAuth.js)
* Product browsing and purchasing
* Image uploading and management (ImageKit)
* Secure payment gateway integration (Razorpay)

## Technologies Used

* Next.js
* NextAuth.js
* Tailwind CSS
* ImageKit (for image management)
* MongoDB
* Razorpay (for payment processing)
* Mailtrap (for email testing)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.


