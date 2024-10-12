import { doc, setDoc, updateDoc } from "firebase/firestore"; // Asegúrate de importar updateDoc
import { db } from "./config";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore"; 

const USERS_COLLECTION = "Registro-Empleados"; // Define la colección de usuarios

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
      Password: formData.password // Asegúrate de manejar las contraseñas de forma segura
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
        id: item.id,    // Incluye el ID del documento
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
