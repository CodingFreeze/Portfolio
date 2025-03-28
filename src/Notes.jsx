import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Notes() {
  return (
    <motion.div
      className="min-h-screen flex flex-col"
      style={{ 
        backgroundColor: 'var(--bg)', 
        color: 'var(--text)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.header
        className="flex justify-center py-3 px-6 sm:px-8 md:px-12 lg:px-16"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          borderBottom: '1px solid var(--divider)',
          backgroundColor: 'var(--bg)',
        }}
      >
        <Link 
          to="/"
          className="text-xl sm:text-2xl font-bold text-[var(--accent)] hover:scale-110 transition-transform duration-300"
        >
          [AR]
        </Link>
      </motion.header>

      <motion.div
        className="flex-grow flex items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className="text-center">
          <h1 className="text-4xl font-semibold text-[var(--accent)] mb-8">
            Work in Progress
          </h1>
          <Link 
            to="/"
            className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
          >
            ← Back to Portfolio
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
} 