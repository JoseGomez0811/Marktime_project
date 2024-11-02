import { arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./config";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

const USERS_COLLECTION = "Registro-Empleados"; // Define la colección de usuarios
const HOURS_COLLECTION = "Horas-Trabajadas"; //Coleccion de horas

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
    // Crea una consulta para buscar el documento en la colección 'Registro-Empleados' donde el correo coincida
    const userQuery = query(
      collection(db, USERS_COLLECTION),
      where("Correo", "==", correo) // Usa "Correo" como el campo adecuado
    );

    // Obtén los documentos que coinciden con la consulta
    const results = await getDocs(userQuery);

    // Si se encontraron resultados, devuelve el primer usuario encontrado
    if (results.size > 0) {
      const [user] = results.docs.map((item) => ({
        ...item.data(), // Trae todos los datos del documento
        id: item.id, // Incluye el ID del documento
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
export async function updateProfile(data, userId) {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId); // Referencia al documento del usuario
    await updateDoc(userRef, data); // Actualiza el documento con los nuevos datos
    return true; // Retorna true si la actualización fue exitosa
  } catch (error) {
    console.error("Error al actualizar el perfil del usuario: ", error);
    throw error; // Lanza el error para manejo posterior
  }
}

export async function getUserSalaryByEmail(correo) {
  try {
    // Crea una consulta para buscar el documento en la colección 'registro-empleados' donde el correo coincida
    const userQuery = query(
      collection(db, "Registro-Empleados"),
      where("Correo", "==", correo)
    );

    // Obtén los documentos que coinciden con la consulta
    const results = await getDocs(userQuery);

    // Si se encontraron resultados, devuelve el campo 'Sueldo' del primer documento encontrado
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

// anadir records a la BDD
export async function addTimeRecordToBDD(userEmail, startTime, endTime, horas) {
  try {
    const userQuery = query(
      collection(db, USERS_COLLECTION),
      where("Correo", "==", userEmail) // Usa "Correo" como el campo adecuado
    );

    // Obtén los documentos que coinciden con la consulta
    const results = await getDocs(userQuery);

    // Se encontró al menos un documento
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
    console.error("Error en la funcion anadir time record");
    throw error;
  }
}

//pa no poner todo en la misma funcion
async function addRecordByCedula(cedula, startTime, endTime, horas) {
  try {
    const userQuery = query(
      collection(db, HOURS_COLLECTION),
      where("ID", "==", cedula) // Usa la cedula
    );

    // Obtener los documentos que coinciden con la consulta
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
      console.log("Creadinho");
    }
  } catch (error) {
    console.error("Error añadiendo el registro de horas: ", error);
  }
}

//WIP, NOT IMPLEMENTED
export async function getTimeRecordsByDay(today, userEmail) {
  const startOfDay = new Date(day);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(day);
  endOfDay.setHours(23, 59, 59, 9999);

  try {
    const userQuery = query(
      collection(db, USERS_COLLECTION),
      where("Correo", "==", userEmail) // Usa "Correo" como el campo adecuado
    );

    if (!results.empty) {
      results.forEach((doc) => {
        const data = doc.data();
        const cedula = data.Cédula;
      });

      const recordsQuery = query(
        collection(db, "Horas-Trabajadas"),
        where(
          where("fecha inicio", ">=", Timestamp.fromDate(startOfDay)),
          where("fecha inicio", "<=", Timestamp.fromDate),
          where("Cédula" == cedula)
        )
      );
    } else {
      console.log(
        "No se encontró ningún usuario con el correo proporcionado para buscar la tabla de registros de horas"
      );
    }
  } catch {
    console.log("error en la funcion de traer tabla de registros de horas");
  }
}

export const getHoursRecords = async (cedula) => {
  try {
    const hoursCollection = collection(db, HOURS_COLLECTION);
    const q = query(hoursCollection, where("ID", "==", cedula));
    const querySnapshot = await getDocs(q);

    let hoursRecords = [];

    querySnapshot.forEach((doc) => {
      const registroHoras = doc.data()["Registro de Horas"] || [];

      const formattedRecords = registroHoras.map((record, index) => {
        // Convertir los timestamps de Firestore a objetos Date
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
