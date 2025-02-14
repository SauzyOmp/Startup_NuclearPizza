import React from 'react';

export function Map() {
  return (
    <main>
    <h1>Map</h1>
    
    <dl className="bomb-list">
      <div className="bomb">
        <dt>Little Boy</dt>
        <dd>
          <img src="images/little-boy.jpg" alt="Little Boy bomb image"></img>
          <p>A uranium-based bomb dropped on Hiroshima in 1945.</p>
        </dd>
      </div>
  
      <div className="bomb">
        <dt>Fat Man</dt>
        <dd>
          <img src="images/fat-man.jpg" alt="Fat Man bomb image"></img>
          <p>A plutonium-based bomb dropped on Nagasaki in 1945.</p>
        </dd>
      </div>
  
      <div className="bomb">
        <dt>Tsar Bomba</dt>
        <dd>
          <img src="images/tsar-bomba.jpg" alt="Tsar Bomba bomb image"></img>
          <p>The largest nuclear bomb ever detonated, tested by the Soviet Union in 1961.</p>
        </dd>
      </div>
  
      <div className="bomb">
        <dt>Castle Bravo</dt>
        <dd>
          <img src="images/castle-bravo.png" alt="Castle Bravo bomb image"></img>
          <p>A powerful hydrogen bomb test by the U.S. in 1954, causing unexpected fallout.</p>
        </dd>
      </div>
  
      <div className="bomb">
        <dt>Ivy Mike</dt>
        <dd>
          <img src="images/ivy-mike.jpg" alt="Ivy Mike bomb image"></img>
          <p>The first full-scale hydrogen bomb test by the U.S. in 1952.</p>
        </dd>
      </div>
    </dl>
  
    <div className="map-container">
      <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093747!2d144.95565131531803!3d-37.81732797975159!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0x5045675218cee40!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1619841676947!5m2!1sen!2sus" 
          width="600" 
          height="450" 
          style={{ border: "0"}} 
          allowFullscreen="" 
          loading="lazy">
      </iframe>
    </div>
    
    <div>
      Most pizzas Cooked by you before: <br></br>
      Congrats, that's X more than your friend: REALFRIEND99
    </div>
  </main>
  );
}