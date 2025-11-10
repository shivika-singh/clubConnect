const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const Club = require('../models/Club');
const Event = require('../models/Event');

const clubsData = [
  {
    name: 'IEEE',
    email: 'ieee@muj.edu.in',
    password: 'ieee1234',
    description: 'IEEE is the world\'s largest technical professional organization dedicated to advancing technology for the benefit of humanity. We organize technical workshops, coding competitions, and industry interactions.',
    category: 'Technology',
    location: 'Manipal University Jaipur',
    website: 'https://ieee.org',
    contactPhone: '+91-9876543210',
    foundedYear: 2015,
    memberCount: 250,
    profileImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
    membershipFee: 500,
    membershipDriveOpen: true,
    socialMedia: {
      instagram: 'https://instagram.com/ieee_muj',
      facebook: 'https://facebook.com/ieee_muj',
      linkedin: 'https://linkedin.com/company/ieee-muj'
    }
  },
  {
    name: 'ACM',
    email: 'acm@muj.edu.in',
    password: 'acm1234',
    description: 'Association for Computing Machinery - Promoting excellence in computing and computer science through workshops, hackathons, and research activities.',
    category: 'Technology',
    location: 'Manipal University Jaipur',
    website: 'https://acm.org',
    contactPhone: '+91-9876543211',
    foundedYear: 2016,
    memberCount: 200,
    profileImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
    membershipFee: 500,
    membershipDriveOpen: true,
    socialMedia: {
      instagram: 'https://instagram.com/acm_muj',
      linkedin: 'https://linkedin.com/company/acm-muj'
    }
  },
  {
    name: 'Cinefelia',
    email: 'cinefelia@muj.edu.in',
    password: 'cinefelia1234',
    description: 'Explore your cinematic talents through films, short movies, and dramatic performances. We organize film festivals, screenings, and stage performances.',
    category: 'Cultural',
    location: 'Manipal University Jaipur',
    contactPhone: '+91-9876543212',
    foundedYear: 2014,
    memberCount: 150,
    profileImage: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=400',
    membershipFee: 300,
    membershipDriveOpen: true,
    socialMedia: {
      instagram: 'https://instagram.com/cinefelia_muj',
      facebook: 'https://facebook.com/cinefelia_muj'
    }
  },
  {
    name: 'The Music Club',
    email: 'tmc@muj.edu.in',
    password: 'tmc1234',
    description: 'For all music enthusiasts! Join us for jam sessions, concerts, and music workshops. We welcome all instruments and vocal talents.',
    category: 'Cultural',
    location: 'Manipal University Jaipur',
    contactPhone: '+91-9876543213',
    foundedYear: 2014,
    memberCount: 180,
    profileImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    membershipFee: 300,
    membershipDriveOpen: true,
    socialMedia: {
      instagram: 'https://instagram.com/tmc_muj',
      youtube: 'https://youtube.com/@tmc_muj'
    }
  },
  {
    name: 'Aperture',
    email: 'aperture@muj.edu.in',
    password: 'aperture1234',
    description: 'Capture moments, tell stories through lenses. We organize photography walks, workshops, and exhibitions.',
    category: 'Arts',
    location: 'Manipal University Jaipur',
    contactPhone: '+91-9876543214',
    foundedYear: 2015,
    memberCount: 120,
    profileImage: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400',
    membershipFee: 400,
    membershipDriveOpen: true,
    socialMedia: {
      instagram: 'https://instagram.com/aperture_muj',
      facebook: 'https://facebook.com/aperture_muj'
    }
  },
  {
    name: 'Sports Club',
    email: 'sports@muj.edu.in',
    password: 'sports1234',
    description: 'Promoting fitness and sportsmanship. Organizing tournaments, fitness sessions, and sports events throughout the year.',
    category: 'Sports',
    location: 'Manipal University Jaipur',
    contactPhone: '+91-9876543215',
    foundedYear: 2013,
    memberCount: 300,
    profileImage: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400',
    membershipFee: 200,
    membershipDriveOpen: true,
    socialMedia: {
      instagram: 'https://instagram.com/sports_muj',
      facebook: 'https://facebook.com/sports_muj'
    }
  },
  {
    name: 'IEEE RAS',
    email: 'ieee_ras@muj.edu.in',
    password: 'ieee_ras1234',
    description: 'IEEE Robotics and Automation Society - Building the future with robotics! Workshops on Arduino, Raspberry Pi, and robotics competitions.',
    category: 'Technology',
    location: 'Manipal University Jaipur',
    contactPhone: '+91-9876543216',
    foundedYear: 2017,
    memberCount: 100,
    profileImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400',
    membershipFee: 600,
    membershipDriveOpen: true,
    socialMedia: {
      instagram: 'https://instagram.com/ieee_ras_muj',
      linkedin: 'https://linkedin.com/company/ieee-ras-muj'
    }
  },
  {
    name: 'Litmus',
    email: 'litmus@muj.edu.in',
    password: 'litmus1234',
    description: 'For book lovers and writers. Book discussions, poetry sessions, and creative writing workshops.',
    category: 'Academic',
    location: 'Manipal University Jaipur',
    contactPhone: '+91-9876543217',
    foundedYear: 2014,
    memberCount: 80,
    profileImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
    membershipFee: 0,
    membershipDriveOpen: true,
    socialMedia: {
      instagram: 'https://instagram.com/litmus_muj',
      facebook: 'https://facebook.com/litmus_muj'
    }
  }
];

