import React from 'react';
import { Users, Shield, Globe, Award, Target, Heart, CheckCircle, ArrowRight } from 'lucide-react';

const About = () => {
  const stats = [
    { number: '50M+', label: 'Active Users', icon: <Users className="stat-icon" /> },
    { number: '100M+', label: 'Listings Posted', icon: <Globe className="stat-icon" /> },
    { number: '25+', label: 'Countries', icon: <Award className="stat-icon" /> },
    { number: '99.9%', label: 'Uptime', icon: <Shield className="stat-icon" /> }
  ];

  const values = [
    {
      icon: <Shield className="value-icon" />,
      title: 'Trust & Safety',
      description: 'We prioritize the safety of our community with advanced security measures and buyer protection programs.'
    },
    {
      icon: <Users className="value-icon" />,
      title: 'Community First',
      description: 'Our platform is built around bringing people together and fostering meaningful connections through commerce.'
    },
    {
      icon: <Globe className="value-icon" />,
      title: 'Global Reach',
      description: 'Connecting buyers and sellers across the world, making local and international trade accessible to everyone.'
    },
    {
      icon: <Heart className="value-icon" />,
      title: 'Sustainability',
      description: 'Promoting a circular economy by giving products a second life and reducing environmental impact.'
    }
  ];

  const milestones = [
    { year: '2020', title: 'Founded', description: 'SwapNest was founded with a vision to revolutionize online marketplace' },
    { year: '2021', title: 'First Million Users', description: 'Reached our first million registered users across 5 countries' },
    { year: '2022', title: 'Mobile App Launch', description: 'Launched our mobile applications for iOS and Android platforms' },
    { year: '2023', title: 'AI Integration', description: 'Introduced AI-powered recommendations and fraud detection systems' },
    { year: '2024', title: 'Global Expansion', description: 'Expanded to 25+ countries with localized experiences' }
  ];

  const team = [
    { name: 'Kalyan', role: 'CEO & Co-Founder', image: '👨‍💼' },
    { name: 'Vishnu', role: 'CTO & Co-Founder', image: '👨‍💻' },
    { name: 'Trilesh', role: 'VP of Product', image: '👨‍🚀' },
    { name: 'Praveen', role: 'Head of Engineering', image: '👨‍🔬' },
    { name: 'Srinivasa', role: 'Lead Developer', image: '👨‍💻' }
  ];

  return (
    <div className="about-page">
      <style jsx>{`
        .about-page {
          background-color: #f9fafb;
          min-height: 100vh;
        }

        /* Hero Section */
        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 100px 0 80px 0;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><polygon fill="rgba(255,255,255,0.1)" points="0,1000 1000,0 1000,1000"/></svg>');
          background-size: cover;
        }

        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          position: relative;
          z-index: 1;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 20px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .hero-subtitle {
          font-size: 1.5rem;
          opacity: 0.95;
          font-weight: 300;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Stats Section */
        .stats-section {
          padding: 80px 0;
          background: white;
          margin-top: -40px;
          position: relative;
          z-index: 2;
          border-radius: 20px 20px 0 0;
        }

        .stats-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 40px;
          margin-top: 40px;
        }

        .stat-card {
          text-align: center;
          padding: 30px 20px;
          background: linear-gradient(145deg, #f8fafc, #e2e8f0);
          border-radius: 15px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        .stat-number {
          font-size: 3rem;
          font-weight: 800;
          color: #667eea;
          margin-bottom: 10px;
        }

        .stat-label {
          font-size: 1.1rem;
          color: #64748b;
          font-weight: 600;
        }

        .stat-icon {
          width: 40px;
          height: 40px;
          color: #667eea;
          margin-bottom: 20px;
        }

        /* Story Section */
        .story-section {
          padding: 100px 0;
          background: linear-gradient(to right, #ffecd2, #fcb69f);
        }

        .story-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .story-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .story-text h2 {
          font-size: 2.5rem;
          margin-bottom: 30px;
          color: #2d3748;
        }

        .story-text p {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #4a5568;
          margin-bottom: 20px;
        }

        .story-image {
          text-align: center;
          font-size: 15rem;
          filter: drop-shadow(0 10px 20px rgba(0,0,0,0.1));
        }

        /* Values Section */
        .values-section {
          padding: 100px 0;
          background: white;
        }

        .values-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .section-title {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 20px;
          color: #2d3748;
        }

        .section-subtitle {
          text-align: center;
          font-size: 1.2rem;
          color: #64748b;
          margin-bottom: 60px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 40px;
        }

        .value-card {
          text-align: center;
          padding: 40px 30px;
          background: white;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .value-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
          border-color: #667eea;
        }

        .value-icon {
          width: 60px;
          height: 60px;
          color: #667eea;
          margin-bottom: 20px;
        }

        .value-title {
          font-size: 1.4rem;
          font-weight: 600;
          margin-bottom: 15px;
          color: #2d3748;
        }

        .value-description {
          color: #64748b;
          line-height: 1.6;
        }

        /* Timeline Section */
        .timeline-section {
          padding: 100px 0;
          background: #f7fafc;
        }

        .timeline-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .timeline {
          position: relative;
          padding: 40px 0;
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 4px;
          background: #667eea;
          transform: translateX(-50%);
        }

        .timeline-item {
          display: flex;
          margin-bottom: 60px;
          position: relative;
        }

        .timeline-item:nth-child(even) {
          flex-direction: row-reverse;
        }

        .timeline-content {
          flex: 1;
          padding: 30px;
          background: white;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          margin: 0 30px;
          position: relative;
        }

        .timeline-year {
          font-size: 1.5rem;
          font-weight: 700;
          color: #667eea;
          margin-bottom: 10px;
        }

        .timeline-title {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 10px;
          color: #2d3748;
        }

        .timeline-description {
          color: #64748b;
          line-height: 1.6;
        }

        .timeline-marker {
          width: 20px;
          height: 20px;
          background: #667eea;
          border-radius: 50%;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          border: 4px solid white;
          box-shadow: 0 0 0 4px #667eea;
        }

        /* Team Section */
        .team-section {
          padding: 100px 0;
          background: white;
        }

        .team-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 40px;
        }

        .team-card {
          text-align: center;
          padding: 40px 30px;
          background: linear-gradient(145deg, #f8fafc, #e2e8f0);
          border-radius: 20px;
          transition: all 0.3s ease;
        }

        .team-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .team-avatar {
          font-size: 4rem;
          margin-bottom: 20px;
          display: block;
        }

        .team-name {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 8px;
          color: #2d3748;
        }

        .team-role {
          color: #667eea;
          font-weight: 500;
        }

        /* CTA Section */
        .cta-section {
          padding: 100px 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
        }

        .cta-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .cta-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .cta-description {
          font-size: 1.2rem;
          opacity: 0.9;
          margin-bottom: 40px;
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 15px 30px;
          background: white;
          color: #667eea;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .cta-icon {
          width: 20px;
          height: 20px;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-subtitle {
            font-size: 1.2rem;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }

          .story-content {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .story-image {
            font-size: 8rem;
          }

          .timeline::before {
            left: 20px;
          }

          .timeline-item {
            flex-direction: row !important;
            padding-left: 60px;
          }

          .timeline-content {
            margin: 0;
          }

          .timeline-marker {
            left: 20px;
          }

          .section-title {
            font-size: 2rem;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .stat-number {
            font-size: 2.5rem;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">About SwapNest</h1>
          <p className="hero-subtitle">
            Empowering millions of people to buy, sell, and discover amazing deals in their communities and beyond
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <h2 className="section-title">Our Impact in Numbers</h2>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                {stat.icon}
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="story-container">
          <div className="story-content">
            <div className="story-text">
              <h2>Our Story</h2>
              <p>
                SwapNest was born from a simple idea: everyone should have access to a safe, easy, and affordable way to buy and sell goods online. What started as a small project has grown into a global platform that connects millions of people every day.
              </p>
              <p>
                We believe in the power of community and the importance of giving everyone a voice in the marketplace. Our platform democratizes commerce, allowing anyone to become an entrepreneur and find amazing deals on the things they love.
              </p>
              <p>
                Today, we're proud to serve communities in over 25 countries, facilitating millions of transactions and helping people declutter their homes while finding new treasures.
              </p>
            </div>
            <div className="story-image">
              🏢
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="values-container">
          <h2 className="section-title">Our Core Values</h2>
          <p className="section-subtitle">
            These principles guide everything we do and shape the experience for our global community
          </p>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                {value.icon}
                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      {/* <section className="timeline-section">
        <div className="timeline-container">
          <h2 className="section-title">Our Journey</h2>
          <p className="section-subtitle">
            From a simple idea to a global marketplace - here are the key milestones in our story
          </p>
          <div className="timeline">
            {milestones.map((milestone, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-content">
                  <div className="timeline-year">{milestone.year}</div>
                  <h3 className="timeline-title">{milestone.title}</h3>
                  <p className="timeline-description">{milestone.description}</p>
                </div>
                <div className="timeline-marker"></div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Team Section */}
      <section className="team-section">
        <div className="team-container">
          <h2 className="section-title">Meet Our Team</h2>
          <p className="section-subtitle">
            The passionate individuals behind SwapNest who work tirelessly to improve your experience
          </p>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <span className="team-avatar">{member.image}</span>
                <h3 className="team-name">{member.name}</h3>
                {/* <p className="team-role">{member.role}</p> */}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Ready to Join Our Community?</h2>
          <p className="cta-description">
            Start buying and selling today. Join millions of users who trust SwapNest for their marketplace needs.
          </p>
          <a href="#" className="cta-button">
            Get Started Today
            <ArrowRight className="cta-icon" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;