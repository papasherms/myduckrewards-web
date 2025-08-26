import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Play, Gift, MapPin, Zap, Users, Star, ArrowRight, Sparkles } from 'lucide-react'
import AnimatedButton from '../components/AnimatedButton'
import AnimatedCard from '../components/AnimatedCard'

const Home: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-duck-400 via-duck-500 to-orange-500 text-white py-20 lg:py-32">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full"
            animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-32 right-20 w-16 h-16 bg-white/10 rounded-full"
            animate={{ y: [0, 20, 0], rotate: [360, 180, 0] }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          />
          <motion.div
            className="absolute bottom-20 left-32 w-12 h-12 bg-white/10 rounded-full"
            animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, delay: 2 }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm border border-white/30">
                <Sparkles className="w-4 h-4 mr-2 text-duck-200" />
                #1 Gamified Rewards Platform
              </div>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-5xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-duck-100"
            >
              Win Ducks,
              <br />
              <span className="text-white drop-shadow-lg">Save Money!</span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl lg:text-2xl mb-10 text-duck-50 max-w-3xl mx-auto leading-relaxed"
            >
              🦆 Play claw machines to win collectible ducks and unlock exclusive local business discounts. 
              <span className="font-semibold">Every play wins!</span>
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/how-it-works">
                <AnimatedButton 
                  variant="secondary"
                  size="xl"
                  icon={<Play size={24} />}
                >
                  How It Works
                </AnimatedButton>
              </Link>
              
              <Link to="/business">
                <AnimatedButton 
                  variant="outline"
                  size="xl"
                  icon={<Users size={24} />}
                >
                  For Business
                </AnimatedButton>
              </Link>
            </motion.div>

            {/* Floating Duck Animation */}
            <motion.div
              className="mt-16 text-8xl"
              animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              🦆
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "100%", label: "Win Rate", icon: "🎯" },
              { number: "500+", label: "Local Partners", icon: "🤝" },
              { number: "50K+", label: "Ducks Won", icon: "🦆" },
              { number: "$2M+", label: "Savings Unlocked", icon: "💰" }
            ].map((stat, index) => (
              <AnimatedCard key={index} delay={index * 0.1} direction="up">
                <div className="p-6 text-center">
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-bold text-duck-600 mb-1">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Duck Off Your Bill! 🦆💸
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every duck you win comes with instant rewards and local business discounts
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Play size={40} className="text-white" />,
                title: "Play & Win",
                description: "Find our claw machines at Leo's locations across SE Michigan. Every play wins a duck!",
                color: "from-duck-500 to-duck-600",
                emoji: "🎮"
              },
              {
                icon: <Gift size={40} className="text-white" />,
                title: "Instant Rewards",
                description: "Each duck contains instant gratification plus a coupon for local businesses",
                color: "from-blue-500 to-blue-600",
                emoji: "🎁"
              },
              {
                icon: <MapPin size={40} className="text-white" />,
                title: "Local Discounts",
                description: "Redeem coupons at businesses within 5 miles of where you played",
                color: "from-orange-500 to-orange-600",
                emoji: "📍"
              }
            ].map((feature, index) => (
              <AnimatedCard key={index} delay={index * 0.2}>
                <div className="p-8 text-center h-full">
                  <div className="relative mb-6">
                    <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto shadow-lg`}>
                      {feature.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 text-2xl">{feature.emoji}</div>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Preview */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-duck-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Simple as 1, 2, 3! ✨
            </h2>
            <p className="text-xl text-gray-600">Start your duck collection journey today</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              { step: 1, title: "Find a Machine", description: "Locate our bright yellow claw machines", emoji: "🎯", color: "duck" },
              { step: 2, title: "Win Your Duck", description: "Every play wins a collectible duck with rewards", emoji: "🦆", color: "blue" },
              { step: 3, title: "Claim Rewards", description: "Scan and redeem at local businesses", emoji: "🎉", color: "orange" }
            ].map((item, index) => (
              <AnimatedCard key={index} delay={index * 0.3} direction="up">
                <div className="p-8 text-center relative">
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 rounded-full flex items-center justify-center mx-auto text-white font-bold text-2xl shadow-lg`}>
                      {item.step}
                    </div>
                    <div className="absolute -top-2 -right-2 text-3xl">{item.emoji}</div>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 lg:-right-6">
                      <ArrowRight className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                </div>
              </AnimatedCard>
            ))}
          </div>

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <Link to="/how-it-works">
              <AnimatedButton size="lg" icon={<Zap size={20} />}>
                Learn More
              </AnimatedButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "url('data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3C/g%3E%3C/svg%3E')"
            }}
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Start Saving? 🚀
            </h2>
            <p className="text-xl mb-10 text-blue-100 max-w-2xl mx-auto">
              Join thousands of happy customers and start your duck collection adventure today!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/customer-signup">
                <AnimatedButton variant="primary" size="xl" icon={<Star size={24} />}>
                  Start Playing Now
                </AnimatedButton>
              </Link>
              <Link to="/contact">
                <AnimatedButton variant="outline" size="xl" icon={<MapPin size={24} />}>
                  Find Locations
                </AnimatedButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home