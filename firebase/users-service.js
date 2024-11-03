import {
  arrayUnion,
  doc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "./config";

const USERS_COLLECTION = "Registro-Empleados"; // Define la colección de usuarios
const HOURS_COLLECTION = "Horas-Trabajadas"; // Colección de horas

// Función para insertar datos en la colección de empleados
export const insertData = async (formData) => {
  try {
    await addDoc(collection(db, USERS_COLLECTION), {
      Nombres: formData.nombres,
      Apellidos: formData.apellidos,
      Correo: formData.correo,
      Cédula: parseInt(formData.cedula),
      NumeroDeTelefono: formData.telefono,
      Cargo: formData.cargo,
      Banco: [formData.banco, parseInt(formData.cuenta)],
      Sueldo: parseFloat(formData.sueldo),
      Password: formData.password, // Asegúrate de manejar las contraseñas de forma segura
    });
    console.log("Documento agregado con éxito");
  } catch (error) {
    console.error("Error al agregar el documento: ", error);
  }
};

// Función para obtener el perfil de un usuario por su correo
export async function getUserProfile(correo) {
  try {
    const userQuery = query(
      collection(db, USERS_COLLECTION),
      where("Correo", "==", correo)
    );

    const results = await getDocs(userQuery);

    if (results.size > 0) {
      const [user] = results.docs.map((item) => ({
        ...item.data(),
        id: item.id,
      }));
      return user;
    } else {
      console.log("No se encontró ningún usuario con el correo proporcionado");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener el perfil del usuario: ", error);
    throw error;
  }
}

// Función para obtener todos los usuarios
export async function getUser() {
  const userQuery = query(collection(db, USERS_COLLECTION));

  const results = await getDocs(userQuery);
  if (results.size > 0) {
    const users = results.docs.map((item) => ({
      ...item.data(),
      id: item.id,
    }));
    return users;
  }
}

// Función para actualizar los datos del usuario
export async function updateUserProfile(userId, userData) {
  // Verifica que userId sea una cadena
  if (typeof userId !== "string") {
    console.error("Error: El ID del usuario no es una cadena.");
    return false; // Detener ejecución si no es una cadena
  }

  if (!userId) {
    console.error("Error: El ID del usuario es indefinido.");
    return false; // Detener ejecución si está indefinido
  }

  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, userData);
    console.log("Perfil actualizado con éxito");
    return true;
  } catch (error) {
    console.error("Error al actualizar el perfil del usuario: ", error);
    throw error;
  }
}

// Función para obtener el sueldo de un usuario por su correo
export async function getUserSalaryByEmail(correo) {
  try {
    const userQuery = query(
      collection(db, USERS_COLLECTION),
      where("Correo", "==", correo)
    );

    const results = await getDocs(userQuery);

    if (results.size > 0) {
      const [userDoc] = results.docs;
      return userDoc.data().Sueldo;
    } else {
      console.log("No se encontró ningún usuario con el correo proporcionado");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener el sueldo del usuario: ", error);
    throw error;
  }
}

// Añadir registros a la base de datos
export async function addTimeRecordToBDD(userEmail, startTime, endTime, horas) {
  try {
    const userQuery = query(
      collection(db, USERS_COLLECTION),
      where("Correo", "==", userEmail)
    );

    const results = await getDocs(userQuery);

    if (!results.empty) {
      results.forEach((doc) => {
        const data = doc.data();
        const cedula = data.Cédula;

        addRecordByCedula(cedula, startTime, endTime, horas);
      });
    } else {
      console.log("No se encontró ningún usuario con el correo proporcionado.");
    }
  } catch (error) {
    console.error("Error en la función añadir time record");
    throw error;
  }
}

// Función auxiliar para añadir registros por cédula
async function addRecordByCedula(cedula, startTime, endTime, horas) {
  try {
    const userQuery = query(
      collection(db, HOURS_COLLECTION),
      where("ID", "==", cedula)
    );

    const results = await getDocs(userQuery);

    if (!results.empty) {
      results.forEach(async (document) => {
        const data = document.data();
        const docID = document.id;
        const docRef = doc(db, HOURS_COLLECTION, docID);
        const prevRecords = data["Registro de Horas"];
        const newRecord = {
          "fecha inicio": startTime,
          "fecha fin": endTime,
          horas: horas,
        };
        prevRecords.push(newRecord);
        await updateDoc(docRef, {
          "Registro de Horas": arrayUnion(newRecord),
        });
      });
    } else {
      await addDoc(collection(db, HOURS_COLLECTION), {
        ID: cedula,
        "Registro de Horas": [
          {
            "fecha inicio": startTime,
            "fecha fin": endTime,
            horas: horas,
          },
        ],
      });
      console.log("Registro creado con éxito");
    }
  } catch (error) {
    console.error("Error añadiendo el registro de horas: ", error);
  }
}

// Función para obtener los registros de horas
export const getHoursRecords = async (cedula) => {
  try {
    const hoursCollection = collection(db, HOURS_COLLECTION);
    const q = query(hoursCollection, where("ID", "==", cedula));
    const querySnapshot = await getDocs(q);

    let hoursRecords = [];

    querySnapshot.forEach((doc) => {
      const registroHoras = doc.data()["Registro de Horas"] || [];

      const formattedRecords = registroHoras.map((record, index) => {
        const startTime =
          record["fecha inicio"]?.toDate?.() ||
          new Date(record["fecha inicio"]);
        const endTime =
          record["fecha fin"]?.toDate?.() || new Date(record["fecha fin"]);

        return {
          id: index + 1,
          startTime,
          endTime,
          horas: record.horas,
        };
      });

      hoursRecords = [...hoursRecords, ...formattedRecords];
    });

    return hoursRecords;
  } catch (error) {
    console.error("Error al obtener los registros de horas:", error);
    throw error;
  }
};

export async function swapIDHourRegistry(oldCedula, newCedula) {
  try {
    const userQuery = query(
      collection(db, HOURS_COLLECTION),
      where("ID", "==", oldCedula)
    );

    const results = await getDocs(userQuery);

    if (!results.empty) {
      results.forEach(async (document) => {
        const docRef = doc(db, HOURS_COLLECTION, document.id);
        await updateDoc(docRef, { ID: newCedula });
      });
    } else {
      console.log("no encontre el archivo");
    }
  } catch (error) {
    console.error(
      "Error añadiendo en el update del id del registro de horas",
      error
    );
  }
}