const eventsData = [
  // IEEE Events
  {
    title: 'Tech Symposium 2024',
    description: 'Annual technical conference featuring industry experts, research presentations, and networking opportunities. Join us for workshops on AI, Machine Learning, and Web Development.',
    category: 'Workshop',
    eventType: 'Offline',
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    startTime: '09:00',
    endTime: '18:00',
    location: 'Main Auditorium',
    venue: 'Block A, Ground Floor',
    maxParticipants: 200,
    registrationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    registrationFee: 0,
    isRegistrationOpen: true,
    poster: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    images: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'
    ],
    tags: ['Technology', 'AI', 'Workshop', 'Networking'],
    requirements: 'Basic knowledge of programming recommended',
    agenda: [
      { time: '09:00 - 10:00', activity: 'Registration and Welcome' },
      { time: '10:00 - 11:30', activity: 'Keynote: Future of AI' },
      { time: '11:30 - 12:00', activity: 'Tea Break' },
      { time: '12:00 - 13:30', activity: 'Workshop: Machine Learning Basics' },
      { time: '13:30 - 14:30', activity: 'Lunch Break' },
      { time: '14:30 - 16:00', activity: 'Panel Discussion: Industry Trends' },
      { time: '16:00 - 17:30', activity: 'Hands-on Session' },
      { time: '17:30 - 18:00', activity: 'Networking and Closing' }
    ],
    speakers: [
      { name: 'Dr. John Smith', designation: 'Senior AI Researcher, Google', image: 'https://i.pravatar.cc/150?img=12' },
      { name: 'Jane Doe', designation: 'Tech Lead, Microsoft', image: 'https://i.pravatar.cc/150?img=47' }
    ],
    contactEmail: 'ieee@muj.edu.in',
    contactPhone: '+91-9876543210',
    status: 'published',
    featured: true
  },
  {
    title: 'Web Development Bootcamp',
    description: 'Intensive 2-day bootcamp on modern web development. Learn React, Node.js, and MongoDB. Build a complete project from scratch.',
    category: 'Workshop',
    eventType: 'Offline',
    startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
    startTime: '10:00',
    endTime: '17:00',
    location: 'Computer Lab, Block B',
    maxParticipants: 50,
    registrationDeadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    registrationFee: 500,
    isRegistrationOpen: true,
    poster: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    images: ['https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800'],
    tags: ['Web Development', 'React', 'Node.js'],
    contactEmail: 'ieee@muj.edu.in',
    status: 'published',
    featured: false
  },
  {
    title: 'Hackathon 2024',
    description: '24-hour coding competition. Build innovative solutions, compete with peers, and win exciting prizes. Food and refreshments provided.',
    category: 'Competition',
    eventType: 'Offline',
    startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    endDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
    startTime: '10:00',
    endTime: '10:00',
    location: 'Computer Lab, Block B',
    venue: 'Block B, 2nd Floor',
    maxParticipants: 100,
    registrationDeadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
    registrationFee: 100,
    isRegistrationOpen: true,
    poster: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
    images: [
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800'
    ],
    tags: ['Hackathon', 'Coding', 'Competition', '24 Hours'],
    requirements: 'Laptop required. Team of 2-4 members.',
    agenda: [
      { time: '10:00', activity: 'Opening Ceremony and Problem Statement' },
      { time: '10:30', activity: 'Hacking Begins' },
      { time: '13:00', activity: 'Lunch' },
      { time: '19:00', activity: 'Dinner' },
      { time: '02:00', activity: 'Midnight Snacks' },
      { time: '08:00', activity: 'Breakfast' },
      { time: '10:00', activity: 'Hacking Ends and Presentations' },
      { time: '12:00', activity: 'Prize Distribution' }
    ],
    contactEmail: 'acm@muj.edu.in',
    contactPhone: '+91-9876543211',
    status: 'published',
    featured: true
  },
  {
    title: 'Photography Workshop',
    description: 'Learn professional photography techniques, camera handling, composition, and post-processing. Bring your camera if you have one.',
    category: 'Workshop',
    eventType: 'Offline',
    startDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
    endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    startTime: '14:00',
    endTime: '17:00',
    location: 'Arts Building Room 101',
    maxParticipants: 30,
    registrationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    registrationFee: 0,
    isRegistrationOpen: true,
    poster: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800',
    images: [
      'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800'
    ],
    tags: ['Photography', 'Workshop', 'Arts'],
    contactEmail: 'photography@muj.edu.in',
    contactPhone: '+91-9876543214',
    status: 'published',
    featured: false
  },
  {
    title: 'Annual Cultural Fest',
    description: 'A grand celebration of culture with dance performances, music, drama, and food stalls. Join us for an evening of entertainment and fun!',
    category: 'Cultural',
    eventType: 'Offline',
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    startTime: '18:00',
    endTime: '22:00',
    location: 'Open Air Theater',
    maxParticipants: 500,
    registrationDeadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    registrationFee: 0,
    isRegistrationOpen: true,
    poster: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    images: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
      'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800'
    ],
    tags: ['Cultural', 'Festival', 'Entertainment'],
    contactEmail: 'drama@muj.edu.in',
    contactPhone: '+91-9876543212',
    status: 'published',
    featured: true
  },
  {
    title: 'Robotics Workshop',
    description: 'Hands-on workshop on Arduino and Raspberry Pi. Build your first robot and learn about sensors, motors, and programming.',
    category: 'Workshop',
    eventType: 'Offline',
    startDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000), // 16 days from now
    endDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
    startTime: '10:00',
    endTime: '16:00',
    location: 'Robotics Lab, Block C',
    maxParticipants: 40,
    registrationDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    registrationFee: 200,
    isRegistrationOpen: true,
    poster: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
    images: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800'
    ],
    tags: ['Robotics', 'Arduino', 'Workshop'],
    requirements: 'Basic programming knowledge. Kit will be provided.',
    contactEmail: 'robotics@muj.edu.in',
    contactPhone: '+91-9876543216',
    status: 'published',
    featured: false
  },
  {
    title: 'Book Reading Session',
    description: 'Join us for an engaging book discussion on contemporary literature. Share your thoughts and connect with fellow book lovers.',
    category: 'Social',
    eventType: 'Offline',
    startDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), // 18 days from now
    endDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    startTime: '15:00',
    endTime: '17:00',
    location: 'Library Conference Room',
    maxParticipants: 25,
    registrationDeadline: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
    registrationFee: 0,
    isRegistrationOpen: true,
    poster: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800',
    images: [
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800'
    ],
    tags: ['Books', 'Discussion', 'Literary'],
    contactEmail: 'literary@muj.edu.in',
    contactPhone: '+91-9876543217',
    status: 'published',
    featured: false
  },
  // More events for IEEE
  {
    title: 'Machine Learning Workshop',
    description: 'Hands-on workshop on machine learning fundamentals, neural networks, and practical applications. Perfect for beginners and intermediate learners.',
    category: 'Workshop',
    eventType: 'Offline',
    startDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
    endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    startTime: '10:00',
    endTime: '17:00',
    location: 'Computer Lab, Block A',
    maxParticipants: 50,
    registrationDeadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    registrationFee: 0,
    isRegistrationOpen: true,
    poster: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800',
    tags: ['Machine Learning', 'AI', 'Workshop'],
    status: 'published',
    featured: true
  },
  // More events for ACM
  {
    title: 'Code Sprint 2024',
    description: '24-hour coding marathon. Solve challenging problems, build projects, and compete for prizes. Food and snacks provided.',
    category: 'Competition',
    eventType: 'Offline',
    startDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000), // 22 days from now
    endDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
    startTime: '09:00',
    endTime: '09:00',
    location: 'ACM Lab, Block B',
    maxParticipants: 80,
    registrationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    registrationFee: 50,
    isRegistrationOpen: true,
    poster: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    tags: ['Coding', 'Competition', 'Hackathon'],
    status: 'published',
    featured: true
  },
  // Events for Cinefelia
  {
    title: 'Film Screening: Classic Cinema Night',
    description: 'Join us for a screening of classic films followed by discussion and analysis. Popcorn and refreshments provided.',
    category: 'Cultural',
    eventType: 'Offline',
    startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    startTime: '18:00',
    endTime: '21:00',
    location: 'Student Center Theater',
    maxParticipants: 100,
    registrationDeadline: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000),
    registrationFee: 0,
    isRegistrationOpen: true,
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
    tags: ['Film', 'Cinema', 'Cultural'],
    status: 'published',
    featured: false
  },
  {
    title: 'Short Film Making Workshop',
    description: 'Learn the art of short film making - from scriptwriting to editing. Bring your creativity and cameras!',
    category: 'Workshop',
    eventType: 'Offline',
    startDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
    endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    startTime: '14:00',
    endTime: '18:00',
    location: 'Media Lab, Block C',
    maxParticipants: 30,
    registrationDeadline: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
    registrationFee: 100,
    isRegistrationOpen: true,
    poster: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    tags: ['Film Making', 'Workshop', 'Creative'],
    status: 'published',
    featured: false
  },
  // Events for The Music Club
  {
    title: 'Acoustic Night',
    description: 'An evening of acoustic performances by students. Showcase your talent or enjoy the music with friends.',
    category: 'Cultural',
    eventType: 'Offline',
    startDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000), // 17 days from now
    endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
    startTime: '19:00',
    endTime: '22:00',
    location: 'Open Air Theater',
    maxParticipants: 200,
    registrationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    registrationFee: 0,
    isRegistrationOpen: true,
    poster: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    tags: ['Music', 'Performance', 'Cultural'],
    status: 'published',
    featured: true
  },
  {
    title: 'Guitar Workshop',
    description: 'Learn guitar basics or improve your skills. All levels welcome. Guitars provided for beginners.',
    category: 'Workshop',
    eventType: 'Offline',
    startDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // 28 days from now
    endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
    startTime: '15:00',
    endTime: '17:00',
    location: 'Music Room, Arts Building',
    maxParticipants: 25,
    registrationDeadline: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000),
    registrationFee: 150,
    isRegistrationOpen: true,
    poster: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    tags: ['Music', 'Guitar', 'Workshop'],
    status: 'published',
    featured: false
  },
  // Events for Aperture
  {
    title: 'Photography Walk',
    description: 'Join us for a photography walk around campus. Capture beautiful moments and learn composition techniques.',
    category: 'Workshop',
    eventType: 'Offline',
    startDate: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000), // 19 days from now
    endDate: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000),
    startTime: '06:00',
    endTime: '09:00',
    location: 'Campus Grounds',
    maxParticipants: 40,
    registrationDeadline: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
    registrationFee: 0,
    isRegistrationOpen: true,
    poster: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800',
    tags: ['Photography', 'Outdoor', 'Workshop'],
    status: 'published',
    featured: false
  },
  {
    title: 'Photo Exhibition 2024',
    description: 'Exhibition of student photography work. Submit your best shots and vote for your favorites!',
    category: 'Cultural',
    eventType: 'Offline',
    startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    endDate: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000),
    startTime: '10:00',
    endTime: '18:00',
    location: 'Art Gallery, Block D',
    maxParticipants: null,
    registrationDeadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
    registrationFee: 0,
    isRegistrationOpen: true,
    poster: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800',
    tags: ['Photography', 'Exhibition', 'Arts'],
    status: 'published',
    featured: true
  },
  // Events for Sports Club
  {
    title: 'Inter-College Football Tournament',
    description: 'Annual inter-college football tournament. Form your team and compete for the championship trophy!',
    category: 'Sports',
    eventType: 'Offline',
    startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
    endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    startTime: '08:00',
    endTime: '18:00',
    location: 'Football Ground',
    maxParticipants: 200,
    registrationDeadline: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000),
    registrationFee: 200,
    isRegistrationOpen: true,
    poster: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800',
    tags: ['Football', 'Tournament', 'Sports'],
    status: 'published',
    featured: true
  },
  {
    title: 'Yoga and Meditation Session',
    description: 'Weekly yoga and meditation session for stress relief and mental wellness. All levels welcome.',
    category: 'Social',
    eventType: 'Offline',
    startDate: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000), // 13 days from now
    endDate: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000),
    startTime: '07:00',
    endTime: '08:00',
    location: 'Yoga Hall, Sports Complex',
    maxParticipants: 50,
    registrationDeadline: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
    registrationFee: 0,
    isRegistrationOpen: true,
    poster: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    tags: ['Yoga', 'Wellness', 'Health'],
    status: 'published',
    featured: false
  },
  // Events for IEEE RAS
  {
    title: 'Robotics Competition',
    description: 'Build and compete with your robots. Categories include line following, obstacle avoidance, and sumo wrestling.',
    category: 'Competition',
    eventType: 'Offline',
    startDate: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000), // 24 days from now
    endDate: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000),
    startTime: '10:00',
    endTime: '18:00',
    location: 'Robotics Lab, Block C',
    maxParticipants: 60,
    registrationDeadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
    registrationFee: 300,
    isRegistrationOpen: true,
    poster: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
    tags: ['Robotics', 'Competition', 'Technology'],
    status: 'published',
    featured: true
  },
  {
    title: 'IoT Workshop',
    description: 'Learn about Internet of Things - connect devices, build smart projects, and explore IoT applications.',
    category: 'Workshop',
    eventType: 'Offline',
    startDate: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000), // 26 days from now
    endDate: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000),
    startTime: '10:00',
    endTime: '16:00',
    location: 'Electronics Lab, Block B',
    maxParticipants: 35,
    registrationDeadline: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000),
    registrationFee: 250,
    isRegistrationOpen: true,
    poster: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    tags: ['IoT', 'Workshop', 'Technology'],
    status: 'published',
    featured: false
  },
  // Events for Litmus
  {
    title: 'Poetry Slam',
    description: 'Express yourself through poetry! Open mic session for poets and poetry enthusiasts. Share your work or listen to others.',
    category: 'Cultural',
    eventType: 'Offline',
    startDate: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000), // 27 days from now
    endDate: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000),
    startTime: '17:00',
    endTime: '19:00',
    location: 'Library Conference Room',
    maxParticipants: 40,
    registrationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    registrationFee: 0,
    isRegistrationOpen: true,
    poster: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800',
    tags: ['Poetry', 'Literature', 'Cultural'],
    status: 'published',
    featured: false
  },
  {
    title: 'Creative Writing Workshop',
    description: 'Enhance your writing skills with expert guidance. Learn storytelling, character development, and narrative techniques.',
    category: 'Workshop',
    eventType: 'Offline',
    startDate: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000), // 29 days from now
    endDate: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000),
    startTime: '14:00',
    endTime: '17:00',
    location: 'Library Seminar Hall',
    maxParticipants: 30,
    registrationDeadline: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000),
    registrationFee: 100,
    isRegistrationOpen: true,
    poster: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800',
    tags: ['Writing', 'Workshop', 'Literature'],
    status: 'published',
    featured: false
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    await Club.deleteMany({});
    await Event.deleteMany({});
    console.log('Cleared existing data');

    // Create clubs with hashed passwords
    const createdClubs = [];
    for (const clubData of clubsData) {
      const club = new Club(clubData);
      await club.save(); // This will trigger the password hashing pre-save hook
      createdClubs.push(club);
    }
    console.log(`Created ${createdClubs.length} clubs`);

    // Create events and assign to clubs
    const ieeeClub = createdClubs.find(c => c.name === 'IEEE');
    const acmClub = createdClubs.find(c => c.name === 'ACM');
    const apertureClub = createdClubs.find(c => c.name === 'Aperture');
    const cinefeliaClub = createdClubs.find(c => c.name === 'Cinefelia');
    const ieeeRasClub = createdClubs.find(c => c.name === 'IEEE RAS');
    const litmusClub = createdClubs.find(c => c.name === 'Litmus');
    const tmcClub = createdClubs.find(c => c.name === 'The Music Club');
    const sportsClub = createdClubs.find(c => c.name === 'Sports Club');

    // Assign events to clubs (index mapping after adding all events)
    // eventsData array: [0:Tech Symposium, 1:Web Bootcamp, 2:Hackathon, 3:Photography Workshop, 4:Cultural Fest, 5:Robotics Workshop, 6:Book Reading, 7:ML Workshop, 8:Code Sprint, 9:Film Screening, 10:Film Making, 11:Acoustic Night, 12:Guitar Workshop, 13:Photography Walk, 14:Photo Exhibition, 15:Football Tournament, 16:Yoga Session, 17:Robotics Competition, 18:IoT Workshop, 19:Poetry Slam, 20:Writing Workshop]
    
    const eventsToCreate = [
      // IEEE Events
      { ...eventsData[0], club: ieeeClub._id, contactEmail: 'ieee@muj.edu.in', contactPhone: '+91-9876543210' },
      { ...eventsData[7], club: ieeeClub._id, contactEmail: 'ieee@muj.edu.in', contactPhone: '+91-9876543210' },
      // ACM Events
      { ...eventsData[1], club: acmClub._id, contactEmail: 'acm@muj.edu.in', contactPhone: '+91-9876543211' },
      { ...eventsData[2], club: acmClub._id, contactEmail: 'acm@muj.edu.in', contactPhone: '+91-9876543211' },
      { ...eventsData[8], club: acmClub._id, contactEmail: 'acm@muj.edu.in', contactPhone: '+91-9876543211' },
      // Aperture Events
      { ...eventsData[3], club: apertureClub._id, contactEmail: 'aperture@muj.edu.in', contactPhone: '+91-9876543214' },
      { ...eventsData[13], club: apertureClub._id, contactEmail: 'aperture@muj.edu.in', contactPhone: '+91-9876543214' },
      { ...eventsData[14], club: apertureClub._id, contactEmail: 'aperture@muj.edu.in', contactPhone: '+91-9876543214' },
      // Cinefelia Events
      { ...eventsData[4], club: cinefeliaClub._id, contactEmail: 'cinefelia@muj.edu.in', contactPhone: '+91-9876543212' },
      { ...eventsData[9], club: cinefeliaClub._id, contactEmail: 'cinefelia@muj.edu.in', contactPhone: '+91-9876543212' },
      { ...eventsData[10], club: cinefeliaClub._id, contactEmail: 'cinefelia@muj.edu.in', contactPhone: '+91-9876543212' },
      // The Music Club Events
      { ...eventsData[11], club: tmcClub._id, contactEmail: 'tmc@muj.edu.in', contactPhone: '+91-9876543213' },
      { ...eventsData[12], club: tmcClub._id, contactEmail: 'tmc@muj.edu.in', contactPhone: '+91-9876543213' },
      // Sports Club Events
      { ...eventsData[15], club: sportsClub._id, contactEmail: 'sports@muj.edu.in', contactPhone: '+91-9876543215' },
      { ...eventsData[16], club: sportsClub._id, contactEmail: 'sports@muj.edu.in', contactPhone: '+91-9876543215' },
      // IEEE RAS Events
      { ...eventsData[5], club: ieeeRasClub._id, contactEmail: 'ieee_ras@muj.edu.in', contactPhone: '+91-9876543216' },
      { ...eventsData[17], club: ieeeRasClub._id, contactEmail: 'ieee_ras@muj.edu.in', contactPhone: '+91-9876543216' },
      { ...eventsData[18], club: ieeeRasClub._id, contactEmail: 'ieee_ras@muj.edu.in', contactPhone: '+91-9876543216' },
      // Litmus Events
      { ...eventsData[6], club: litmusClub._id, contactEmail: 'litmus@muj.edu.in', contactPhone: '+91-9876543217' },
      { ...eventsData[19], club: litmusClub._id, contactEmail: 'litmus@muj.edu.in', contactPhone: '+91-9876543217' },
      { ...eventsData[20], club: litmusClub._id, contactEmail: 'litmus@muj.edu.in', contactPhone: '+91-9876543217' },
    ];

    // Create events one by one to handle QR code generation
    const createdEvents = [];
    for (const eventData of eventsToCreate) {
      const event = new Event(eventData);
      await event.save();
      
      // Find club for QR code
      const eventClub = createdClubs.find(c => c._id.toString() === event.club.toString());
      
      // Generate QR code for event
      try {
        const QRCode = require('qrcode');
        const qrData = JSON.stringify({
          eventId: event._id,
          eventName: event.title,
          clubName: eventClub ? eventClub.name : 'Club'
        });
        event.qrCode = await QRCode.toDataURL(qrData);
        await event.save();
      } catch (qrError) {
        console.error('QR code generation error:', qrError);
      }
      
      createdEvents.push(event);
    }
    console.log(`Created ${createdEvents.length} events`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nClub Login Credentials:');
    console.log('IEEE: ieee@muj.edu.in / ieee1234');
    console.log('ACM: acm@muj.edu.in / acm1234');
    console.log('Cinefelia: cinefelia@muj.edu.in / cinefelia1234');
    console.log('The Music Club: tmc@muj.edu.in / tmc1234');
    console.log('Aperture: aperture@muj.edu.in / aperture1234');
    console.log('Sports Club: sports@muj.edu.in / sports1234');
    console.log('IEEE RAS: ieee_ras@muj.edu.in / ieee_ras1234');
    console.log('Litmus: litmus@muj.edu.in / litmus1234');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
