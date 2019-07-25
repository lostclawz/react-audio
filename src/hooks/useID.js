import { useRef } from 'react';
import uuid from 'uuid/v1';

export default function useID() {
   const id = useRef(uuid());
   return id.current;
}
