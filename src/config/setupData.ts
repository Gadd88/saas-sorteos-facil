import { collection, setDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

export async function seedNumbers() {
  for (let i = 0; i <= 99; i++) {
    await setDoc(doc(collection(db, "numeros"), i.toString()), {
      id: i,
      estado: "disponible",
    });
  }
  console.log("Datos cargados correctamente ✅");
}
