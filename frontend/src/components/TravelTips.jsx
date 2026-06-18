import React from 'react';
import { 
  FaBriefcase, 
  FaMoneyBillWave, 
  FaHeartbeat, 
  FaWifi, 
  FaBus, 
  FaCamera, 
  FaHandsHelping, 
  FaUtensils 
} from 'react-icons/fa';

const TravelTips = () => {
  const tips = [
    {
      id: 1,
      icon: <FaBriefcase />,
      title: 'Packing Essentials',
      description: 'Pack light but smart. Include essentials like medications, important documents, and weather-appropriate clothing.',
      tips: ['Carry photocopies of documents', 'Pack universal adapter', 'Bring lightweight raincoat']
    },
    {
      id: 2,
      icon: <FaMoneyBillWave />,
      title: 'Money Management',
      description: 'Plan your budget wisely and keep cash in multiple places for safety.',
      tips: ['Notify bank of travel', 'Carry ATM/credit cards', 'Keep emergency cash separately']
    },
    {
      id: 3,
      icon: <FaHeartbeat />,
      title: 'Health & Safety',
      description: 'Stay healthy during your trip by taking necessary precautions.',
      tips: ['Get travel insurance', 'Carry first aid kit', 'Drink boiled/bottled water']
    },
    {
      id: 4,
      icon: <FaWifi />,
      title: 'Stay Connected',
      description: 'Keep in touch with friends and family throughout your journey.',
      tips: ['Get local SIM card', 'Download offline maps', 'Share itinerary with family']
    },
    {
      id: 5,
      icon: <FaBus />,
      title: 'Local Transport',
      description: 'Navigate local transportation options like trains, buses, and taxis.',
      tips: ['Buy train tickets early', 'Use reliable taxi services', 'Learn basic local language']
    },
    {
      id: 6,
      icon: <FaCamera />,
      title: 'Capture Memories',
      description: 'Document your journey but don\'t forget to enjoy the moment.',
      tips: ['Respect local culture', 'Ask permission before photos', 'Use local tour guides']
    },
    {
      id: 7,
      icon: <FaHandsHelping />,
      title: 'Cultural Etiquette',
      description: 'Respect local traditions, dress modestly at religious sites, and follow local customs.',
      tips: ['Dress modestly at temples', 'Remove shoes before entering homes', 'Use right hand for eating/gifts']
    },
    {
      id: 8,
      icon: <FaUtensils />,
      title: 'Food & Gastronomy',
      description: 'Indulge in India\'s rich culinary heritage while keeping your stomach happy.',
      tips: ['Eat at busy local joints', 'Prefer hot, freshly cooked food', 'Avoid raw foods / tap water']
    }
  ];

  return (
    <section className="travel-tips-section">
      <div className="section-header-centered">
        <h2>Travel Tips & Guidelines</h2>
        <p>Make your journey smooth and memorable with these helpful tips</p>
      </div>

      <div className="travel-tips-grid">
        {tips.map((tip, index) => (
          <div 
            key={tip.id}
            className="travel-tip-card"
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <div className="travel-tip-icon">{tip.icon}</div>
            <h3>{tip.title}</h3>
            <p className="travel-tip-desc">
              {tip.description}
            </p>
            <div className="quick-tips-box">
              <h4>Quick Tips:</h4>
              <ul>
                {tip.tips.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TravelTips;
