import { useChat } from "ai/react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const ChatApp = () => {
  const [showChat, setShowChat] = useState(false);

  return (
    <div>
      {showChat ? (
        <Chat />
      ) : (
        <LandingPage onStartChat={() => setShowChat(true)} />
      )}
    </div>
  );
};

type LandingPageProps = {
  onStartChat: () => void;
};

const LandingPage: React.FC<LandingPageProps> = ({ onStartChat }) => {
  return (
    <div style={styles.landingPage}>
      <div style={styles.content}>
      <h1 className={`text-5xl font-semibold ${styles.title}`}>
  Welcome to Our Chat Service <span className="highlighted-text">P.L.A.T.O  AI</span>
</h1>
        <p style={styles.subtitle}>Connect with us to get help or information instantly.</p>
        <button 
  onClick={onStartChat} 
  style={{
    marginTop: '20px',
    padding: '12px 30px', // Adjust padding for an oval shape
    fontSize: '18px',
    backgroundColor: '#4a90e2', // Cool blue color
    color: '#fff', // White text for contrast
    border: 'none',
    borderRadius: '50px', // Oval shape
    cursor: 'pointer',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)', // Subtle shadow for depth
    transition: 'background-color 0.3s, transform 0.3s', // Smooth transitions
    fontFamily: 'Arial, sans-serif', // Modern font
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    outline: 'none',
    backgroundImage: 'linear-gradient(135deg, #4a90e2, #0072ce)', // Gradient background for a cool effect
  }}
  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0072ce'} // Darker shade on hover
  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'linear-gradient(135deg, #4a90e2, #0072ce)'} // Reset to gradient
  onMouseDown={(e) => e.currentTarget.style.backgroundColor = '#005bb5'} // Even darker shade on click
  onMouseUp={(e) => e.currentTarget.style.backgroundColor = '#0072ce'} // Reset to gradient
>
  Start Chat
</button>
      </div>
    </div>
  );
};

const Chat = () => {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/openai",
  });

  const chatContainer = useRef<HTMLDivElement>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<number | null>(null);
  const [showAbout, setShowAbout] = useState(false);

  const scroll = () => {
    if (chatContainer.current) {
      const { offsetHeight, scrollHeight, scrollTop } = chatContainer.current;
      if (scrollHeight >= scrollTop + offsetHeight) {
        chatContainer.current.scrollTo(0, scrollHeight + 200);
      }
    }
  };

  useEffect(() => {
    scroll();
  }, [messages]);

  const handleFeedbackClick = (rating: number) => {
    setFeedback(rating);
    setShowFeedback(false);
    console.log("User feedback:", rating); // Replace with your feedback submission logic
  };

  const handleAboutClick = () => {
    setShowAbout(!showAbout);
  };

  const renderResponse = () => {
    return (
      <div className="response">
        {messages.map((m, index) => (
          <div
            key={m.id}
            className={`chat-line ${
              m.role === "user" ? "user-chat" : "ai-chat"
            }`}
          >
            <Image
              className="avatar"
              alt="avatar"
              width={40}
              height={40}
              src={m.role === "user" ? "/user.jpeg" : "/ai.jpg"}
            />
            <div style={{ width: "100%", marginLeft: "16px" }}>
              <p className="message">{m.content}</p>
              {index < messages.length - 1 && (
                <div className="horizontal-line" />
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const emojiFaces = [
    "😞", "😟", "😕", "😐", "🙂", "😊", "😀", "😁"
  ];

  return (
    <div ref={chatContainer} className="chat" style={{ position: 'relative', padding: '20px' }}>
      {/* About Button */}
      <button
        className="about-button"
        onClick={handleAboutClick}
        style={{
          position: 'fixed',
          right: '20px',
          top: '10px', // Adjusted to move the button slightly up
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          zIndex: 1000,
        }}
      >
        About
      </button>

      {/* About Modal */}
      {showAbout && (
        <div className="about-modal" style={{
          position: 'fixed',
          right: '20px',
          top: '60px', // Adjusted to align with the button
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          padding: '20px',
          borderRadius: '5px',
          zIndex: 1000,
          width: '300px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#000' }}>About P.L.A.T.O</h2>
          <p style={{ color: '#000' }}>p.l.a.t.o is an advanced AI assistant, It's built to handle everything from diagnostics to quick answers, all with a touch of subtle humor and efficiency.</p>

          <br></br>
    <h2 style={{color: '#000'}}>About the Developer</h2>
<p style={{color: '#000'}}>
    Hello! I'm Bitania yonas behind P.L.A.T.O, driven by a passion for technology and innovation. 
    With a strong background in computer science and experience across various tech stacks, 
    I created this chatbot to provide users with instant and reliable support. I'm always eager to learn and improve, 
    so feel free to reach out with any questions or feedback!
</p>
          <p style={{ color: '#000' }}>Check out my <a href="https://www.linkedin.com/in/bitania-yonas-yirse-46b99a26b/" target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>LinkedIn profile</a> for more information.</p>
          <button onClick={() => setShowAbout(false)} style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}>
            Close
          </button>
        </div>
      )}

      {renderResponse()}
      <form onSubmit={handleSubmit} className="chat-form">
        <input
          name="input-field"
          type="text"
          placeholder="Say anything"
          onChange={handleInputChange}
          value={input}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd', width: 'calc(100% - 100px)' }}
        />
        <button type="submit" className="send-button" style={{ padding: '10px', marginLeft: '5px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}>
          Send
        </button>
      </form>

      {/* Feedback Button */}
      <button
        className="feedback-button"
        onClick={() => setShowFeedback(!showFeedback)}
        style={{
          position: 'fixed',
          right: '20px',
          bottom: '20px',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          zIndex: 1000,
        }}
      >
        Feedback
      </button>

      {/* Feedback Emoji Faces */}
      {showFeedback && (
        <div className="emoji-container" style={{
          position: 'fixed',
          right: '20px',
          bottom: '60px',
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          padding: '10px',
          borderRadius: '5px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'row',
        }}>
          {emojiFaces.map((emoji, index) => (
            <span
              key={index}
              className="emoji-face"
              onClick={() => handleFeedbackClick(index + 1)}
              style={{ fontSize: '24px', cursor: 'pointer', margin: '5px' }}
            >
              {emoji}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  landingPage: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    justifyContent: 'center',
    alignItems: 'flex-start', // Align content to the left
    minHeight: '100vh', // Minimum height to cover the viewport
    backgroundColor: '#000', // Background color black
    backgroundImage: 'url("/bak.jpg")', // Add your background image here
    backgroundSize: 'cover', // Make sure the image covers the entire area
    backgroundPosition: 'center',
    color: '#fff', // Text color white for contrast
    textAlign: 'left' as 'left',
    padding: '20px',
    boxSizing: 'border-box' as 'border-box', // Ensure padding is included in width calculation
  },
  content: {
    maxWidth: '600px', // Adjust as needed
    width: '100%',
  },
  title: {
    fontSize: '4rem', // Responsive font size
    fontWeight: 'bold' as 'bold',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
  },
  startChatButton: {
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  // Media query for devices with max width of 768px (tablets and mobile devices)
  '@media (max-width: 768px)': {
    landingPage: {
      alignItems: 'center', // Center content on smaller screens
      textAlign: 'center' as 'center',
    },
    title: {
      fontSize: '3rem', // Smaller font size for mobile devices
    },
    subtitle: {
      fontSize: '1.25rem',
    },
    startChatButton: {
      padding: '0.5rem 1.5rem', // Larger padding for better touch target
      fontSize: '1.1rem',
    },
  },
};

export default ChatApp;
