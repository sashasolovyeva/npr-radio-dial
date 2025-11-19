"use client";

import React, { useState, useRef } from "react";

export default function CarRadio() {
  const [dialRotation, setDialRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dialRef = useRef(null);
  const lastAngleRef = useRef(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    if (!dialRef.current) return;

    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    lastAngleRef.current = angle;
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !dialRef.current) return;

    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);

    let deltaAngle = angle - lastAngleRef.current;

    // Handle angle wrap-around
    if (deltaAngle > Math.PI) deltaAngle -= 2 * Math.PI;
    if (deltaAngle < -Math.PI) deltaAngle += 2 * Math.PI;

    setDialRotation((prev) => {
      const newRotation = prev + (deltaAngle * 180) / Math.PI;
      // Limit rotation to reasonable range (-180 to 180 degrees)
      return Math.max(-180, Math.min(180, newRotation));
    });

    lastAngleRef.current = angle;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add global mouse event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);

  // Calculate frequency based on dial rotation
  const frequency = 88 + ((dialRotation + 180) / 360) * 20; // 88-108 MHz range

  // Calculate tuning indicator position (0-100%)
  const indicatorPosition = ((dialRotation + 180) / 360) * 100;

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "32px",
      backgroundColor: "#1a1a1a",
      minHeight: "100vh",
      fontFamily: "Arial, sans-serif",
    },
    radio: {
      backgroundColor: "#000",
      padding: "24px",
      borderRadius: "8px",
      border: "1px solid #666",
      width: "400px",
      boxSizing: "border-box",
    },
    title: {
      color: "#fff",
      fontSize: "20px",
      marginBottom: "24px",
      textAlign: "center",
      margin: "0 0 24px 0",
    },
    frequencyDisplay: {
      color: "#00ff00",
      fontSize: "24px",
      fontFamily: "monospace",
      textAlign: "center",
      marginBottom: "24px",
    },
    frequencyScale: {
      position: "relative",
      width: "100%",
      height: "48px",
      backgroundColor: "#333",
      border: "1px solid #666",
      marginBottom: "24px",
    },
    scaleMarkings: {
      position: "absolute",
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 8px",
    },
    scaleNumber: {
      color: "#fff",
      fontSize: "12px",
    },
    tuningIndicator: {
      position: "absolute",
      top: "0",
      width: "2px",
      height: "100%",
      backgroundColor: "#ff0000",
      transition: "left 0.1s ease",
      left: `${indicatorPosition}%`,
      transform: "translateX(-50%)",
    },
    dialContainer: {
      display: "flex",
      justifyContent: "center",
    },
    dial: {
      width: "96px",
      height: "96px",
      backgroundColor: "#555",
      borderRadius: "50%",
      border: "4px solid #888",
      cursor: isDragging ? "grabbing" : "grab",
      position: "relative",
      userSelect: "none",
      transform: `rotate(${dialRotation}deg)`,
    },
    dialIndicator: {
      position: "absolute",
      top: "8px",
      left: "50%",
      width: "2px",
      height: "24px",
      backgroundColor: "#fff",
      transform: "translateX(-50%)",
    },
    dialCenter: {
      position: "absolute",
      top: "50%",
      left: "50%",
      width: "8px",
      height: "8px",
      backgroundColor: "#aaa",
      borderRadius: "50%",
      transform: "translate(-50%, -50%)",
    },
    instructions: {
      color: "#aaa",
      fontSize: "14px",
      textAlign: "center",
      marginTop: "16px",
    },
  };

  const frequencies = ["culture", "music", "news", "local", "tiny desk", "national", "world"];

  // Map dial rotation to topic index
  const topicIndex = Math.round(((dialRotation + 180) / 360) * (frequencies.length - 1));
  const currentTopic = frequencies[topicIndex];

  // Placeholder stories for each topic
  const storiesByTopic = {
    culture: [
      { title: "NPR staffers pick their favorite fiction reads of 2025 so far", summary: "After long days focused on the facts, our newsroom reads a lot of fiction at home. We asked our NPR colleagues what they've enjoyed reading so far this year. Here's what they told us." },
      { title: "'Love Island' and modern dating: why romance is dead", summary: "This season of Love Island USA is making some viewers feel exasperated. Is it a reflection of today's dating scene?" },
      { title: "Are we in the midst of another mustache renaissance?", summary: "Mustaches are having a moment. Here's what it's like living with one." },
    ],
    music: [
      { title: "2025's best songs (so far)", summary: "This week we share our wildly incomplete list of the year's best tracks so far, including bangers from PinkPantheress and HAIM, a slow-burner from Lana Del Rey, dystopian rap from clipping and more." },
      { title: "Benson Boone and Karol G can't displace Morgan Wallen on the charts", summary: "Benson Boone, Karol G and the KPop Demon Hunters soundtrack don't come anywhere near displacing Morgan Wallen." },
      { title: "Summoning the ancestors with harpist Brandee Younger", summary: "Lara Downes sits down with the brilliant jazz harpist to discuss the power of female lineage in the worlds of jazz and classical music." },
    ],
    news: [
      { title: "The U.S. labor market remains solid, with employers adding 147,000 jobs last month", summary: "U.S. employers added 147,000 jobs in June as the unemployment rate dipped to 4.1%. Job gains were concentrated in health care and state and local government." },
      { title: "Hi Serendipity Days Participants!", summary: "Long live penguin awards." },
      { title: "Hi Serendipity Days Participants!", summary: "Long live penguin awards." },
    ],
    local: [
      { title: "Hi Serendipity Days Participants!", summary: "Long live penguin awards." },
      { title: "Hi Serendipity Days Participants!", summary: "Long live penguin awards." },
      { title: "Hi Serendipity Days Participants!", summary: "Long live penguin awards." },
    ],
    "tiny desk": [
      { title: "Ruby Ibarra", summary: "Community and culture are two guiding forces in Ruby Ibarra's music. The Filipina American rapper — and 2025 Tiny Desk Contest winner — is joined by rock legend June Millington and an all-Filipino band." },
      { title: "The Cast of Buena Vista Social Club", summary: "The Broadway musical is a living, breathing and deeply grooving homage to a bygone era of Cuban music." },
      { title: "Katie Gavin", summary: "Katie Gavin is the kind of performer whose dynamism knows no bounds. Whether she's performing with her pop band MUNA or solo, Gavin is a captivating presence." },
    ],
    national: [
      { title: "Hi Serendipity Days Participants!", summary: "Long live penguin awards." },
      { title: "Hi Serendipity Days Participants!", summary: "Long live penguin awards." },
      { title: "Hi Serendipity Days Participants!", summary: "Long live penguin awards." },
    ],
    world: [
      { title: "Hi Serendipity Days Participants!", summary: "Long live penguin awards." },
      { title: "Hi Serendipity Days Participants!", summary: "Long live penguin awards." },
      { title: "Hi Serendipity Days Participants!", summary: "Long live penguin awards." },
    ],
  };

  // Stories component
  function Stories({ topic }) {
    const stories = storiesByTopic[topic] || [];
    return (
      <div style={{ marginTop: "32px", color: "#fff" }}>
        <h3 style={{ marginBottom: "12px" }}>Stories: {topic.charAt(0).toUpperCase() + topic.slice(1)}</h3>
        <ul style={{ paddingLeft: 0, listStyle: "none" }}>
          {stories.map((story, idx) => (
            <li key={idx} style={{ marginBottom: "16px", background: "#222", padding: "12px", borderRadius: "6px" }}>
              <strong>{story.title}</strong>
              <div style={{ color: "#aaa", marginTop: "4px" }}>{story.summary}</div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Topic to gradient mapping
  const topicGradients = {
    culture: "linear-gradient(135deg, #A8147C 0%, #E73BB4 100%)",
    music: "linear-gradient(135deg, #FFE605 0%, #FFF06B 100%)",
    news: "linear-gradient(135deg, #0E3143 0%, #206F98 100%)",
    local: "linear-gradient(135deg, #1D4D53 0%, #37999F 100%)",
    "tiny desk": "linear-gradient(135deg, #1C0E2F 0%, #4B267E 100%)",
    national: "linear-gradient(135deg, #3A4155 0%, #636F92 100%)",
    world: "linear-gradient(135deg, #0B1D0B 0%, #296629 100%)",
  };

  const containerStyle = {
    ...styles.container,
    background: topicGradients[currentTopic] || styles.container.backgroundColor,
  };

  return (
    <div style={containerStyle}>
      <div style={styles.radio}>
        {/* Frequency Display */}
        <div style={styles.frequencyDisplay}>{currentTopic}</div>

        {/* Frequency Scale */}
        <div style={styles.frequencyScale}>
          {/* Scale markings */}
          <div style={styles.scaleMarkings}>
            {frequencies.map((freq) => (
              <div key={freq} style={styles.scaleNumber}>
                {freq}
              </div>
            ))}
          </div>

          {/* Tuning Indicator */}
          <div style={styles.tuningIndicator} />
        </div>

        {/* Dial */}
        <div style={styles.dialContainer}>
          <div ref={dialRef} style={styles.dial} onMouseDown={handleMouseDown}>
            {/* Dial indicator line */}
            <div style={styles.dialIndicator} />

            {/* Center dot */}
            <div style={styles.dialCenter} />
          </div>
        </div>

        <div style={styles.instructions}>Click and drag the dial to tune</div>
        {/* Stories for the current topic */}
        <Stories topic={currentTopic} />
      </div>
    </div>
  );
}