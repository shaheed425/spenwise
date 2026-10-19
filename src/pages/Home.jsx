import React from "react";
import Logo from "../img/logo.png"; // adjust path if needed
import { useNavigate } from "react-router-dom";
import {} from "lucide-react";
import { motion } from "framer-motion";



const Home = () => {
   const navigate = useNavigate();

  return (
<div className="bg-black text-white w-full min-h-screen flex flex-col">

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-10 py-4 border-b border-gray-800">
        <a
          href="/"
          className="flex items-center gap-2 text-yellow-400 font-bold text-lg"
        >
          <img 
            src={Logo}
            className="w-10 h-10"
          />
          <span>Spendwise</span>
        </a>

        {/* <div className="hidden md:flex gap-8 text-gray-300">
          <a href="#" className="hover:text-yellow-400 transition">
            Home
          </a>
        </div> */}

         <div
          className="flex gap-3 ml-270"
          onClick={() => navigate("/login") } >
        
          <button className="px-8 py-2 rounded-lg border border-gray-600 hover:border-yellow-400 transition">
            Login
          </button></div>
        <div
          className="   flex gap-3"
          onClick={() => navigate("/reg") } >
          
          
          <button className="px-4 py-2 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition">
            Register
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="flex justify-center px-6 py-20">
        
        <motion.div initial={{opacity:0,y:40}} 
        animate={{opacity:1,y:0}}
        transition={{duration:0.6,delay:0.1,type:"spring"}}
         className="max-w-4xl w-full text-center bg-gradient-to-br from-gray-900 to-black p-14 rounded-3xl shadow-xl border border-gray-800">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Smart Personal Expense Tracking
          </h1>
          <p className="text-gray-400 mb-8">
            SpendWise helps you master your money with effortless tracking,
            insightful analytics, and a beautiful, intuitive interface.
            Take control of your financial future today.
          </p>
          <div className="flex justify-center gap-4 " >
            <button className="px-6 py-3 rounded-xl bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition " onClick={() => navigate("/reg") }>
              Get Started
            </button>
            <button className="px-6 py-3 rounded-xl border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition" onClick={() => navigate("/login") }>
              Login
            </button>
          </div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-16">
        <h2 className="text-center text-3xl font-bold mb-12">
          Key Features Designed For You
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Effortless Expense Tracking",
              desc: "Easily log and categorize all your expenditures with intuitive forms and smart suggestions.",
            },
            {
              title: "Streamlined Income Management",
              desc: "Record your earnings from various sources and gain a complete overview of your inflows.",
            },
            {
              title: "Insightful Visual Analytics",
              desc: "Understand your spending habits at a glance with dynamic charts and graphs.",
            },
            {
              title: "Secure Cloud Storage",
              desc: "All your financial data is safely stored and backed up in the cloud with robust encryption.",
            },
            {
              title: "Access Anywhere, Anytime",
              desc: "SpendWise is fully responsive across desktop, tablet, and mobile devices.",
            },
            {
              title: "Budgeting & Goal Setting",
              desc: "Set personalized budgets and track progress towards your financial goals.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 hover:border-yellow-400 transition"
            >
              <h3 className="text-lg font-semibold mb-3 text-yellow-400">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* MISSION */}
      <section className="px-6 py-20 flex justify-center">
        <div className="max-w-5xl w-full bg-gradient-to-br from-gray-800 to-gray-900 p-14 rounded-3xl border border-gray-700 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Our Mission at SpendWise
          </h2>
          <p className="text-gray-400 mb-8">
            We believe that managing your finances should be simple, intuitive,
            and empowering. SpendWise is built to provide you with clarity and
            control over your money, helping you achieve your financial goals
            with confidence.
          </p>
          <button className="px-6 py-3 rounded-xl border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition">
            Learn More
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-800 px-12 py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-gray-400 text-sm">
          <div className="w-30%">
            <a
          href="/"
          className="flex items-center gap-2 text-yellow-400 font-bold text-lg "
        >
          <img
            src={Logo}
            className="w-10 h-10"
          />
          <span>SpendWise</span>
        </a>
            <h5 className="">
              Smart Personal Expense Tracking for a Brighter Financial Future.
            </h5>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-2">Company</h4>
            <ul className="space-y-1">
              <li>About Us</li>
              <li>Features</li>
              <li>Blog</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-2">Support</h4>
            <ul className="space-y-1">
              <li>Support</li>
              <li>FAQ</li>
              <li>Contact Us</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-2">Legal</h4>
            <ul className="space-y-1">
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;
