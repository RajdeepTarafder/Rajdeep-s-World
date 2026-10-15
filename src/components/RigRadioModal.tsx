import React, { useState, useRef, useEffect } from 'react';
import { audio } from '../engine/audio';
import { RIG_RADIO_KNOWLEDGE } from '../data/careerData';

interface Message {
  id: string;
  sender: 'recruiter' | 'rajdeep';
  text: string;
}

interface RigRadioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export const RigRadioModal: React.FC<RigRadioModalProps> = ({
  isOpen,
  onClose,
  onOpen
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'rajdeep',
      text: "Ksshhht! Wellsite Geologist Rajdeep Tarafder standing by at GDA-A Doghouse. Over. What's your inquiry on exploration prospects, frontline ops, or research?"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const logRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = (type: string, queryText: string) => {
    audio.playRadioStatic();

    const userMsg: Message = {
      id: `user_${Date.now()}`,
      sender: 'recruiter',
      text: queryText
    };

    setMessages(prev => [...prev, userMsg]);

    let reply = RIG_RADIO_KNOWLEDGE[type];
    if (!reply) {
      const qLower = queryText.toLowerCase();
      if (qLower.includes('hydrogen') || qLower.includes('helium') || qLower.includes('h2') || qLower.includes('he')) {
        reply = RIG_RADIO_KNOWLEDGE.h2;
      } else if (qLower.includes('cement') || qLower.includes('rig') || qLower.includes('gda') || qLower.includes('wellsite')) {
        reply = RIG_RADIO_KNOWLEDGE.cement;
      } else if (qLower.includes('petrel') || qLower.includes('seismic') || qLower.includes('software') || qLower.includes('bexb') || qLower.includes('prospect')) {
        reply = RIG_RADIO_KNOWLEDGE.petrel;
      } else if (qLower.includes('thesis') || qLower.includes('diamond') || qLower.includes('machine learning') || qLower.includes('epma')) {
        reply = RIG_RADIO_KNOWLEDGE.thesis;
      } else if (qLower.includes('pda') || qLower.includes('pressure') || qLower.includes('gas') || qLower.includes('kick')) {
        reply = RIG_RADIO_KNOWLEDGE.pda;
      } else if (qLower.includes('football') || qLower.includes('fitness') || qLower.includes('sports') || qLower.includes('gym')) {
        reply = RIG_RADIO_KNOWLEDGE.sports;
      } else {
        reply = `Rig Floor copy: Wellsite Geologist Rajdeep Tarafder standing by at GDA-A Doghouse. CPF: 141604, DOJ: 06.11.2023. All operational parameters nominal with zero LTI.`;
      }
    }

    setTimeout(() => {
      const botMsg: Message = {
        id: `bot_${Date.now()}`,
        sender: 'rajdeep',
        text: `Ksshhht! ${reply}`
      };
      setMessages(prev => [...prev, botMsg]);
    }, 350);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    handleSend('custom', inputText.trim());
    setInputText('');
  };

  return (
    <>
      {/* Floating Walkie-Talkie Button */}
      <button
        onClick={() => {
          audio.playRadioStatic();
          onOpen();
        }}
        className="rig-radio-floating-btn"
        title="Open Rig Walkie-Talkie Radio (Recruiter Q&A)"
      >
        <span className="radio-antenna" />
        <span className="radio-icon">📻</span>
        <span className="radio-label">RIG RADIO Q&amp;A</span>
      </button>

      {/* Walkie-Talkie Modal */}
      {isOpen && (
        <div className="rpg-modal-overlay">
          <div className="nes-container is-dark with-title modal-window radio-window">
            <p className="title">VHF RIG WALKIE-TALKIE RADIO (CHANNEL 16)</p>
            <div className="radio-body">
              <div className="radio-log" ref={logRef}>
                {messages.map(m => (
                  <div
                    key={m.id}
                    className={`radio-msg ${m.sender === 'recruiter' ? 'outgoing' : 'incoming'}`}
                  >
                    <strong>
                      {m.sender === 'recruiter'
                        ? '👤 Base / Recruiter:'
                        : '📻 Rajdeep Tarafder (Wellsite Ops):'}
                    </strong>{' '}
                    &ldquo;{m.text}&rdquo;
                  </div>
                ))}
              </div>

              <div className="radio-chips-label">Quick Transmissions:</div>
              <div className="radio-chips">
                <button
                  type="button"
                  className="nes-btn is-warning radio-chip"
                  onClick={() => handleSend('h2', 'Status on Unconventional H2 & Helium play concepts?')}
                >
                  ⚡ Natural H2 / He
                </button>
                <button
                  type="button"
                  className="nes-btn is-error radio-chip"
                  onClick={() => handleSend('cement', 'Brief me on the GDA-A Samastipur cement squeeze remediation.')}
                >
                  🛢️ GDA-A Cement Squeeze
                </button>
                <button
                  type="button"
                  className="nes-btn is-primary radio-chip"
                  onClick={() => handleSend('petrel', 'How were BExB and EPMB prospects matured in Petrel?')}
                >
                  💻 Petrel 3D Seismic
                </button>
                <button
                  type="button"
                  className="nes-btn is-success radio-chip"
                  onClick={() => handleSend('thesis', 'Explain your EPMA garnet ML research at IIT ISM.')}
                >
                  💎 ML Diamond Thesis
                </button>
                <button
                  type="button"
                  className="nes-btn radio-chip"
                  onClick={() => handleSend('pda', 'What is your 24/7 PDA and mud gas monitoring workflow?')}
                >
                  📊 Pore Pressure / PDA
                </button>
                <button
                  type="button"
                  className="nes-btn is-warning radio-chip"
                  onClick={() => handleSend('sports', 'Tell me about athletic leadership and football.')}
                >
                  ⚽ Football &amp; Trekking
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="radio-input-row">
                <input
                  type="text"
                  className="nes-input is-dark"
                  placeholder="Transmit custom query to the doghouse..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <button type="submit" className="nes-btn is-primary">
                  Transmit [Enter]
                </button>
              </form>
            </div>
            <div className="modal-footer-bar">
              <button onClick={onClose} className="nes-btn is-error">
                Radio Standby (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
