import React from 'react';

interface ActionPromptProps {
  text: string;
  visible: boolean;
}

export const ActionPrompt: React.FC<ActionPromptProps> = ({ text, visible }) => {
  if (!visible) return null;

  return (
    <div className="action-prompt">
      <div className="nes-balloon from-left prompt-balloon">
        <p>[SPACE] {text}</p>
      </div>
    </div>
  );
};
