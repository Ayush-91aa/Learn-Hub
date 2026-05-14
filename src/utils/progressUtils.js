import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Mark a lesson as complete for a user
 */
export async function markLessonComplete(userId, courseId, lessonId) {
  const progressRef = doc(db, 'users', userId, 'progress', courseId);
  const snap = await getDoc(progressRef);

  let completedLessons = [];
  if (snap.exists()) {
    completedLessons = snap.data().completedLessons || [];
  }

  if (!completedLessons.includes(lessonId)) {
    completedLessons.push(lessonId);
  }

  await setDoc(progressRef, {
    completedLessons,
    lastWatchedLesson: lessonId,
    lastUpdated: serverTimestamp(),
  }, { merge: true });
}

/**
 * Unmark a lesson (toggle off)
 */
export async function unmarkLessonComplete(userId, courseId, lessonId) {
  const progressRef = doc(db, 'users', userId, 'progress', courseId);
  const snap = await getDoc(progressRef);

  if (snap.exists()) {
    let completedLessons = snap.data().completedLessons || [];
    completedLessons = completedLessons.filter(id => id !== lessonId);
    await setDoc(progressRef, { completedLessons, lastUpdated: serverTimestamp() }, { merge: true });
  }
}

/**
 * Get progress for a specific course
 */
export async function getCourseProgress(userId, courseId) {
  const progressRef = doc(db, 'users', userId, 'progress', courseId);
  const snap = await getDoc(progressRef);

  if (snap.exists()) {
    return snap.data();
  }
  return { completedLessons: [], lastWatchedLesson: null };
}

/**
 * Get progress for all courses
 */
export async function getAllProgress(userId, courseIds) {
  const progress = {};
  for (const courseId of courseIds) {
    progress[courseId] = await getCourseProgress(userId, courseId);
  }
  return progress;
}
