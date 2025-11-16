import { Question, Track } from './types';

export const ASSESSMENT_QUESTIONS: Question[] = [
  { id: 1, text: "In the last month, how often have you been upset because of something that happened unexpectedly?" },
  { id: 2, text: "In the last month, how often have you felt that you were unable to control the important things in your life?" },
  { id: 3, text: "In the last month, how often have you felt nervous and stressed?" },
  { id: 4, text: "In the last month, how often have you felt confident about your ability to handle your personal problems?" },
  { id: 5, text: "In the last month, how often have you felt that things were going your way?" },
  { id: 6, text: "In the last month, how often have you found that you could not cope with all the things that you had to do?" },
  { id: 7, text: "In the last month, how often have you been able to control irritations in your life?" },
  { id: 8, text: "In the last month, how often have you felt that you were on top of things?" },
  { id: 9, text: "In the last month, how often have you been angered because of things that were outside of your control?" },
  { id: 10, text: "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?" },
  { id: 11, text: "In the last month, how often have you found yourself thinking about things that you have to accomplish?" },
  { id: 12, text: "In the last month, how often have you been able to control the way you spend your time?" },
];

export const LIKERT_SCALE_OPTIONS = [
  { label: "Never", value: 0 },
  { label: "Almost Never", value: 1 },
  { label: "Sometimes", value: 2 },
  { label: "Fairly Often", value: 3 },
  { label: "Very Often", value: 4 },
];

export const MUSIC_TRACKS: Track[] = [
    { id: 1, title: 'Peaceful Meditation', artist: 'Mindful Moments', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { id: 2, title: 'Calm River', artist: 'Nature Sounds', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { id: 3, title: 'Forest Walk', artist: 'Ambiance', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
    { id: 4, title: 'Gentle Rain', artist: 'Relaxing Tones', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
    { id: 5, title: 'Morning Birds', artist: 'Dawn Chorus', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
];