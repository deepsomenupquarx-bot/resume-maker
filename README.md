<div align="center">
  <img width="1200" height="475" alt="ResumeElite AI Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

  # 🚀 ResumeElite AI
  ### *The Ultimate AI-Powered Resume Builder for Modern Professionals*

  [![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
  [![Tech Stack](https://img.shields.io/badge/Built%20With-React%20%2B%20Vite%20%2B%20Tailwind-blue?style=for-the-badge&logo=react)](https://reactjs.org)
  [![AI Powered](https://img.shields.io/badge/AI-Gemini%20Flash-orange?style=for-the-badge&logo=google-gemini)](https://deepmind.google/technologies/gemini/)
</div>

<br />

## 🌟 Overview

**ResumeElite AI** is a premium, feature-rich resume builder designed to help job seekers create professional, ATS-optimized resumes in minutes. By leveraging the power of **Google Gemini AI**, it generates high-impact content tailored to specific job roles and industries.

Whether you're a fresh graduate or a seasoned executive, ResumeElite AI provides the tools you need to stand out from the crowd.

---

## ✨ Key Features

- **🤖 AI-Driven Content Generation**: Instant professional summaries, work experience descriptions, and skill suggestions powered by Gemini AI.
- **🔗 LinkedIn One-Click Import**: Seamlessly import your profile data from LinkedIn to jumpstart your resume.
- **💎 Premium Templates**: Access a curated collection of modern, professional, and creative templates.
- **📄 Pixel-Perfect PDF Export**: High-fidelity PDF generation using server-side Puppeteer for consistent results.
- **💳 Secure Payments**: Integrated Razorpay gateway for unlocking premium features and exports.
- **⚡ Real-time Editing**: Dynamic preview updates as you build your resume.
- **🛠️ ATS Optimization**: Built-in guidance to ensure your resume passes through Applicant Tracking Systems.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion
- **Backend (API)**: Node.js (Express), Serverless Functions
- **AI Engine**: Google Gemini 1.5 Flash
- **Database/Auth**: Supabase
- **PDF Rendering**: Puppeteer-core + @sparticuz/chromium
- **Payment Gateway**: Razorpay
- **Deployment**: Vercel

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/deepsomenupquarx-bot/resume-maker.git
   cd resume-maker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory and add the following:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_key
   RAZORPAY_KEY_ID=your_razorpay_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   LINKEDIN_CLIENT_ID=your_linkedin_id
   LINKEDIN_CLIENT_SECRET=your_linkedin_secret
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

---

## 📦 Deployment

The project is optimized for deployment on **Vercel**. Simply push your changes to GitHub and connect your repository to Vercel. Ensure all environment variables are configured in the Vercel dashboard.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is private and intended for personal/professional use by the owner.

---

<div align="center">
  Made with ❤️ by the ResumeElite Team
</div>
