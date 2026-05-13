import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  DocumentData,
  QueryConstraint,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

/**
 * Add a new document to a collection
 */
export const addDocument = async <T extends DocumentData>(
  collectionName: string,
  data: T
): Promise<string> => {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

/**
 * Set a document (creates or overwrites)
 */
export const setDocument = async <T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: T,
  merge: boolean = true
): Promise<void> => {
  const docRef = doc(db, collectionName, docId);
  return setDoc(
    docRef,
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge }
  );
};

/**
 * Get a single document by ID
 */
export const getDocument = async <T extends DocumentData>(
  collectionName: string,
  docId: string
): Promise<T | null> => {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as T) : null;
};

/**
 * Query documents from a collection
 */
export const queryDocuments = async <T extends DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<(T & { id: string })[]> => {
  const q = query(collection(db, collectionName), ...constraints);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  })) as (T & { id: string })[];
};

/**
 * Get documents by a field value
 */
export const getDocumentsByField = async <T extends DocumentData>(
  collectionName: string,
  fieldName: string,
  fieldValue: any
): Promise<(T & { id: string })[]> => {
  const q = query(
    collection(db, collectionName),
    where(fieldName, '==', fieldValue)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  })) as (T & { id: string })[];
};

/**
 * Update a document
 */
export const updateDocument = async <T extends Partial<DocumentData>>(
  collectionName: string,
  docId: string,
  data: T
): Promise<void> => {
  const docRef = doc(db, collectionName, docId);
  return updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Delete a document
 */
export const deleteDocument = async (
  collectionName: string,
  docId: string
): Promise<void> => {
  const docRef = doc(db, collectionName, docId);
  return deleteDoc(docRef);
};

/**
 * Get all documents from a collection
 */
export const getAllDocuments = async <T extends DocumentData>(
  collectionName: string
): Promise<(T & { id: string })[]> => {
  return queryDocuments<T>(collectionName);
};
