import { Question, Track } from './types';

export const ASSESSMENT_QUESTIONS: Question[] = [
  { id: 1, text: "How often have you been upset because of something that happened unexpectedly?" },
  { id: 2, text: "How often have you felt that you were unable to control the important things in your life?" },
  { id: 3, text: "How often have you felt nervous and stressed?" },
  { id: 4, text: "How often have you felt confident about your ability to handle your personal problems?" },
  { id: 5, text: "How often have you felt that things were going your way?" },
  { id: 6, text: "How often have you found that you could not cope with all the things that you had to do?" },
  { id: 7, text: "How often have you been able to control irritations in your life?" },
  { id: 8, text: "How often have you felt that you were on top of things?" },
  { id: 9, text: "How often have you been angered because of things that were outside of your control?" },
  { id: 10, text: "How often have you felt difficulties were piling up so high that you could not overcome them?" },
  { id: 11, text: "How often have you found yourself thinking about things that you have to accomplish?" },
  { id: 12, text: "How often have you been able to control the way you spend your time?" },
];

export const LIKERT_SCALE_OPTIONS = [
  { label: "Never", value: 0 },
  { label: "Almost Never", value: 1 },
  { label: "Sometimes", value: 2 },
  { label: "Fairly Often", value: 3 },
  { label: "Very Often", value: 4 },
];

export const MUSIC_TRACKS: Track[] = [
  { id: 1, title: 'Soft Piano Focus', artist: 'Minimal Keys', src: 'https://www.bensound.com/bensound-music/bensound-relaxing.mp3' },
  { id: 2, title: 'Gentle Piano Meditation', artist: 'Calm Piano', src: 'https://www.bensound.com/bensound-music/bensound-slowmotion.mp3' },
  { id: 3, title: 'Peaceful Piano Moment', artist: 'Serene Keys', src: 'https://www.bensound.com/bensound-music/bensound-sunny.mp3' },
  { id: 4, title: 'Drifting Ambient', artist: 'Peaceful Waves', src: 'https://www.bensound.com/bensound-music/bensound-dreams.mp3' },
  { id: 5, title: 'Minimal Keys - Focus', artist: 'Soft Melody', src: 'https://www.bensound.com/bensound-music/bensound-meditation.mp3' },
  { id: 6, title: 'Warm Evening', artist: 'Synth Comfort', src: 'https://www.bensound.com/bensound-music/bensound-ukulele.mp3' },
];