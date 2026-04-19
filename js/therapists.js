/* ═══════════════════════════════════════════════════════════════════════
   SomeTalk — Therapist Directory
   ═══════════════════════════════════════════════════════════════════════ */

const MOCK_THERAPISTS = [
  {
    id: 't1',
    name: 'Dr. Ananya Sharma',
    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop',
    specialties: ['Anxiety', 'Depression', 'CBT'],
    location: 'mumbai',
    locationName: 'Mumbai, MH',
    rating: 4.9,
    reviews: 124,
    ratePerHour: 1500,
    onlineAvailable: true
  },
  {
    id: 't2',
    name: 'Dr. Rohan Desai',
    photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop',
    specialties: ['Trauma', 'PTSD', 'EMDR'],
    location: 'delhi',
    locationName: 'New Delhi, DL',
    rating: 4.8,
    reviews: 89,
    ratePerHour: 2000,
    onlineAvailable: true
  },
  {
    id: 't3',
    name: 'Meera Rao, M.A.',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop',
    specialties: ['Relationships', 'Grief', 'Mindfulness'],
    location: 'bangalore',
    locationName: 'Bangalore, KA',
    rating: 5.0,
    reviews: 210,
    ratePerHour: 1200,
    onlineAvailable: true
  },
  {
    id: 't4',
    name: 'Dr. Arush Patel',
    photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop',
    specialties: ['Bipolar Disorder', 'Stress Management'],
    location: 'online',
    locationName: 'Telehealth Only',
    rating: 4.7,
    reviews: 56,
    ratePerHour: 1000,
    onlineAvailable: true
  },
  {
    id: 't5',
    name: 'Sarah Joseph, Psychotherapist',
    photoUrl: 'https://images.unsplash.com/photo-1594824436998-d8bd249ba625?w=150&h=150&fit=crop',
    specialties: ['Addiction', 'Anger Management'],
    location: 'mumbai',
    locationName: 'Mumbai, MH',
    rating: 4.8,
    reviews: 142,
    ratePerHour: 1800,
    onlineAvailable: false
  },
  {
    id: 't6',
    name: 'Dr. Kabir Singh',
    photoUrl: 'https://images.unsplash.com/photo-1537368910025-7028045846f5?w=150&h=150&fit=crop',
    specialties: ['Career Counseling', 'Burnout'],
    location: 'delhi',
    locationName: 'New Delhi, DL',
    rating: 4.9,
    reviews: 310,
    ratePerHour: 2500,
    onlineAvailable: true
  }
];

let therapistsInitiated = false;

function initTherapists() {
  if (!therapistsInitiated) {
    renderTherapists('all');
    therapistsInitiated = true;
  }
}

function filterTherapists(location) {
  renderTherapists(location);
}

function renderTherapists(locationFilter = 'all') {
  const grid = document.getElementById('therapists-grid');
  if (!grid) return;

  grid.innerHTML = '';

  const filtered = MOCK_THERAPISTS.filter(t => {
    if (locationFilter === 'all') return true;
    return t.location === locationFilter;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '<p style="color: var(--text-400); padding: 20px;">No therapists found for this location.</p>';
    return;
  }

  filtered.forEach(therapist => {
    const defaultRate = therapist.ratePerHour;
    const discountedRate = Math.round(defaultRate * 0.90); // 10% discount

    const card = document.createElement('div');
    card.className = 'therapist-card';

    const tagsHtml = therapist.specialties.map(s => `<span class="tag">${s}</span>`).join('');

    card.innerHTML = `
      <div class="therapist-header">
        <img src="${therapist.photoUrl}" alt="${therapist.name}" class="therapist-photo" />
        <div class="therapist-info">
          <h3>${therapist.name}</h3>
          <p>📍 ${therapist.locationName}</p>
        </div>
      </div>

      <div class="therapist-rating">
        <span>⭐</span> ${therapist.rating.toFixed(1)} <span>· (${therapist.reviews} reviews)</span>
      </div>

      <div class="therapist-tags">
        ${tagsHtml}
        ${therapist.onlineAvailable ? '<span class="tag" style="background: rgba(126,184,160,0.1); color: var(--sage); border-color: transparent;">💻 Online Available</span>' : ''}
      </div>

      <div class="therapist-pricing">
        <div>
          <div class="price">₹${discountedRate} <span>/ session</span></div>
          <div class="student-discount">🏷️ 10% SomeTalk Discount</div>
        </div>
      </div>
      
      <button class="book-btn" onclick="alert('In a real app, this would open a booking calendar for ${therapist.name}.')">Book Session</button>
    `;

    grid.appendChild(card);
  });
}
