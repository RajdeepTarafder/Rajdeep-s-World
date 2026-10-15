import React from 'react';

interface ArtExhibitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArtExhibitModal: React.FC<ArtExhibitModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="rpg-modal-overlay">
      <div className="nes-container is-dark with-title modal-window art-window">
        <p className="title">ACRYLIC FINE-ART EXHIBITION: RAJDEEP TARAFDER</p>
        <div className="art-display-wrapper">
          <div className="art-frame">
            <img
              src="art-drawing.jpg"
              alt="Rajdeep Tarafder Fine Art Painting"
              className="art-full-image"
            />
          </div>
          <div className="art-meta-card">
            <h3>&ldquo;The Creative Geologist: Canvas to Core&rdquo;</h3>
            <p className="art-subtitle">Original Acrylic &amp; Mixed-Media Artwork by Rajdeep Tarafder</p>
            <div className="art-details">
              <div><strong>Medium:</strong> Acrylic Canvas, Technical Drafting &amp; Digital Graphics</div>
              <div><strong>Artist:</strong> Rajdeep Tarafder (Wellsite &amp; Exploration Geologist)</div>
              <div><strong>Design Arsenal:</strong> CorelDRAW, Adobe Photoshop, Hand Sketching, High-Precision Stratigraphic Drafting</div>
              <div><strong>Highlights:</strong> Head of Graphics &amp; Digital Media at Flysch &apos;22 (IIT ISM); designer of academic conclave visual identities and technical geological folios.</div>
            </div>
            <p className="art-philosophy">
              <em>&ldquo;Geological interpretation is where empirical physics meets visual pattern recognition. The same eye that drafts canvas art reads complex 3D seismic horizon unconformities and subtle microscopic mineral zoning.&rdquo;</em>
            </p>
          </div>
        </div>
        <div className="modal-footer-bar">
          <button onClick={onClose} className="nes-btn is-error">
            Return to Campus
          </button>
        </div>
      </div>
    </div>
  );
};
